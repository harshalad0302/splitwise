import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import { connect } from 'react-redux';
import { remove_user } from '../../Actions/user_action'


const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}

class Login_header extends Component {

   
    submitCreateGroup = (e) => {
        this.props.props.history.push("/Create_groups")
    }

    submitYourAccount = (e) => {
        this.props.props.history.push("/profile")
    }

    submitLogout = (e) => {
      
       this.props.props.history.push("/")
       this.props.dispatch(remove_user())

    }
    HomeOnClick =(e)=>
    {
        this.props.props.history.push("/dashboard")
    }


    submitMyGroups=(e)=>
    {
        this.props.props.history.push("/group_invite")
    }
    submitRecentActivities=(e)=>
    {
        this.props.props.history.push("/recent_activities")
    }
    render() {


        return (
            <div>
                <div className="header">
                        <div >
                            <img src={logo_image} className="header_image" />
                        </div>
                            <div>
                            <button onClick={this.HomeOnClick}>Home</button>
                            </div>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle color"  type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                   {this.props.user.name_user}
                                </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a className="dropdown-item" onClick={this.submitYourAccount}>Your Account</a>
                                    <a className="dropdown-item" onClick={this.submitCreateGroup} >Create a Group</a>
                                    <a className="dropdown-item" onClick={this.submitMyGroups} >MyGroups</a>
                                    <a className="dropdown-item" onClick={this.submitRecentActivities} >Recent Activities</a>
                                    <a className="dropdown-item" onClick={this.submitLogout}>Logout</a>
                               
                                    
                                </div>
                            </div>
                        
                </div>
            </div>
        )
    }
}


export default connect(connection_to_redux)(Login_header);