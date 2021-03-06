import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { add_user } from '../../Actions/user_action'
import backendServer from '../../WebConfig';
import HomeHeader from '../HomeHeader/HomeHeader'
import { LOGIN } from '../GraphQL/Queries'
import { withApollo } from 'react-apollo'

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
            error_message: "",
            token: ""
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

        this.props.client.query({
            query: LOGIN,
            variables: {
                emailid: data.emailid,
                password: data.password
            }

        }).then(res => {
            if (res.data.error) {
                alert("Error")
            }
            else {

                let response_login = {

                }
                response_login.data = res.data.login
              
                console.log("response_login.data is --------------",response_login.data)
                if (response_login.data.auth_flag === "S") {
                    //Redux dispath
                    this.props.dispatch(add_user(response_login.data))
                    //set data in local storage 
                    localStorage.setItem('name', response_login.data.name)
                    localStorage.setItem('emailid', response_login.data.emailid)
                    localStorage.setItem('UID', response_login.data.UID)
                    localStorage.setItem('phone_number', response_login.data.phone_number)
                    localStorage.setItem('profile_photo', response_login.data.profile_photo)
                    localStorage.setItem('token', response_login.data.token)
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
        })



        //  const response_login = await axios.post(`${backendServer}/login`, data)

        // if (response_login.data.auth_flag === "S") {
        //     //Redux dispath
        //     this.props.dispatch(add_user(response_login.data))
        //     //set data in local storage 
        //     localStorage.setItem('name', response_login.data.name)
        //     localStorage.setItem('emailid', response_login.data.emailid)
        //     localStorage.setItem('UID', response_login.data.UID)
        //     localStorage.setItem('phone_number', response_login.data.phone_number)
        //     localStorage.setItem('profile_photo', response_login.data.profile_photo)
        //     localStorage.setItem('token', response_login.data.token)

        //     this.props.history.push("/actual_dashboard")
        //     this.setState({
        //         auth_flag: false
        //     })

        // }
        // else {
        //     this.setState({
        //         auth_flag: true,
        //         error_message: <div>
        //         {
        //             response_login.data.message.map((error_message, index) => {
        //                 return (
        //                     <div key={index}>
        //                        <ul list-style-position="inside" >
        //                            <li>{error_message}</li>
        //                            </ul> 
        //                     </div>
        //                 )
        //             })
        //         }
        //     </div>
        //     })
        // }





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


export default withApollo(connect(connection_to_redux)(Login));

//export default connect(connection_to_redux)(Login);

