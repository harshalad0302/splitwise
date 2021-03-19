import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import HomeHeader from '../HomeHeader/HomeHeader'
import { Redirect } from 'react-router';
import backendServer from '../../../src/WebConfig';
import { connect } from 'react-redux';
import { add_user } from '../../Actions/user_action'


const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}


class signup extends Component {


    constructor(props) {
        super(props);
        this.state = {
            name: "",
            password: "",
            emailid: "",
            auth_flag: false,
            error_message: "",
            auth_flag_second_email: false,
            error_message_email_already_p: ""
        }

    }

    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }

    nameChangeHandler = (e) => {
        this.setState({
            name: e.target.value
        })
    }

    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    Email_idChangeHandler = (e) => {
        this.setState({
            emailid: e.target.value
        })
    }


    submitSignUp = async (e) => {


        e.preventDefault();
        const data = {
            name: this.state.name,
            password: this.state.password,
            emailid: this.state.emailid

        }


        const response = await axios.post(`${backendServer}/signup`, data)

        if (response.data.auth_flag_email === "S") {

            this.props.history.push("/dashboard");
            this.props.dispatch(add_user(response.data))
        }

        if (response.data.auth_flag_email === "F") {
            this.setState({
                auth_flag: true,
                error_message: <div>
                    <h2 >The following errors occurred:</h2>
                    <ul list-style-position="inside" >
                        <li>First name can't be blank</li>
                        <li>Email address can't be blank</li>
                        <li>Password is too short (minimum is 8 characters)</li>
                        <li>Please enter a valid email address.</li>
                    </ul>
                </div>
            })



        }

        if (response.data.auth_flag_email === "Femail_already") {
            this.setState({
                auth_flag_second_email: true,
                error_message_email_already_p: response.data.error_message
            })
        }


    }



    render() {


        return (
            <div>
               
                <HomeHeader props={this.props}/>
               
                
                <br></br>
               
                <label><b>Name   :</b></label>
                <br></br>
                <input onChange = {this.nameChangeHandler} type="text" />
                <br></br>
                <br></br>
                <label><b>Email ID   :</b></label>
                <br></br>
                <input onChange = {this.Email_idChangeHandler} type="text" />
                <br></br>
                <br></br>
                <label><b>Password   :</b></label>
                <br></br>
                <input onChange = {this.passwordChangeHandler} type="password" />
                <br></br>
                <br></br>
                <button className="button_signUp" onClick={this.submitSignUp} >SignUp</button>
                {this.state.auth_flag && <div>{this.state.error_message} </div>}
                <div>
           
                {this.state.auth_flag_second_email && <div>{this.state.error_message_email_already_p} </div>}
     
                </div>
            </div>
        )
    }
}


export default connect(connection_to_redux)(signup);