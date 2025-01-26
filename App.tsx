import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import StackNavigator from './src/screens/Stack/StackNavigator';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { AlertProvider } from '@Components/AlertContext';

const client = new ApolloClient({
  uri: process.env.EXPO_PUBLIC_ANIME_API_GRAPHQL,
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

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <AlertProvider>
          <StatusBar backgroundColor="#181A20" />  
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </AlertProvider>
      </Provider>
    </ApolloProvider>
  );
};

export default App;