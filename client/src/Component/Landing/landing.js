import React, { Component } from 'react';
import '../../App.css';
import backendServer from '../../../src/WebConfig';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import HomeHeader from  '../HomeHeader/HomeHeader'

class landing extends Component {


    render() {


        return (
            <div className="background_img">
              <HomeHeader props={this.props} />
            </div>


        )
    }
}

export default landing;