import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import { connect } from 'react-redux';
import { remove_user } from '../../Actions/user_action'
import backendServer from '../../WebConfig';

const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}

class login_header extends Component {


    submitYourAccount = (e) => {
        this.props.props.history.push("/profile")
    }

    submitLogout = async(e) => {

        await localStorage.clear();
        this.props.props.history.push("/")
        this.props.dispatch(remove_user())

    }
  

  
    render() {


        return (
            <div className="loginheader">

                <div className="divLeftloginheader">
                    <div className="logoinLoginHeader">
                        <img src={logo_image} className="header_image_landing" />
                    </div>
                </div>

                <div className="divRightloginheader">
                    <div className="divRightloginheader_inside">

                        <div className="dropdown">
                            <button className="button_profile">{localStorage.getItem('name')}</button>
                            <div className="dropdown-content">
                                <a onClick={this.submitYourAccount}>Your Account</a>
                                <a onClick={this.submitLogout}>Logout</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default connect(connection_to_redux)(login_header);