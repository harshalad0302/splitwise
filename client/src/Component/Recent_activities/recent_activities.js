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


class recent_activities extends Component {


    render() {

        return (
            <div>
                    <div>
                    <Login_header props={this.props} />
                    </div>
                    <div>
                    <h2>Recent Activities</h2>
                    </div>
            </div>

        )
    }
}


export default connect(connection_to_redux)(recent_activities);