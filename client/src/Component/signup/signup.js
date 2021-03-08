import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';

import {Redirect} from 'react-router';

import { connect } from 'react-redux';
import {add_user} from '../../Actions/user_action'


const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}


class signup extends Component {


    constructor(props){
        super(props);
        this.state = {
             name : "",
            password : "",
            emailid  : "",
            auth_flag :false,
            error_message : "" ,
            auth_flag_second_email:false,
            error_message_email_already_p:""
        }
     
        }
 
        componentWillMount(){
            this.setState({
                authFlag : false
            })
        }

        nameChangeHandler = (e) => {
            this.setState({
                name : e.target.value
            })
        }
       
        passwordChangeHandler = (e) => {
            this.setState({
                password : e.target.value
            })
        }

        Email_idChangeHandler = (e) => {
            this.setState({
                emailid : e.target.value
            })
        }

       
        submitSignUp =  async (e) => 
        {

            
                e.preventDefault();
                const data = {
                    name : this.state.name,
                    password : this.state.password,
                    emailid : this.state.emailid
                  
                }


                //validation to check field is empty


                // if((this.state.name==="")||(this.state.emailid==="")||(this.state.password===""))
                // {
                //    this.setState({
                //     auth_flag :true,
                //     error_message : <div>
                //     <h2 >The following errors occurred:</h2>
                //     <ul list-style-position="inside" >
                //     <li>First name can't be blank</li>
                //     <li>Email address can't be blank</li>
                //     <li>Password is too short (minimum is 8 characters)</li>
                //     <li>Please enter a valid email address.</li>
                //     </ul>
                //     </div>
                //    })

                // }
                

               // console.log("-----------------------",data)


            const response =  await axios.post('http://localhost:3002/signup',data)

               if(response.data.auth_flag_email==="S")
               {
             
                this.props.history.push("/dashboard");
                this.props.dispatch(add_user(response.data))
               }
               
               if(response.data.auth_flag_email==="F")
               {
                this.setState({
                    auth_flag :true,
                    error_message : <div>
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

               if(response.data.auth_flag_email==="Femail_already")
               {
                     this.setState({
                        auth_flag_second_email:true,
                        error_message_email_already_p:response.data.error_message
                    })
               }

              
            }

            

    render()
    {


        return(
            <div>
            
            <div className="App">
            <h1>Registration</h1>
            <br></br>
           
            <label>Name   :</label>
            <br></br>
            <input onChange = {this.nameChangeHandler} type="text" />
            <br></br>
            <br></br>
            <label>Email ID   :</label>
            <br></br>
            <input onChange = {this.Email_idChangeHandler} type="text" />
            <br></br>
            <br></br>
            <label>Password   :</label>
            <br></br>
            <input onChange = {this.passwordChangeHandler} type="password" />
            <br></br>
            <br></br>
            <button onClick={this.submitSignUp}>SignUp</button>
            {this.state.auth_flag && <div>{this.state.error_message} </div>}
           </div> 
           <div>
           
           {this.state.auth_flag_second_email && <div>{this.state.error_message_email_already_p} </div>}

           </div>
            </div>
        )
    }
}


export default connect(connection_to_redux)(signup);