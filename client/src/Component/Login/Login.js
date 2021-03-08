import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { add_user } from '../../Actions/user_action'


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
        const response_login = await axios.post('http://localhost:3002/Login', data)


        if (response_login.data.auth_flag_email_login === "S") {


            //Redux dispath
            this.props.dispatch(add_user(response_login.data))
          //  console.log("---------------------",response_login.data.phone_number)
           // console.log(this.state)
            this.props.history.push("/dashboard")
            this.setState({
                auth_flag: false
            })


        }
        else {
            this.setState({
                auth_flag: true,
                error_message:
                    <div>
                        <h2>{response_login.data.error_messgae}</h2>
                    </div>
            })
        }



    }

    render() {


        return (

            <div>

                <div className="App">
                    <h1>Splitwise</h1>
                    <br></br>
                    <label>Email address   :</label>
                    <br></br>
                    <input onChange={this.EmailChangeHandler} type="text" />
                    <br></br>
                    <br></br>
                    <label>Password   :</label>
                    <br></br>
                    <input onChange={this.passwordChangeHandle} type="password" />
                    <br></br>
                    <br></br>
                    <button onClick={this.SubmitLogin}>Login</button>

                    {this.state.auth_flag && <div>{this.state.error_message} </div>}

                    <br></br>
                    <br></br>

                </div>
            </div>
        )
    }
}


export default connect(connection_to_redux)(Login);

// const mapStateToProps = (state) => {
//     return state;
//   }
 
// export default connect(mapStateToProps)(Login);