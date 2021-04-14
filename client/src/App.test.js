import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { Provider } from 'react-redux'
import configureStore from './Store/config_store'
import Landing from './Component/Landing/landing'
import Login from './Component/Login/Login'
import Signup from './Component/signup/signup'
import Profile from './Component/Profile/profile'
const store = configureStore()

test('loads and displays landing', async () => {
    const landing_test =  render(
       <Provider store={store}>
         <Landing />
       </Provider>
     )
     expect(screen.getByRole('heading')).toHaveTextContent('Landing page of Splitwise')

   })


   test('loads and displays login', async () => {
    const Login_test =  render(
       <Provider store={store}>
         <Login />
       </Provider>
     )
    
   expect(screen.getByTestId('loginid')).toHaveTextContent('Email address')
   
   })


   test('loads and displays signup', async () => {
    const Signup_test =  render(
       <Provider store={store}>
         <Signup />
       </Provider>
     )
    
   expect(screen.getByTestId('signupid')).toHaveTextContent('Name:')
     //expect(screen.getByRole('heading')).toHaveTextContent('Landing page of Splitwise')

   })

   test('loads and displays profile', async () => {
    const profile_test =  render(
       <Provider store={store}>
         <Profile />
       </Provider>
     )
    
   expect(screen.getByTestId('profileid')).toHaveTextContent('Your name')
     //expect(screen.getByRole('heading')).toHaveTextContent('Landing page of Splitwise')

   })


   test('loads and displays header on profile', async () => {
    const profile_test =  render(
       <Provider store={store}>
         <Profile />
       </Provider>
     )
    
   expect(screen.getByTestId('profileid')).toHaveTextContent('Your name')
     //expect(screen.getByRole('heading')).toHaveTextContent('Landing page of Splitwise')

   })





   