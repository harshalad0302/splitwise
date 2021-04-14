import React, { Component } from 'react';
import '../../App.css';
import backendServer from '../../../src/WebConfig';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import HomeHeader from '../HomeHeader/HomeHeader'

class landing extends Component {

    OnClickHandlersignUp = (e) => {
        this.props.history.push("/signup")
    }

    render() {


        return (
            <div className="main_page_div">
            <HomeHeader props={this.props} />
                <div className="backgrounfimagediv">
                    <div className="firstleftdiv">
                        <div className="insideleftdiv">
                        </div>
                        <div className="belowdivsignup">
                            <div>
                                <button className="bigFatSignup" onClick={this.OnClickHandlersignUp} >SignUp</button>
                            </div>
                        </div>
                    </div>
                    <div className="firstrighttdiv">
                    </div>
                </div>
            </div>


        )
    }
}

export default landing;