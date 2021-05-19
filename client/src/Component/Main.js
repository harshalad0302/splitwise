import React, {Component} from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import Login from './Login/login';
import signup from './signup/signup';
import landing from './Landing/landing';
import profile from './Profile/profile'
import group_page from './group_page/group_page'
import Create_groups from './Create_groups/Create_groups'
import recent_activities from './Recent_activities/recent_activities'
import Actual_Dashboard from './Actual_Dashboard/actual_dashboard'
import Left_toggel_bar from './Left_Toggle_bar/left_toggel_bar'



//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
         <BrowserRouter>
            <Route exact path="/" component={landing}/>
            <Route exact path="/login" component={Login}/>
            <Route path="/signup" component={signup}/> 
            <Route path="/left_toggel_bar" component={Left_toggel_bar}/> 
            <Route path="/profile" component={profile}/> 
            <Route path="/group_page" component={group_page}/> 
            <Route path="/Create_groups" component={Create_groups}/> 
            <Route path="/recent_activities" component={recent_activities}/> 
            <Route path="/actual_Dashboard" component={Actual_Dashboard}/> 
            </BrowserRouter>
            </div>


            
        )
    }
}
//Export The Main Component
export default Main;