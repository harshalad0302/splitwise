import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Login_header from '../Login_header/login_header'
import { connect } from 'react-redux';
import backendServer from '../../../src/WebConfig'
import Default_dashboard from '../Default_dashboard/Default_dashboard'
import { add_user } from '../../Actions/user_action'
import show_details from '../../Component/Show_details/show_details'
import Actual_dashboard from '../Actual_Dashboard/actual_dashboard'

//connection to global store
const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}


class dashborad extends Component {

    constructor(props) {
        super(props);
        this.state = {
            amount_this_uid_gets: 0,
            amount_this_uid_ows: 0,
            UID: this.props.user.UID,
            name: this.props.user.name,
            total: 0,
            group_wise_balence: undefined,
            render_content: undefined

        }


    }

    componentDidMount = async (e) => {

        //prepare the data to send it to backend
        const data = {
            UID: this.props.user.UID_user,
            name: this.props.user.name_user
        }

        const response_dashboard = await axios.post(`${backendServer}/dashboard_display`, data)


        if (response_dashboard.data.amount_this_UID_ows !== null) {

            this.setState(() => ({
                amount_this_uid_ows: response_dashboard.data.amount_this_UID_ows
            }))
        }

        if (response_dashboard.data.amount_this_UID_gets !== null) {
            this.setState(() => ({
                amount_this_uid_gets: response_dashboard.data.amount_this_UID_gets
            }))
        }

        const total_bal = this.state.amount_this_uid_gets - this.state.amount_this_uid_ows

        this.setState(() => ({
            total: total_bal
        }))



        let group_wise_balence_temp = []

        for (var i = 0; i < response_dashboard.data.group_wise_data.length; i++) {
            group_wise_balence_temp.push({ UID: response_dashboard.data.group_wise_data[i].UID, name: response_dashboard.data.group_wise_data[i].name, Group_Id: response_dashboard.data.group_wise_data[i].Group_ID, Group_name: response_dashboard.data.group_wise_data[i].group_name, amount_ows: response_dashboard.data.group_wise_data[i].amount_ows_to_this_group, amount_gets: response_dashboard.data.group_wise_data[i].amount_gets_from_this_group })
        }

        //seting state

        this.setState(() => ({
            group_wise_balence: group_wise_balence_temp
        }))

      

        if (this.state.group_wise_balence.length!==0) {
            this.setState(() => ({
                render_content: <div>
                    <Actual_dashboard props={this.props} />
                </div>
            }))
        }
        else {
            this.setState(() => ({
                render_content: <div>
                <Actual_dashboard props={this.props} />
                </div>
            }))

        }


    }

    show_details_click = (data) => {

        //sending props to show detail page 
        this.props.history.push({
            pathname: '/show_details',
            state: {
                UID: data.UID,
                name: data.name,
                Group_Id: data.Group_Id,
                Group_name: data.Group_name,
                amount_gets: data.amount_gets,
                amount_ows: data.amount_ows
            }
        })


    }




    render() {


        return (


            <div className="main_page_div">
                <div>
                    <Login_header props={this.props} />
                </div>
                <div>
                    {
                        this.state.render_content
                    }

                </div>
            </div>

        )
    }
}


export default connect(connection_to_redux)(dashborad);

