import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import Login_header from '../Login_header/login_header'
import { connect } from 'react-redux';
import backendServer from '../../../src/WebConfig';


const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}


class recent_activities extends Component {
    
    constructor() {
        super();
        this.state = {
        Array_recent:undefined,
         filtered_array:undefined

        }
    }
    componentDidMount = async (e) => {
    //get the data of recent activities from backend

    const data ={
        UID:this.props.user.UID_user,
        name:this.props.user.name_user
    }

    //sending data to backend
    const get_response_recentactivities = await axios.post(`${backendServer}/recent_activities`, data)

     
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
  

        console.log("Array_recent is ",this.state.Array_recent[0].activity)
    }

    OnChangSerachBar= async(e)=>{
        const value_serach=e.target.value
        // console.log("--------------,",value_serach)
        // console.log("----------------",this.state.Array_recent.activity)
       // const filter_value=this.state.Array_recent.activity
      const filtered=this.state.Array_recent.filter((group)=>{
          return group.activity.includes(value_serach)
      })

      this.setState(()=>({
        filtered_array:filtered
    }))
  
  
    }

    render() {

        return (
            <div>
                    <div>
                    <Login_header props={this.props} />
                    </div>
                    <div>
                    <h2>Recent Activities</h2>
                    <input type="text" placeholder=" Find " onChange={this.OnChangSerachBar}></input>
                    <br/>
                    <br/>
                    <div>
                    {
                        !this.state.filtered_array &&
                        this.state.Array_recent &&
                        this.state.Array_recent.map((data, index) => {
                            return (
                             <div key={index}>
                             
                                <ul>
                                <li>{data.activity} at </li> &nbsp; <label> <b>{data.date} </b></label>
                                </ul>
                                </div>
                            )
                        })

                    }
                    
                    {
                      
                        this.state.filtered_array &&
                        this.state.filtered_array.map((data, index) => {
                            return (
                             <div key={index}>
                             
                                <ul>
                                <li>{data.activity} at </li> &nbsp; <label> <b>{data.date} </b></label>
                                </ul>
                        
                            
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