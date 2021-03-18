import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import Login_header from '../Login_header/Login_header'
import { connect } from 'react-redux';
import Modal from '../../Component/Modal/Modal'



const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}


class show_details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            UID: this.props.history.location.state.UID,
            name: this.props.history.location.state.name,
            Group_ID: this.props.history.location.state.Group_Id,
            Group_name: this.props.history.location.state.Group_name,
            amount_gets: this.props.history.location.state.amount_gets,
            amount_ows: this.props.history.location.state.amount_ows,
            amount_gets_combined: undefined,
            amount_ows_combined: undefined

        }


    }

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
        const response_backend_show_details = await axios.post('http://localhost:3002/Show_deatils', data)

        let amount_gets_combined_temp = []
        for (var i = 0; i < response_backend_show_details.data.combined_gets.length; i++) {
            amount_gets_combined_temp.push({ amountgets: response_backend_show_details.data.combined_gets[i].amount_gets, amount_gets_from: response_backend_show_details.data.combined_gets[i].name_of_amount_gets_from_UID, amount_gets_from_UID: response_backend_show_details.data.combined_gets[i].amount_gets_from_UID })
        }

        let amount_ows_combined_temp = []
        for (var i = 0; i < response_backend_show_details.data.combined_ows.length; i++) {
            amount_ows_combined_temp.push({ amountowes: response_backend_show_details.data.combined_ows[i].amount_ows, amount_ows_to: response_backend_show_details.data.combined_ows[i].name_of_amount_ows_to_UID, amount_ows_to_UID: response_backend_show_details.data.combined_ows[i].amount_ows_to_UID })
        }

        //set the state
        this.setState(() => ({
            amount_gets_combined: amount_gets_combined_temp,
            amount_ows_combined: amount_ows_combined_temp
        }))

        console.log("------------", this.state.amount_ows_combined)

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
                                    <label>{data.amount_gets_from} owes you </label> <input value={data.amountgets} readOnly="readonly"></input>
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
                                    <label>you owes {data.amount_ows_to} </label> <input value={data.amountowes} readOnly="readonly"></input>
                                </div>
                            )
                        })
                    }
                </div>
                <button>Settle Up</button>
            </div>

        )
    }
}


export default connect(connection_to_redux)(show_details);