import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { add_user } from '../../Actions/user_action'
import backendServer from '../../WebConfig';
import HomeHeader from '../HomeHeader/HomeHeader'

//connection to global store
const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}


class Login extends Component {


    constructor(props) {
        super(props);
        this.state = {
            emailid: "",
            password: "",
            auth_flag: false,
            error_message: ""
        }


    }


    passwordChangeHandle = (e) => {
        this.setState({
            password: e.target.value
        })
    }


    EmailChangeHandler = (e) => {
        this.setState({
            emailid: e.target.value
        })
    }


    SubmitLogin = async (e) => {
        e.preventDefault();
        const data = {
            emailid: this.state.emailid,
            password: this.state.password
        }
         const response_login = await axios.post(`${backendServer}/login`, data)

            if (response_login.data.auth_flag === "S") {
                //Redux dispath
                this.props.dispatch(add_user(response_login.data))
                this.props.history.push("/actual_dashboard")
                this.setState({
                    auth_flag: false
                })

            }
            else {
                this.setState({
                    auth_flag: true,
                    error_message: <div>
                    {
                        response_login.data.message.map((error_message, index) => {
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
                <div>
                    <HomeHeader props={this.props} />
                </div>
                <div className="divleftsignup">
                    <div className="insideLeftdiv">
                    </div>
                </div>
                <div className="divrightsignup">
                    <div className="fontfamiliytext_withdifflogo">
                    </div>
                    <div className="signupinfodiv">
                        <p className="headerinSignup">Email address</p>
                        <input type="text" className="inputTextClass" onChange={this.EmailChangeHandler}></input>
                        <p className="headerinSignup">Password</p>
                        <input type="password" className="inputTextClass" onChange={this.passwordChangeHandle}></input>
                        <button className="signupbuttonClasssignuppage" onClick={this.SubmitLogin}>Login</button>
                        {this.state.auth_flag && <div className="inputTextClass red_error_background">{this.state.error_message} </div>}
                    </div>
                </div>
            </div>
        )
    }
}


export default connect(connection_to_redux)(Login);

