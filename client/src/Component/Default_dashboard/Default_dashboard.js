import React, { Component } from 'react';
import '../../App.css';
import backendServer from '../../../src/WebConfig';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import HomeHeader from '../HomeHeader/HomeHeader'

class Default_dashboard extends Component {

    OnClickCreateAppartment=(e)=>{
        this.props.props.history.push("/Create_groups")
    }

    render() {


        return (
            <div>
                <div className="defaultDashboardleft">
                    <div className="defaultDashboardleft_inside">

                    </div>
                </div>
                <div className="defaultDashboardright">
                    <div className="defaultDashboardright_inside">
                    
                    </div>
                    <div className="similarClass">
                    <br></br>
                    <button className="addappartmentbutton" onClick={this.OnClickCreateAppartment}></button>
                    </div>
                    
                  
                    
                </div>
            </div>


        )
    }
}

export default Default_dashboard;