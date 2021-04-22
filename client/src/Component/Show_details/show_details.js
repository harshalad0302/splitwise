import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import Login_header from '../Login_header/Login_header'
import { connect } from 'react-redux';
import Modal from '../../Component/Modal/Modal'

import backendServer from '../../../src/WebConfig';

const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}


class show_details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            UID: this.props.history.location.state.UID,
            name: this.props.history.location.state.name,
            Group_ID: this.props.history.location.state.Group_Id,
            Group_name: this.props.history.location.state.Group_name,
            amount_gets: this.props.history.location.state.amount_gets,
            amount_ows: this.props.history.location.state.amount_ows,
            amount_gets_combined: undefined,
            amount_ows_combined: undefined,
            User_names: undefined


        }
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);

    }
    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({ show: false });
    };


    componentDidMount = async (e) => {

        //send this data to backend to show details api
        const data = {
            UID: this.props.history.location.state.UID,
            name: this.props.history.location.state.name,
            Group_ID: this.props.history.location.state.Group_Id,
            Group_name: this.props.history.location.state.Group_name,
            amount_gets: this.props.history.location.state.amount_gets,
            amount_ows: this.props.history.location.state.amount_ows
        }
        const response_backend_show_details = await axios.post(`${backendServer}/Show_deatils`, data)

        let temp_UIDs_involved = []
        let amount_gets_combined_temp = []
        for (var i = 0; i < response_backend_show_details.data.combined_gets.length; i++) {
            amount_gets_combined_temp.push({ amountgets: response_backend_show_details.data.combined_gets[i].amount_gets, amount_gets_from: response_backend_show_details.data.combined_gets[i].name_of_amount_gets_from_UID, amount_gets_from_UID: response_backend_show_details.data.combined_gets[i].amount_gets_from_UID })
            temp_UIDs_involved.push({ UID: response_backend_show_details.data.combined_gets[i].amount_gets_from_UID })
        }

        let amount_ows_combined_temp = []
        for (var i = 0; i < response_backend_show_details.data.combined_ows.length; i++) {
            amount_ows_combined_temp.push({ amountowes: response_backend_show_details.data.combined_ows[i].amount_ows, amount_ows_to: response_backend_show_details.data.combined_ows[i].name_of_amount_ows_to_UID, amount_ows_to_UID: response_backend_show_details.data.combined_ows[i].amount_ows_to_UID })
            temp_UIDs_involved.push({ UID: response_backend_show_details.data.combined_ows[i].amount_ows_to_UID })
        }

        //set the state
        this.setState(() => ({
            amount_gets_combined: amount_gets_combined_temp,
            amount_ows_combined: amount_ows_combined_temp
        }))


        const UIDs = [...new Set(temp_UIDs_involved.map(temp_UIDs_involved => temp_UIDs_involved.UID))]

        const response_users_to_show = await axios.post(`${backendServer}/response_users_to_show`, UIDs)

        let User_names_temp = []

        for (var i = 0; i < response_users_to_show.data.user_names.length; i++) {

            User_names_temp.push({ UID: response_users_to_show.data.user_names[i].UID, name: response_users_to_show.data.user_names[i].name })
        }

        this.setState(() => ({
            User_names: User_names_temp

        }))

    }

    Settle_with_this_click=async(data)=>{

       
        this.hideModal()
        const data_to_settle={
            UID_of_login:this.props.user.UID_user,
            name_of_UID_login:this.props.user.name_user,
            other_UID:data.UID,
            GroupID:this.props.history.location.state.Group_Id,
            GroupID_name:this.props.history.location.state.Group_name,
            name_of_other_UID:data.name
        }

        const response_from_settle=await axios.post(`${backendServer}/Settle_req`, data_to_settle)
        
    }

    render() {

        return (
            <div>
                <div>
                    <Login_header props={this.props} />
                </div>
                <div>
                    <h2>show details page for {this.state.Group_name}</h2>
                    <h2>For user {this.state.name}</h2>
                </div>
                <div>
                    {
                        //group_bal_users_get
                        this.state.amount_gets_combined &&
                        this.state.amount_gets_combined.map((data, index) => {
                            return (
                                <div key={index}>
                                    <label>{data.amount_gets_from} owes you </label> <label>{data.amountgets}$</label>
                                </div>
                            )
                        })
                    }
                </div>
                <label>------------------------------</label>
                <div>
                    {

                        //group_bal_users_get
                        this.state.amount_ows_combined &&
                        this.state.amount_ows_combined.map((data, index) => {
                            return (
                                <div key={index}>
                                    <label>you owes {data.amount_ows_to} </label> <label>{data.amountowes}$</label>
                                </div>
                            )
                        })
                    }
                </div>
                <button onClick={this.showModal} className="button_Login">Settle Up</button>
                <div>
                    <Modal show={this.state.show} handleClose={this.hideModal}>
                    <div>
                    
                    </div>
                        <div>
                            {

                                this.state.User_names &&
                                this.state.User_names.map((data, index) => {
                                    return (
                                        <div key={index}>
                                        <label>Settle up with</label>
                                          <input type="text" value={data.name} readOnly="readonly"></input> <button onClick={() =>this.Settle_with_this_click(data)} className="button_Login">Settle</button>
                                        </div>
                                    )
                                })

                            }
                        </div>
                    </Modal>
                </div>
            </div>

        )
    }
}


export default connect(connection_to_redux)(show_details);