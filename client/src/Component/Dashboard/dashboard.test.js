/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import TestRenderer from 'react-test-renderer';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
// import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import Dashboard from '../../Component/Dashboard/dashborad'
import allReducers from '../../Store/config_store';
import { connect } from 'react-redux';
import LoginHeader from '../../Component/Login_header/Login_header';

// const connection_to_redux = (state) => {

//     return {
//         user: state.user
//     }
// }

const store = createStore(allReducers);
// const user={
//     UID_user:1,
//     name_user:"harshala"
// }
const component = TestRenderer.create(
  <Provider store={store}>
    <MemoryRouter>
      <Dashboard >
        <LoginHeader />
      </Dashboard>{' '}
    </MemoryRouter>
  </Provider>
);

// eslint-disable-next-line no-undef
afterEach(cleanup);

it('renders', async () => {
  expect(component.toJSON()).toMatchSnapshot();
});

test('Check for header', async () => {
  const { getByTestId } = render(
    <Provider store={store}>
      <MemoryRouter>
        <Dashboard>
          <LoginHeader />
        </Dashboard>{' '}
      </MemoryRouter>
    </Provider>
  );
  expect(getByTestId('Dashboard')).toHaveTextContent('Dashboard');
});