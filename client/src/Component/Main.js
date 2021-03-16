import React, {Component} from 'react';
import {BrowserRouter,Route} from 'react-router-dom';


import Login from './Login/Login';
import signup from './signup/signup';
import landing from './Landing/landing';
import dashboard from './Dashboard/dashboard';
import profile from './Profile/profile'
import group_page from './group_page/group_page'
import Create_groups from './Create_groups/Create_groups'

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
         <BrowserRouter>
            <Route exact path="/" component={landing}/>
            <Route exact path="/Login" component={Login}/>
            <Route path="/signup" component={signup}/> 
            <Route path="/dashboard" component={dashboard}/> 
            <Route path="/profile" component={profile}/> 
            <Route path="/group_page" component={group_page}/> 
            <Route path="/Create_groups" component={Create_groups}/> 
            </BrowserRouter>
            </div>


            
        )
    }
}
//Export The Main Component
export default Main;