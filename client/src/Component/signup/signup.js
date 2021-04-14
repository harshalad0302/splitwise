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
        //sending to backend
        const response = await axios.post(`${backendServer}/signup`, data)

        if (response.data.auth_falg === "S") {

            this.props.history.push("/dashboard");
            this.props.dispatch(add_user(response.data))
        }

        if (response.data.auth_falg === "F") {
            this.setState({
                auth_flag: true,
                error_message: <div>
                    {
                      
                        response.data.message.map((error_message, index) => {
                            return (
                                <div key={index}>
                                   <ul list-style-position="inside" >
                                       <li>{error_message}</li>
                                       </ul> 
                                </div>
                            )
                        })
                    }
                </div>

            })

        }

       


    }



    render() {


        return (
            <div className="main_page_div">
                <div className="divleftsignup">
                    <div className="insideLeftdiv">
                    </div>
                </div>
                <div className="divrightsignup">
                    <div className="fontfamiliytext">
                    </div>
                    <div className="signupinfodiv">
                        <input onChange={this.nameChangeHandler} className="inputTextClass"></input>
                        <p className="headerinSignup">Here’s my email address:</p>
                        <input type="text" onChange={this.Email_idChangeHandler} className="inputTextClass"></input>
                        <p className="headerinSignup">And here’s my password:</p>
                        <input className="inputTextClass" onChange={this.passwordChangeHandler} type="password"></input>
                        <br />
                        <button className="signupbuttonClasssignuppage" onClick={this.submitSignUp}>Sign me up!</button>
                        <a href="/login"> already have account</a>
                        {this.state.auth_flag && <div className="inputTextClass red_error_background">{this.state.error_message} </div>}
                    </div>
                </div>
            </div>
        )
    }
}


export default connect(connection_to_redux)(signup);