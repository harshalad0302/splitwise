import React, {Component} from 'react';
import {BrowserRouter,Route} from 'react-router-dom';


import Login from './Login/Login';
import signup from './signup/signup';
import landing from './Landing/landing';
import group_invite from './group_invite/group_invite';
import profile from './Profile/profile'
import group_page from './group_page/group_page'
import Create_groups from './Create_groups/Create_groups'
import dashboard from './Dashboard/dashborad'
import recent_activities from './Recent_activities/recent_activities'
import show_details from './Show_details/show_details'
import DatatablePage from '../../src/Component/DatatablePage'

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
         <BrowserRouter>
            <Route exact path="/" component={landing}/>
            <Route exact path="/Login" component={Login}/>
            <Route path="/signup" component={signup}/> 
            <Route path="/group_invite" component={group_invite}/> 
            <Route path="/profile" component={profile}/> 
            <Route path="/group_page" component={group_page}/> 
            <Route path="/dashboard" component={dashboard}/> 
            <Route path="/Create_groups" component={Create_groups}/> 
            <Route path="/show_details" component={show_details}/> 
            <Route path="/recent_activities" component={recent_activities}/> 
          
            <Route path="/DatatablePage" component={DatatablePage}/> 
            </BrowserRouter>
            </div>


            
        )
    }
}
//Export The Main Component
export default Main;