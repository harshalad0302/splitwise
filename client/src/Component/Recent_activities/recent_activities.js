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
    
    constructor() {
        super();
        this.state = {
           Array_recent:undefined
        }
    }
    componentDidMount = async (e) => {
    //get the data of recent activities from backend

    const data ={
        UID:this.props.user.UID_user,
        name:this.props.user.name_user
    }

    //sending data to backend
    const get_response_recentactivities = await axios.post('http://localhost:3002/recent_activities', data)

        console.log("-------------- get_response_recentactivities---",get_response_recentactivities.data.array_recent_act)
        let temp_recent_activities=[]
        for(var i=0;i<get_response_recentactivities.data.array_recent_act.length;i++)
        {
            temp_recent_activities.push({
                Group_name:get_response_recentactivities.data.array_recent_act[i].GroupName,
                activity:get_response_recentactivities.data.array_recent_act[i].Activity,
                date:get_response_recentactivities.data.array_recent_act[i].date
            
            })
        }
     
        this.setState(()=>({
            Array_recent:temp_recent_activities
        }))
  

        console.log("Array_recent is ",this.state.Array_recent)
    }

    render() {

        return (
            <div>
                    <div>
                    <Login_header props={this.props} />
                    </div>
                    <div>
                    <h2>Recent Activities</h2>
                    <div>
                    {

                        
                        this.state.Array_recent &&
                        this.state.Array_recent.map((data, index) => {
                            return (
                                <div key={index}>
                             <label>Group name =</label>
                           <label>{data.Group_name} --</label>
                            <label>{data.activity} at  --</label>
                           <label>{data.date}</label>
                                </div>
                            )
                        })

                    }
                    
                    </div>

                    </div>
            </div>

        )
    }
}


export default connect(connection_to_redux)(recent_activities);