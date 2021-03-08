import React, { Component } from 'react';
import './App.css';
import Main from './Component/Main';
import { Provider } from 'react-redux';
import config_store from './Store/config_store'

const store = config_store()

// store.subscribe(() => {
//   console.log(store.getState())
// })

//App Component
class App extends Component {




  render() {
    return (


      <Provider store={store}>
        <Main />
      </Provider>

    );
  }
}

export default App;