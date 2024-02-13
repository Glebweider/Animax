import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, View } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import StackNavigator from './src/screens/Stack/StackNavigator';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://shikimori.me/api/graphql', // Замените на URL вашего GraphQL-сервера
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <StatusBar backgroundColor="#181A20" />  
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </Provider>
    </ApolloProvider>
  );
};

export default App;