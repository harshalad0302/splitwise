import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import Login_header from '../Login_header/Login_header'
import { connect } from 'react-redux';
import backendServer from '../../../src/WebConfig'
import * as AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import * as AutosuggestHighlightParse from 'autosuggest-highlight/parse';
//connection to global store
const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}



class Create_groups extends Component {

    
    state = {
        emailid_of_members: [],
        group_name: "",
        error_flag: false,
        error_message: "",
        all_emailid: []

    }

    componentDidMount = async (e) => {
        //get the data from backend and put in the array for suggestion

        const data = {
            UID: this.props.user.UID_user
        }

        //send to backend

        const email_id_array_all=await axios.post(`${backendServer}/get_all_email`, data)
      
       let temp_array=[]
       for(var i=0;i<email_id_array_all.data.length;i++)
       {
                 temp_array.push(email_id_array_all.data[i].emailid)
       }
       
        
        this.setState(()=>({
            all_emailid:temp_array
        }))


    }



    handelOnClick() {
        this.setState({
            emailid_of_members: [...this.state.emailid_of_members, ""]


        })
    }


    HandelOnChange(e, index) {
        this.state.emailid_of_members[index] = e.target.value
        this.setState({
            emailid_of_members: this.state.emailid_of_members
        })



    }



    handelRemoveOnClick(index) {

        this.state.emailid_of_members.splice(index, 1)
        this.setState({
            emailid_of_members: this.state.emailid_of_members

        })
    }

    handelSaveOnClick = async (e) => {


        if (this.state.group_name === "") {

            this.setState(
                {
                    error_flag: true,
                    error_message: <div>
                        <h4>Group name can't be blank</h4>
                    </div>
                }
            )
        }
        else if (this.state.emailid_of_members.length === 0) {
            this.setState(
                {
                    error_flag: true,
                    error_message: <div>
                        <h4>Cant create group with only 1 member! add members </h4>
                    </div>
                }
            )
        }

        else if (this.state.emailid_of_members.filter(emailid_of_members => emailid_of_members === "").length !== 0) {
            this.setState(
                {
                    error_flag: true,
                    error_message: <div>
                        <h4>One of group member has empty value! either remove or fill the emailid </h4>
                    </div>
                }
            )
        }

        else {


            const data = {
                emailid_of_members: this.state.emailid_of_members,
                length: this.state.emailid_of_members.length,
                owner: this.props.user.name_user,
                owner_id: this.props.user.UID_user,
                group_name: this.state.group_name
            }



            const response_create_group = await axios.post(`${backendServer}/Create_group`, data)

            if (response_create_group.data.group_name_already_p_f === "F") {
                this.setState({
                    error_flag: true,
                    error_message: <div>
                        <h4>{response_create_group.data.error_messgae}</h4>
                    </div>
                })
            }
            if (response_create_group.data.group_name_already_p_f === "S") {
                this.props.history.push("/dashboard")
            }


        }



    }

    OnchangeGroup_name = (e) => {
        this.setState({
            group_name: e.target.value
        })
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
                    <input type="text" onChange={this.OnchangeGroup_name} ></input>
                    <br />
                    <br />
                    <label>Group_members</label>
                    <br />


                    <input type="text" value={this.props.user.name_user} readOnly="readonly"></input> <input type="text" value={this.props.user.emailid_user} readOnly="readonly"></input>
                    <button onClick={(e) => this.handelOnClick(e)}>+ Add Members</button>
                    <br />
                    {
                        this.state.emailid_of_members.map((emailid_of_members, index) => {

                            return (
                                <div key={index}>
                                    <br />
                                    <input value={emailid_of_members} onChange={(e) => this.HandelOnChange(e, index)} />
                                    <button onClick={() => this.handelRemoveOnClick(index)}>Remove Member</button>
                                </div>
                            )
                        })
                    }
                    <br />
                    <br />
                    <button onClick={this.handelSaveOnClick} >SAVE</button>
                    <br />
                    <br />
                    <input type="file" name="filetag" />
                    <br></br>
                    <br></br>
                    <img src="" className="rounded mx-auto d-block" name="imagetag"></img>
                </div>

                <div>


                </div>
                {this.state.error_flag && <div>{this.state.error_message} </div>}
                <div>

                </div>

            </div>


        )
    }
}


export default connect(connection_to_redux)(Create_groups);