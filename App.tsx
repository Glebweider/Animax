import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationBar } from 'expo-navigation-bar';
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache, Observable } from '@apollo/client';

import { AlertProvider } from '@Components/alert/AlertContext';
import store from './src/redux/store';
import StackNavigator from './src/screens/Stack/StackNavigator';


const AppTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: '#181A20',
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

const httpLink = new HttpLink({ uri: process.env.EXPO_PUBLIC_ANIME_API_GRAPHQL });

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

NavigationBar.setHidden(true);

const App = () => {
	return (
		<ApolloProvider client={client}>
			<Provider store={store}>
				<AlertProvider>
					<StatusBar backgroundColor="#181A20" />
					<NavigationContainer theme={AppTheme}>
						<StackNavigator />
					</NavigationContainer>
				</AlertProvider>
			</Provider>
		</ApolloProvider>
	);
};

export default App;