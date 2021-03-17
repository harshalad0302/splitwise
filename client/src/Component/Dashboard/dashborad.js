import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Login_header from '../Login_header/Login_header'
import { connect } from 'react-redux';
import { add_user } from '../../Actions/user_action'


//connection to global store
const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}


class dashborad extends Component {


    render() {


        return (

           
            <div>
            <div>
            <Login_header props={this.props} />
            </div>

               <h2>Dashboard</h2>

        </div>
           
        )
    }
}


export default connect(connection_to_redux)(dashborad);

