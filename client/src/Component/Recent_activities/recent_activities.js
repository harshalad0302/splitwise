import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';

import ReactPaginate from 'react-paginate';
import Login_header from '../Login_header/Login_header'
import { connect } from 'react-redux';
import backendServer from '../../../src/WebConfig';
import { add_user } from '../../Actions/user_action'
import Flag_logo from '../../Assests/Img/flag_logo_for_activity.PNG'
import Left_toggel_bar from '../Left_Toggle_bar/left_toggel_bar'
const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}

class recent_activities extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Array_recent: undefined,
            UID: this.props.user.UID,
            name: this.props.user.name,
            offset: 0,
            data: [],
            perPage: 2,
            currentPage: 0,
            sliceddata: undefined,
            distinct_groupname: undefined
        }
        this.handlePageClick = this.handlePageClick.bind(this)
    }


    receivedData = async () => {
        const slice = this.state.Array_recent.slice(this.state.offset, this.state.offset + this.state.perPage)

        this.setState({
            sliceddata: slice,
            pageCount: Math.ceil(this.state.Array_recent.length / this.state.perPage)
        })

    }



    componentDidMount = async (e) => {

        const data_to_be_stored = {
            name: localStorage.getItem('name'),
            emailid: localStorage.getItem('emailid'),
            UID: localStorage.getItem('UID'),
            phone_number: localStorage.getItem('phone_number'),
            profile_photo: localStorage.getItem('profile_photo'),
            token: localStorage.getItem('token')
        }
        //dispatch data to redux
        this.props.dispatch(add_user(data_to_be_stored))

        //get the data of recent activities from backend
        const data = {
            UID: this.props.user.UID,
            name: this.props.user.name
        }
        //sending data to backend
        const get_response_recentactivities = await axios.post(`${backendServer}/recent_activities`, data, { headers: { "Authorization": this.props.user.token } })
        this.setState(() => ({
            Array_recent: get_response_recentactivities.data.details_recent_activity,
            distinct_groupname: get_response_recentactivities.data.distinct_groupname
        }))
        await this.receivedData()
    }



    handleChange_records_on_page = async (e, data) => {
        let myint = parseInt(e.target.value)
        await this.setState({
            perPage: myint
        })
        let slice
        slice = this.state.Array_recent.slice(0, 0 + this.state.perPage)
        this.setState({
            sliceddata: slice,
            pageCount: Math.ceil(this.state.Array_recent.length / this.state.perPage),
            selectedPage: 1,
            offset: 0
        })


    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedData()
        });

    };


    handleChangeGroupName = async (e) => {
        let group_name = e.target.value
        const slice = this.state.Array_recent.slice(this.state.offset, this.state.offset + this.state.perPage)
        const filtered = slice.filter((data) => {
            return data.group_name.includes(group_name)
        })

        await this.setState({
            sliceddata: filtered
        })
        await this.setState({
            pageCount: Math.ceil(this.state.Array_recent.length / this.state.perPage),

        })


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
                        <ReactPaginate
                            previousLabel={"prev"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"} />

                    </div>
                    <div className="mx-3 my-2">
                        <div className="d-flex flex-row justify-content-start">
                            <div>
                                <p className="font_class_recent_activity">Entries per page</p>
                            </div>
                            <div className=" justify-content-start mx-2">
                                <select value="1"
                                    value={this.state.selectValue}
                                    onChange={this.handleChange_records_on_page} >
                                    <option value="2">2</option>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                </select>
                            </div>
                            <div className=" mx-2 justify-content-start">
                                <select value="1"
                                    value={this.state.selectValue}
                                    onChange={this.handleChangeGroupName} >
                                    <option defaultValue>Filter by group name</option>
                                    {
                                        this.state.distinct_groupname &&
                                        this.state.distinct_groupname.map((data, index) => {
                                            return (
                                                <option key={index} value={data.groupName} onChange={this.handleChangeGroupName}>
                                                    {data.groupName}
                                                </option>
                                            )
                                        })

                                    }
                                </select>
                            </div>
                            <div className="mx-2 justify-content-start">
                                <p>sort</p>
                            </div>
                            <div className="mx-2 justify-content-start">
                                <select defaultValue="1">
                                    <option value="1">Most Recent First</option>
                                    <option value="2">Most Recent Last</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="my-2 mx-3">
                        {
                            this.state.sliceddata &&
                            this.state.sliceddata.map((data, index) => {
                                return (
                                    <div key={index} className=" my-2 mx-3">
                                        <div className="d-flex flex-row justify-content-start">
                                            <div className="w-5 mx-2">
                                                <p className="font_class_recent_activity"> {data.group_name}</p>
                                            </div>
                                            <div className="w-5 mx-2">
                                                <img src={Flag_logo}></img>
                                            </div>
                                            <div className="w-95">
                                                <p className="font_class_recent_activity">{data.activity}</p>
                                            </div>
                                            <div className="w-95 mx-5">
                                                <p className="font_class_recent_activity"><b>{data.date_time}</b></p>
                                            </div>
                                        </div>
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