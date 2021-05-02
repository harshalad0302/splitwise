import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { add_user } from '../../Actions/user_action'
import Login_header from '../Login_header/Login_header'
import { connect } from 'react-redux';
import backendServer from '../../../src/WebConfig'
import avatar_image from '../../Assests/Img/avatar.png'
import create_group from '../../Assests/Img/create_group.PNG'
import Left_toggel_bar from '../Left_Toggle_bar/left_toggel_bar'
//connection to global store
const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}



class Create_groups extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: "",
            emailid_of_members: [],
            auth_flag: false,
            error_message: "",
            all_emails: undefined,
            all_emails_length: undefined,
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: ''

        }

    }


    componentDidMount = async (e) => {
        //store data from local storage to redux
       const data_to_be_stored={
           name:localStorage.getItem('name'),
           emailid:localStorage.getItem('emailid'),
           UID:localStorage.getItem('UID'),
           phone_number:localStorage.getItem('phone_number'),
           profile_photo:localStorage.getItem('profile_photo'),
           token:localStorage.getItem('token')
           
       }

       //dispatch data to redux
       this.props.dispatch(add_user(data_to_be_stored))

        //get all emails
        const data = {
            UID: this.props.user.UID
        }
        const response_all_emails = await axios.post(`${backendServer}/get_all_emails`, data)

        if (response_all_emails.data.auth_flag === "S") {
            this.setState({
                all_emails: response_all_emails.data.all_emails,
                all_emails_length: response_all_emails.data.all_emails_length
            })
        }

    }

    FileOnChange = (e) => {

        this.setState({
            file: e.target.files[0]
        })

    }

    handelOnClick() {
        this.setState({
            emailid_of_members: [...this.state.emailid_of_members, ""]


        })
    }
    handelRemoveOnClick(index) {

        this.state.emailid_of_members.splice(index, 1)
        this.setState({
            emailid_of_members: this.state.emailid_of_members

        })
    }

    handelSaveOnClick = async (e) => {
        const data = {
            emailid_of_members: this.state.emailid_of_members,
            length: this.state.emailid_of_members.length,
            owner: this.props.user.name,
            owner_UID: this.props.user.UID,
            group_name: this.state.group_name
        }

        const response_create_group = await axios.post(`${backendServer}/Create_group`, data, { headers: { "Authorization": this.props.user.token } })

        if (response_create_group.data.auth_flag === "F") {
            this.setState({
                auth_flag: true,
                error_message: <div>
                    {
                        response_create_group.data.message.map((error_message, index) => {
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
        else {
            this.props.history.push("/actual_dashboard")
        }

    }
    HandelOnChange(e, index) {
        this.state.emailid_of_members[index] = e.target.value
        this.setState({
            emailid_of_members: this.state.emailid_of_members,
            show_suggestion: true
        })



    }
    OnchangeGroup_name = (e) => {
        this.setState({
            group_name: e.target.value
        })
    }



    render() {


        return (
            <div>
                <div className="Main_inside_header">
                    <Login_header props={this.props} />
                </div>

                <div>
                    <div className="container">
                        <div className="leftdiv">

                            <Left_toggel_bar props={this.props} />
                        </div>
                    </div>

                    <div className="d-flex flex-column my-75">

                        <div>
                            <div>
                                {this.state.auth_flag && <div className="inputTextClass red_error_background">{this.state.error_message} </div>}
                            </div>
                        </div>
                        <div>
                            <div className="d-flex flex-row justify-content-start">
                                <div className="w-25">
                                    <div className="d-flex flex-row  justify-content-start ">
                                        <div className="d-flex flex-column ">
                                            <div className="mx-3 my-2">
                                                <img src={avatar_image} className="img_style"></img>
                                            </div>
                                            <div className="my-2 mx-3">
                                                <input type="file" name="filetag" onChange={this.FileOnChange} />
                                                <img src="" className="rounded mx-auto d-block" name="imagetag"></img>
                                            </div>

                                            <div>
                                                <div className="mx-3">
                                                    <button className="lightbutton" onClick={this.handelSaveOnClick} >Save</button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                                <div className=" W-75 mx-3">
                                    <div className="d-flex flex-column justify-content-start">
                                        <div className="mx-3">
                                            <img src={create_group}></img>
                                        </div>
                                        <div className="mx-3">
                                            <input className="inputTextClass1" onChange={this.OnchangeGroup_name} ></input>
                                        </div>
                                        <div className="mx-3">
                                            <p className="font_class_OWNER">Owner</p>
                                        </div>
                                        <div className="mx-3">
                                            <input className="inputTextClass1" defaultValue={this.props.user.emailid}  ></input>
                                        </div>
                                        <div>
                                            <div className="d-flex flex-row">
                                                <div className="mx-3">
                                                    <p className="font_class">Group Members</p>
                                                </div>
                                                <div className="mx-3">
                                                    <button className="lightbutton" onClick={(e) => this.handelOnClick(e)}> + Add Members</button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="d-flex flex-row justify-content-end">
                                <div className="w-25">
                                    <div className="d-flex flex-row justify-content-end pr-3">

                                    </div>
                                </div>
                                <div className="w-75">
                                    <div className="d-flex flex-column">
                                        {
                                            this.state.emailid_of_members.map((emailid_of_members, index) => {
                                                return (
                                                    <div key={index} className="mx-2">
                                                        <br />
                                                        <input value={emailid_of_members} onChange={(e) => this.HandelOnChange(e, index)} className="inputTextClass1" />
                                                        <button onClick={() => this.handelRemoveOnClick(index)} className="darkbutton">Remove Member</button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>


        )
    }
}


export default connect(connection_to_redux)(Create_groups);