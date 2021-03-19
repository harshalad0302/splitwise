
import '../../App.css';
import backendServer from '../../WebConfig';

import {React,Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import { connect } from 'react-redux';
import { remove_user } from '../../Actions/user_action'


const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}

class HomeHeader extends Component {

    componentDidMount = () => {
        console.log(this.props)
    }
    submitSignup = (e) => {
        this.props.props.history.push("/signup")
    }
    submitLogin = (e) => {
        this.props.props.history.push("/Login")
    }



    render() {


        return (
            <div >
                <div className="color">
                    <img src={logo_image} className="header_image_landing" />
                    <div id="Login_button" className="right_corner">
                        <button className="button_Login" onClick={this.submitLogin}>LoginPage</button>
                   &nbsp;
                    <button className="button_signUp" onClick={this.submitSignup}>SignUpPage</button>
                    </div>
                </div>

            </div>

        )
    }
}


export default connect(connection_to_redux)(HomeHeader);