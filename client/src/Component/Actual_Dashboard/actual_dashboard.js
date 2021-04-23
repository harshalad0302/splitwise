import React, { Component } from 'react';
import '../../App.css';
import backendServer from '../../WebConfig';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import Login_header from '../Login_header/Login_header'
import { connect } from 'react-redux';
import avatar_image from '../../Assests/Img/avatar.png'
import Left_toggel_bar from '../Left_Toggle_bar/left_toggel_bar'
import axios from 'axios';
import Modal from 'react-modal'

const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}

const customStyles = {
    content: {
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'

    }
};


class actual_dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            UID: this.props.user.UID,
            name: this.props.user.name,
            invites_from_group: undefined,
            auth_flag: false,
            showModal: false,
            amount_gets_settle_up: undefined,
            amount_gets_settle_up_length: undefined,
            amount_owes_settle_up_length: undefined,
            amount_owes_settle_up: undefined,
            error_message: "",
            show_toggel: undefined,
            array_invite_length: 0,
            amount_gets: 0,
            amount_owes: 0,
            bal: 0

        }
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);

    }


    handleOpenModal = async () => {

        //display the settle up things 
        const data = {
            UID: this.props.user.UID,
            name: this.props.user.name
        }



        const settle_up_response = await axios.post(`${backendServer}/settle_up`, data, { headers: { "Authorization": this.props.user.token } })


        if (settle_up_response.data.auth_flag === "S") {


            this.setState({
                showModal: true,
                amount_gets_settle_up: settle_up_response.data.amount_gets_array,
                amount_owes_settle_up: settle_up_response.data.amount_owes_array

            });

            if (settle_up_response.data.amount_gets_array_length !== 0) {
                this.setState({
                    amount_gets_settle_up_length: settle_up_response.data.amount_gets_array_length
                })
            }
            if (settle_up_response.data.amount_owes_array_length !== 0) {
                this.setState({
                    amount_owes_settle_up_length: settle_up_response.data.amount_owes_array_length
                })
            }

        }



    }


    handleCloseModal() {
        this.setState({ showModal: false });
    }


    update = async (e) => {
        const data = {
            UID: this.state.UID,
            name: this.state.name
        }
        //send data to backend to get the group invites
        const group_invite_req = await axios.post(`${backendServer}/group_page_invite`, data, { headers: { "Authorization": this.props.user.token } })
        console.log("this.props is ", this.props)

        if (group_invite_req.data.amount_gets_length !== 0) {
            this.setState(() => ({
                amount_gets: parseFloat(group_invite_req.data.amount_gets[0].amount_gets).toFixed(2)

            }))
        }

        else {
            this.setState(() => ({
                amount_gets: 0

            }))

        }
        if (group_invite_req.data.amount_owes_length !== 0) {
            this.setState(() => ({
                amount_owes: parseFloat(group_invite_req.data.amount_owes[0].amount_owes).toFixed(2)

            }))
        }
        else {
            this.setState(() => ({
                amount_owes: 0

            }))
        }

        //caculate the balance

        const bal = this.state.amount_gets - this.state.amount_owes

        this.setState(() => ({
            invites_from_group: group_invite_req.data.invite_from_groups,
            show_toggel: true,
            array_invite_length: group_invite_req.data.invite_from_groups.length,
            bal: bal

        }))


    }

    componentDidMount = async (e) => {


        const data = {
            UID: this.state.UID,
            name: this.state.name
        }
        //send data to backend to get the group invites
        const group_invite_req = await axios.post(`${backendServer}/group_page_invite`, data, { headers: { "Authorization": this.props.user.token } })

        console.log("this.props is ", this.props)

        if (group_invite_req.data.amount_gets_length !== 0) {
            this.setState(() => ({
                amount_gets: parseFloat(group_invite_req.data.amount_gets[0].amount_gets).toFixed(2)

            }))
        }
        if (group_invite_req.data.amount_owes_length !== 0) {
            this.setState(() => ({
                amount_owes: parseFloat(group_invite_req.data.amount_owes[0].amount_owes).toFixed(2)

            }))
        }

        //caculate the balance

        const bal = this.state.amount_gets - this.state.amount_owes

        this.setState(() => ({
            invites_from_group: group_invite_req.data.invite_from_groups,
            show_toggel: true,
            array_invite_length: group_invite_req.data.invite_from_groups.length,
            bal: bal

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
        const response_accepted_group_req = await axios.post(`${backendServer}/group_invite_accept_req`, data, { headers: { "Authorization": this.props.user.token } })

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


        const rejected_group = await axios.post(`${backendServer}/group_invite_reject_req`, data, { headers: { "Authorization": this.props.user.token } })

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


    HandleSettleClick_amount_gets = async (index) => {
        //send data to backend to settleup ammountgets
        const data = {
            UID: this.state.UID,
            name: this.state.name,
            settle_up_with_UID: this.state.amount_gets_settle_up[index].amount_gets_from_UID,
            settle_up_with_UID_name: this.state.amount_gets_settle_up[index].amount_gets_from,
            amount: parseFloat(this.state.amount_gets_settle_up[index].amount_gets).toFixed(2)

        }
        const response_settle_up_amount_gets = await axios.post(`${backendServer}/setle_up_amount_gets`, data, { headers: { "Authorization": this.props.user.token } })

        if (response_settle_up_amount_gets.data.auth_flag === "S") {

            this.update()
            this.handleCloseModal()
        }


    }

    HandleSettleClick_amount_owes = async (index) => {
        //send data to backend to settleup amount owes

        const data = {
            UID: this.state.UID,
            name: this.state.name,
            settle_up_with_UID: this.state.amount_owes_settle_up[index].amount_owes_to,
            settle_up_with_UID_name: this.state.amount_owes_settle_up[index].amount_owes_to_name,
            amount: parseFloat(this.state.amount_owes_settle_up[index].amount_owes).toFixed(2)

        }

        const response_settle_up_amount_owes = await axios.post(`${backendServer}/setle_up_amount_owes`, data, { headers: { "Authorization": this.props.user.token } })

        if (response_settle_up_amount_owes.data.auth_flag === "S") {
            await this.update()
            await this.handleCloseModal()

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
                                <div className=" w-50 mx-5 d-flex flex-row justify-content-end">
                                    <div>
                                        <button className="lightbutton my-3" onClick={this.handleOpenModal} >Settle up</button>
                                    </div>

                                </div>

                            </div>
                        </div>
                        <div className="d-flex flex-row justify-content-end border">
                            <div className=" w-100 border">
                                <div className="d-flex flex-column">
                                    <div><p className="text-center">total balance</p></div>
                                    <div><p className="text-center">${this.state.bal}</p></div>
                                </div>
                            </div>
                            <div className="w-100 border">
                                <div className="d-flex flex-column">
                                    <div><p className="text-center secondary">you are owed</p></div>
                                    <div><p className="text-center">${this.state.amount_gets}</p></div>
                                </div>
                            </div>
                            <div className="w-100 border">
                                <div className="d-flex flex-column">
                                    <div><p className="text-center">you owe</p></div>
                                    <div><p className="text-center">${this.state.amount_owes}</p></div>
                                </div>
                            </div>
                        </div>

                        <div className="my-2 border">
                            <h2 className="text-center">Group Invites</h2>
                        </div>
                        <div className="my-2">
                            <p className="text-center">{this.state.array_invite_length ? "" : "You dont have any invites"}</p>
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

                <Modal isOpen={this.state.showModal} style={customStyles} >
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row  justify-content-between">
                            <div className="w-100">
                                <div className="add_expenses_image">
                                    <h4>Settle up</h4>
                                </div>
                            </div>
                            <div className="w-10 ">
                                <button className="btnN" onClick={this.handleCloseModal}><i className="fa fa-close"></i> X</button>
                            </div>
                        </div>
                        <div>

                            {
                                this.state.amount_gets_settle_up &&
                                this.state.amount_gets_settle_up.map((data, index) => {
                                    return (
                                        <div key={index} className="border my-2">
                                            <div className="d-flex flex-row justify-content-end my-2">
                                                <div className="w-50  mx-2">
                                                    <img src={avatar_image} className="group_icon_logo_small"></img>
                                                </div>
                                                <div className=" w-50 mx-2">
                                                    <p className="font_class">{data.amount_gets_from}</p>
                                                </div>

                                                <div className="w-75 mx-2">
                                                    <p className="font_class">owes you</p>

                                                </div>
                                                <div className="w-75 mx-2">
                                                    <p className="font_class">${parseFloat(data.amount_gets).toFixed(2)}</p>
                                                </div>
                                                <div className="w-75 mx-2">
                                                    <button className="lightbutton" onClick={() => this.HandleSettleClick_amount_gets(index)}>Settle UP</button>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                })
                            }

                            {
                                this.state.amount_owes_settle_up &&
                                this.state.amount_owes_settle_up.map((data, index) => {
                                    return (
                                        <div key={index} className="border my-2">
                                            <div className="d-flex flex-row justify-content-end my-2">
                                                <div className="w-50  mx-2">
                                                    <img src={avatar_image} className="group_icon_logo_small"></img>
                                                </div>
                                                <div className=" w-50 mx-2">
                                                    <p className="font_class">{data.amount_owes_to_name}</p>
                                                </div>

                                                <div className="w-75 mx-2">
                                                    <p className="font_class"> you owe</p>

                                                </div>
                                                <div className="w-75 mx-2">
                                                    <p className="font_class">${parseFloat(data.amount_owes).toFixed(2)}</p>
                                                </div>
                                                <div className="w-75 mx-2">
                                                    <button className="lightbutton" onClick={() => this.HandleSettleClick_amount_owes(index)} >Settle UP</button>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                })
                            }


                        </div>

                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(connection_to_redux)(actual_dashboard);
