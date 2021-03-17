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

    constructor(props) {
        super(props);
        this.state = {
            amount_this_uid_gets: 0,
            amount_this_uid_ows: 0,
            UID: this.props.user.UID_user,
            name: this.props.user.name_user,
            total: 0,
            group_wise_balence: undefined
        }


    }

    componentDidMount = async (e) => {

        //prepare the data to send it to backend
        const data = {
            UID: this.props.user.UID_user,
            name: this.props.user.name_user
        }

        const response_dashboard = await axios.post('http://localhost:3002/dashboard_display', data)


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


    }

    render() {


        return (


            <div>
                <div>
                    <Login_header props={this.props} />
                </div>
                <h2>Dashboard</h2>
                <label>Amount {this.state.name} gets</label> <input type="text" value={this.state.amount_this_uid_gets} readOnly="readonly" />
                <br />
                <label>Amount {this.state.name} ows</label> <input type="text" value={this.state.amount_this_uid_ows} readOnly="readonly" />
                <br />
                <label>Total Balance  </label> <input type="text" value={this.state.total} readOnly="readonly" />
                <br />
               <h3>Details</h3>

                {

                    //group_bal_users_ows
                    this.state.group_wise_balence &&
                    this.state.group_wise_balence.map((data, index) => {
                        return (
                            <div key={index}>
                                <table>
                                    <tr>
                                        <th>Group Name</th>
                                        <th>Amount gets</th>
                                        <th>Amount ows</th>
                                    </tr>
                                    <tr>
                                        <td>{data.Group_name}</td>
                                        <td>{data.amount_gets ? data.amount_gets : 0}</td>
                                        <td>{data.amount_ows}</td>
                                    </tr>
                                </table>
                            </div>
                        )
                    })

                }

            </div>

        )
    }
}


export default connect(connection_to_redux)(dashborad);

