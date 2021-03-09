import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import Login_header from '../Login_header/Login_header'
import { connect } from 'react-redux';



const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}


class Create_groups extends Component {

    constructor(props) {
        super(props);
        this.state = {
            group_name: "",
            group_creater_UID: "",
            group_member_1:"",
            group_member_2:"",
            error_message:"",
            error_flag:false

        }


    }

    groupNameChangeHandeler =(e) =>{
        this.setState({
            group_name: e.target.value
        })
    }
    
    groupMemberChangeHandeler =(e) =>{
        this.setState({
            group_member_1:e.target.value
        })

    }


    groupMemberChangeHandeler2 =(e) =>{
        this.setState({
            group_member_2:e.target.value
        })

    }

    SaverClickHandeler = async (e) =>{

        e.preventDefault();
        const data = {
            group_creater_UID:this.props.user.UID_user,
            group_name: this.state.group_name,
            group_member_1: this.state.group_member_1,
            group_member_2: this.state.group_member_2
        }

        const response_create_group = await axios.post('http://localhost:3002/Create_group', data)

        if(response_create_group.data.create_group_flag === "F")
        {
            this.setState({
                error_message:response_create_group.data.error_message,
                error_flag:true
            })

        }

        if(response_create_group.data.create_group_flag === "S")
        {
           //group is created successfully
          // redirect now
          this.props.history.push("/dashboard")

        }

    }
    render() {


        return (
            <div>

                <div>
                    <Login_header props={this.props} />
                </div>
                <div>
                    <p>START A NEW GROUP</p>
                    <br />
                  
                    <label>My group shall be called…</label>
                    <br></br>
                    <input type="text" onChange={this.groupNameChangeHandeler}></input>
                    <br />
                    <br />
                    <label>Group_members</label>
                    <input type="text" value= {this.props.user.name_user} ></input> <input type="text" value= {this.props.user.emailid_user} ></input> 
                    <br />
                    <br />
                    <label>Group_members</label>
                    <input type="text" onChange={this.groupMemberChangeHandeler}></input>
                    <br />
                    <br />
                    <label>Group_members</label>
                    <input type="text" onChange={this.groupMemberChangeHandeler2}></input>
                    <br />
                    <br />
                    <button onClick={this.SaverClickHandeler}>SAVE</button>
                    <br />
                    <br />
                    <input type="file" name = "filetag" />
                    <br></br>
                    <br></br>
                    <img src="" className="rounded mx-auto d-block" name = "imagetag"></img>
                </div>

                <div>
                {this.state.error_flag && <div>{this.state.error_message} </div>}
                
                </div>

                <div>

                </div>

        ]</div>


        )
    }
}


export default connect(connection_to_redux)(Create_groups);