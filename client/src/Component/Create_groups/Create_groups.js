import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import Login_header from '../Login_header/login_header'
import { connect } from 'react-redux';
import backendServer from '../../../src/WebConfig'
import avatar_image from '../../Assests/Img/avatar.png'
import create_group from '../../Assests/Img/create_group.PNG'
import Left_toggel_bar from '../Left_Toggle_bar/left_toggel_bar'
import * as AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import * as AutosuggestHighlightParse from 'autosuggest-highlight/parse';
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
            error_message: ""

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

        const response_create_group = await axios.post(`${backendServer}/Create_group`, data)

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
            emailid_of_members: this.state.emailid_of_members
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
                            <div className="d-flex flex-row justify-content-end">
                                <div className="w-25 ">
                                    <div className="d-flex flex-row  justify-content-end ">
                                        <div className="d-flex flex-column pt-3">
                                            <div>
                                                <img src={avatar_image} className="img_style"></img>
                                            </div>
                                            <div className="my-2">
                                                <input type="file" name="filetag" onChange={this.FileOnChange} />
                                                <img src="" className="rounded mx-auto d-block" name="imagetag"></img>
                                            </div>

                                            <div>
                                                <div>
                                                    <button className="lightbutton" onClick={this.handelSaveOnClick} >Save</button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                                <div className="w-75">
                                    <div className="d-flex flex-column ">
                                        <div>
                                            <img src={create_group}></img>
                                        </div>
                                        <div>
                                            <input className="inputTextClass1" onChange={this.OnchangeGroup_name} ></input>
                                        </div>
                                        <div>
                                            <p className="font_class">Owner</p>
                                        </div>
                                        <div>
                                            <input className="inputTextClass1" value={this.props.user.emailid} readonly="readonly" ></input>
                                        </div>
                                        <div>
                                            <div className="d-flex flex-row">
                                                <div>
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