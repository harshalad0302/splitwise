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


class show_details extends Component {

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

    }

    render() {

        return (
            <div>
                <div>
                    <Login_header props={this.props} />
                </div>
                <div>
                    <h2>show details page</h2>
                </div>
            </div>

        )
    }
}


export default connect(connection_to_redux)(show_details);