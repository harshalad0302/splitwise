import React, { Component } from 'react';
import '../../App.css';
import { connect } from 'react-redux';
import axios from 'axios';
import backendServer from '../../WebConfig';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import HomeHeader from '../HomeHeader/HomeHeader'

const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}
class left_toggel_bar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            group_names_and_id_array: undefined,
            UID: this.props.user.UID,
            name: this.props.user.name,
            filtered_array: undefined

        }


    }


    DashboardOnclick = (e) => {
        this.props.props.history.push("/actual_dashboard")
    }
    OnclickRecentActivities = (e) => {
        this.props.props.history.push("/recent_activities")
    }

    addGroupsClick = (e) => {
        this.props.props.history.push("/Create_groups")
    }

    componentDidMount = async (e) => {

        const data = {
            UID: this.state.UID,
            name: this.state.name
        }

        const response_get_group_names = await axios.post(`${backendServer}/get_group_names`, data)

        this.setState({
            group_names_and_id_array: response_get_group_names.data.group_names_and_id_array
        })

    }

    GotoGroupOnClick = (index) => {

       
        this.props.props.history.push({
            pathname: '/group_page',
            state: {
                group_name: this.state.group_names_and_id_array[index].group_name,
                groupID: this.state.group_names_and_id_array[index].groupID
            }
        })
        

    }

    OnChangSerachBar = async (e) => {
        const value_serach = e.target.value
       const filtered = this.state.group_names_and_id_array.filter((group_names) => {
            return group_names.group_names
        })

        this.setState(() => ({
            filtered_array: filtered
        }))


    }

    render() {


        return (
            <div>
                <div className="leftdiv_inside">
                    <button className="DashboardButton" onClick={this.DashboardOnclick}></button>
                    <br></br>
                    <button className="DashboardButtonRecentactivity" onClick={this.OnclickRecentActivities}></button>
                    <button className="GroupsAddbutton_class" onClick={this.addGroupsClick}>GROUPS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+add</button>
                    <br></br>
                    <br></br>
                    <button className="GroupsAddbutton_class" >My Groups</button>
                    <br></br>
                   
                    <div>
                        <input type="text" className="inputTextClass_invisible1" placeholder="search for group" onChange={this.OnChangSerachBar}></input>
                    </div>
                  
                    <div>
                        {
                          
                            this.state.group_names_and_id_array &&
                            this.state.group_names_and_id_array.map((data, index) => {

                                return (
                                    <div key={index}>
                                        <br></br>
                                        <button className="GroupsAddbutton_class" onClick={() => this.GotoGroupOnClick(index)}>{data.group_name}</button>

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


export default connect(connection_to_redux)(left_toggel_bar);
