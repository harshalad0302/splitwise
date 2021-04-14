import React, { Component } from 'react';
import '../../App.css';
import backendServer from '../../WebConfig';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import Login_header from '../Login_header/login_header'
import { connect } from 'react-redux';
import Left_toggel_bar from '../Left_Toggle_bar/left_toggel_bar'
import axios from 'axios';

const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}


class actual_dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            UID: this.props.user.UID,
            name: this.props.user.name,
            invites_from_group: undefined,
            auth_flag: false,
            error_message: "",
            show_toggel: undefined,
            array_invite_length:0
        }

    }


    update = async (e) => {
        const data = {
            UID: this.state.UID,
            name: this.state.name
        }
        //send data to backend to get the group invites
        const group_invite_req = await axios.post(`${backendServer}/group_page_invite`, data)
        this.setState(() => ({
            invites_from_group: group_invite_req.data.invite_from_groups
        }))

    }

    componentDidMount = async (e) => {

        const data = {
            UID: this.state.UID,
            name: this.state.name
        }
        //send data to backend to get the group invites
        const group_invite_req = await axios.post(`${backendServer}/group_page_invite`, data)
        this.setState(() => ({
            invites_from_group: group_invite_req.data.invite_from_groups,
            show_toggel: true,
            array_invite_length:group_invite_req.data.invite_from_groups.length
        }))
      


    }

    handelAcceptOnClick = async (index) => {

        //sending this to backed to get inserted
        const data = {
            group_name: this.state.invites_from_group[index].group_name.group_name,
            groupID: this.state.invites_from_group[index].groupID,
            UID: this.state.UID,
            name: this.state.name
        }
        const response_accepted_group_req = await axios.post(`${backendServer}/group_invite_accept_req`, data)

        if (response_accepted_group_req.data.auth_flag === "F") {
            this.setState({
                auth_flag: true,
                error_message: <div>
                    {
                        response_accepted_group_req.data.message.map((error_message, index) => {
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
            this.setState(() => ({
                show_toggel: undefined
            }))

            this.state.invites_from_group.splice(index, 1)
            this.update()

            this.setState(() => ({
                show_toggel: true
            }))

        }



    }


    handelRejecteOnClick = async (index) => {
        const data = {
            group_to_be_rejeceted: this.state.invites_from_group[index].group_name.group_name,
            group_ids_to_be_rejected: this.state.invites_from_group[index].groupID,
            current_UID: this.state.UID
        }


        const rejected_group = await axios.post(`${backendServer}/group_invite_reject_req`, data)

        if (rejected_group.data.auth_flag === "F") {
            this.setState(() => ({
                auth_flag: true,
                error_message: <div>
                    {
                        rejected_group.data.message.map((error_message, index) => {
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
            }))


        }
        else {

            this.setState(() => ({
                show_toggel: undefined
            }))

            this.state.invites_from_group.splice(index, 1)
            this.update()

            this.setState(() => ({
                show_toggel: true
            }))


        }


    }

    render() {


        return (
            <div className="main_page_div">
                <div className="Main_inside_header">
                    <Login_header props={this.props} />
                </div>

                <div className="container">
                    <div className="leftdiv">
                        {
                            this.state.show_toggel && <Left_toggel_bar props={this.props} />
                        }

                    </div>
                    <div className="d-flex flex-column mx-3 pl-3">
                        <div>
                            {this.state.auth_flag && <div className="inputTextClass red_error_background">{this.state.error_message} </div>}
                        </div>
                        <div>
                            <div className="d-flex flex-row justify-content-between my-1">
                                <div className=" w-25">
                                    <h1 >Dashboard</h1>
                                </div>

                            </div>
                        </div>
                        <div className="d-flex flex-row justify-content-end border">
                            <div className=" w-100 border">
                                <div className="d-flex flex-column">
                                    <div><p className="text-center">total balance</p></div>
                                    <div><p className="text-center">Total Blance answer</p></div>
                                </div>
                            </div>
                            <div className="w-100 border">
                                <div className="d-flex flex-column">
                                    <div><p className="text-center secondary">you are owed</p></div>
                                    <div><p className="text-center">Total Blance answer</p></div>
                                </div>
                            </div>
                            <div className="w-100 border">
                                <div className="d-flex flex-column">
                                    <div><p className="text-center">you owe</p></div>
                                    <div><p className="text-center">Total Blance answer</p></div>
                                </div>
                            </div>
                        </div>

                        <div className="my-2 border">
                            <h2 className="text-center">Group Invites</h2>
                        </div>
                        <div className="my-2">
                        <p className="text-center">{this.state.array_invite_length ? "":"You dont have any invites"}</p>
                        </div>
                        {
                            this.state.invites_from_group &&
                            this.state.invites_from_group.map((invite, index) => {
                                return (
                                    <div key={index}>
                                        <div className="my-2">
                                            <div className="d-flex flex-row justify-content-end">
                                                <div className="w-50 border">
                                                    <p className="text-center font-weight-bold">{invite.group_name.group_name}</p>
                                                </div>
                                                <div className=" w-50">
                                                    <div className="d-flex flex row mx-2 ">
                                                        <button className="mx-2 lightbutton" onClick={() => this.handelAcceptOnClick(index)}>Accept</button>
                                                        <button className="mx-2 darkbutton" onClick={() => this.handelRejecteOnClick(index)}  >Reject</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })

                        }


                    </div>
                </div>

            </div>
        )
    }
}

export default connect(connection_to_redux)(actual_dashboard);
