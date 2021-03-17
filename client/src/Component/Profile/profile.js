import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import Login_header from '../Login_header/Login_header'
import { connect } from 'react-redux';
import { add_user } from '../../Actions/user_action'


const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}


class profile extends Component {

    
    constructor(props) {
        super(props);
        this.state = {
            emailid: "",
            name: "",
            UID:"",
            phone_number: "",
            password: "",
            auth_flag_update:""
         
        }


    }


 edit_name_click = (e) => {
   document.getElementById("name_field_id").removeAttribute('readonly');
   document.getElementById("name_field_id").removeAttribute('placeholder');
       
    }


    OnChange_name_input = (e) => {
     
        this.setState({
            name: e.target.value
           
        })    
     
    }


    edit_email_click = (e) => {
        document.getElementById("edit_email").removeAttribute('readonly');
        document.getElementById("edit_email").removeAttribute('placeholder');
            
         }
     
     
         OnChange_email_input = (e) => {
          
             this.setState({
                 emailid: e.target.value
                
             })    
          
         }



         edit_phone_number_click = (e) => {
            document.getElementById("edit_phone_number").removeAttribute('readonly');
            document.getElementById("edit_phone_number").removeAttribute('placeholder');
                
             }
         
         
             OnChange_phone_number_input = (e) => {
              
                 this.setState({
                     phone_number: e.target.value
                    
                 })    
              
             }
    

    save_button_click = async(e) =>{

      
        e.preventDefault();
        const data = {
            name: this.state.name,
            emailid: this.state.emailid,
            phone_number: this.state.phone_number,
            UID: this.props.user.UID_user
        }
      
      
    
        const response_save = await axios.post('http://localhost:3002/profile', data)

        if (response_save.data.auth_flag_edit === "S") {
         
            this.props.dispatch(add_user(response_save.data.updated_state))
            this.props.history.push("/dashboard")
          

            
        }
      
    }


    render() {

      

        return (
            <div>
                <Login_header props={this.props} />
                <div>

                    <h2>Profile</h2>
                    <div>
                        <input type="file" name="filetag" />
                        <br></br>
                        <br></br>
                        <img src="" className="rounded mx-auto d-block" name="imagetag"></img>
                        <br></br>
                        <br></br>
                        <label>Your name  </label>
                        <br />

                        <input type="text" className="input_for_profile" onChange={this.OnChange_name_input} name="Name" id="name_field_id" placeholder={this.props.user.name_user} readOnly="readonly"/>

                        <button id="edit_name" className="Edit_button" onClick={this.edit_name_click} >Edit</button>

                        <br></br>
                        <label>Your email address  </label>
                        <br />

                        <input type="text" className="input_for_profile" onChange={this.OnChange_email_input} id="edit_email"  placeholder={this.props.user.emailid_user} readOnly="readonly"/>
                        <button id="edit_email_id" className="Edit_button"  onClick={this.edit_email_click}>Edit</button>
                        <br></br>
                        <label>Your phone number  </label>
                        <br />

                        <input type="text" className="input_for_profile"onChange={this.OnChange_phone_number_input} id="edit_phone_number" placeholder={this.props.user.phone_number_user} readOnly="readonly" />
                        <button className="Edit_button"  onClick={this.edit_phone_number_click} >Edit</button>
                        <br></br>
                        <label>Your password  </label>
                        <br />

                        <input type="password" className="input_for_profile" name="password" placeholder="*******" />
                        <button id="id_password" className="Edit_button">Edit</button>
                    </div>

                    <select className="custom-select mr-sm-2" id="inlineFormCustomSelect" >
                    <option defaultValue>USD</option>
                    <option value="1">KWD</option>
                    <option value="2">BHD</option>
                    <option value="3">GBP</option>
                    <option value="4">EUR</option>
                    <option value="5">CAD</option>
                  </select>
                  
                </div>

                <div>
                <br/> <br/> <br/>
                <button id="button_save" onClick={this.save_button_click}>Save</button>
                </div>
               
               
            </div>
            
        )
    }
}


export default connect(connection_to_redux)(profile);