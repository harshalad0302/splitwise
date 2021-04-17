import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import Login_header from '../Login_header/login_header'
import { connect } from 'react-redux';
import backendServer from '../../../src/WebConfig';
import avatar_image from '../../Assests/Img/avatar.png'
import create_group from '../../Assests/Img/create_group.PNG'
import Left_toggel_bar from '../Left_Toggle_bar/left_toggel_bar'

const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}


class recent_activities extends Component {

    constructor() {
        super();
        this.state = {
            Array_recent: undefined,
            filtered_array: undefined

        }
    }
    componentDidMount = async (e) => {
        //get the data of recent activities from backend

        const data = {
            UID: this.props.user.UID_user,
            name: this.props.user.name_user
        }

        //sending data to backend
        const get_response_recentactivities = await axios.post(`${backendServer}/recent_activities`, data)


        let temp_recent_activities = []
        for (var i = 0; i < get_response_recentactivities.data.array_recent_act.length; i++) {
            temp_recent_activities.push({
                Group_name: get_response_recentactivities.data.array_recent_act[i].GroupName,
                activity: get_response_recentactivities.data.array_recent_act[i].Activity,
                date: get_response_recentactivities.data.array_recent_act[i].date

            })
        }

        this.setState(() => ({
            Array_recent: temp_recent_activities
        }))



    }

    OnChangSerachBar = async (e) => {
        const value_serach = e.target.value

        const filtered = this.state.Array_recent.filter((group) => {
            return group.activity.includes(value_serach)
        })

        this.setState(() => ({
            filtered_array: filtered
        }))


    }

    render() {

        return (
            <div>
                <div className="Main_inside_header">
                    <Login_header props={this.props} />
                </div>
                <div>
                    <div className="container">
                        <div className="leftdiv">
                            <Left_toggel_bar props={this.props} />
                        </div>
                    </div>

                </div>
                <div className="d-flex flex-column mx-5">
                    <div className="my-2 mx-3">
                        <h1 >Recent Activities</h1>
                    </div>
                    <div className="my-2 mx-3">
                        <input type="text" placeholder=" Find by group " className="inputTextClass_invisible1" onChange={this.OnChangSerachBar}></input>
                    </div>
                </div>

            </div>

        )
    }
}


export default connect(connection_to_redux)(recent_activities);