import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache, Observable } from '@apollo/client';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';

// Components
import { AlertProvider } from '@Components/alert/AlertContext';

// Data
import { COLOR_BACKGROUND_PRIMARY } from '@Data/constants';

// Stack
import StackNavigator from '@Stack/StackNavigator';

// Redux
import store from '@Redux/store';


const AppTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: COLOR_BACKGROUND_PRIMARY,
	},
};

let isThrottled = false;
let requestQueue: Array<() => void> = [];

const throttlingLink = new ApolloLink((operation, forward) => {
	return new Observable((observer) => {
		let subscription: any = null;

		const executeRequest = () => {
			subscription = forward(operation).subscribe({
				next: (result) => {
					if (result.errors?.some(err => err.message?.includes('429'))) {
						handle429();
					} else {
						observer.next(result);
					}
				},
				error: (error) => {
					if (error.statusCode === 429 || error.message?.includes('429')) {
						handle429();
					} else {
						observer.error(error);
					}
				},
				complete: () => observer.complete(),
			});
		};

		const handle429 = () => {
			if (!isThrottled) {
				isThrottled = true;
				console.warn(`[Apollo] Получен код 429. Замораживаем сеть на 1.5 секунды...`);
				setTimeout(() => {
					isThrottled = false;
					console.log(`[Apollo] Разморозка. Повторяем накопленные запросы: ${requestQueue.length}`);

					const queueToExecute = [...requestQueue];
					requestQueue = [];

					queueToExecute.forEach((retry) => retry());
				}, 1500);
			}

			requestQueue.push(executeRequest);
		};

		if (isThrottled) {
			console.log(`[Apollo-Queue] Сеть спит. Запрос "${operation.operationName}" отложен в очередь.`);
			requestQueue.push(executeRequest);
		} else {
			executeRequest();
		}

		return () => {
			if (subscription) subscription.unsubscribe();
		};
	});
});

const httpLink = new HttpLink({ uri: `${process.env.EXPO_PUBLIC_SHIKIMORI_API_URL}/api/graphql` });
const client = new ApolloClient({
	link: ApolloLink.from([throttlingLink, httpLink]),
	cache: new InMemoryCache({
		typePolicies: {
			Anime: {
				fields: {
					poster: {
						merge(existing = {}, incoming) {
							return { ...existing, ...incoming };
						},
					},
				},
			},
		},
	}),
});

NavigationBar.setVisibilityAsync('hidden');

const App = () => {
	NavigationBar.addVisibilityListener(() => {
		setTimeout(() => {
			NavigationBar.setVisibilityAsync('hidden')
		}, 2000);
	});

	return (
		<ApolloProvider client={client}>
			<Provider store={store}>
				<AlertProvider>
					<StatusBar backgroundColor={COLOR_BACKGROUND_PRIMARY} />
					<NavigationContainer theme={AppTheme}>
						<StackNavigator />
					</NavigationContainer>
				</AlertProvider>
			</Provider>
		</ApolloProvider>
	);
};

export default App;