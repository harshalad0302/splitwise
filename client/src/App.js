import React, { Component } from 'react';
import './App.css';
import Main from './Component/Main';
import { Provider } from 'react-redux';
import config_store from './Store/config_store'
import ApolloClient from 'apollo-boost'
//const { ApolloClient } = require('apollo-client')
//import ApolloClient from '@apollo/client'
import {ApolloProvider} from 'react-apollo'
//import { ApolloClient } from 'apollo-client'

// const client= new ApolloClient({
//   uri:'http://localhost:3002/graphql'
// })


const client = new ApolloClient({
  uri: 'http://localhost:3002/graphql',
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLErrors', graphQLErrors)
    console.log('networkError', networkError)
  }
})

const store = config_store()



//App Component
class App extends Component {




  render() {
    return (

     <ApolloProvider client={client}>
        <Provider store={store}>
          <Main />
        </Provider>
        </ApolloProvider>
     

    );
  }
}

export default App;