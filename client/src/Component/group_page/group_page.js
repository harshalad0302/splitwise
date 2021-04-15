import React, { Component } from 'react';
import '../../App.css';
import Login_header from '../Login_header/login_header'
import Left_toggel_bar from '../Left_Toggle_bar/left_toggel_bar'
import { connect } from 'react-redux';
import axios from 'axios';
import Modal from 'react-modal'
import backendServer from '../../../src/WebConfig';
import avatar_image from '../../Assests/Img/avatar.png'
import Bill_Logo from '../../Assests/Img/bill_logo.PNG'
import save_by from '../../Assests/Img/save_by.PNG'
const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}

const customStyles = {
    content: {
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'

    }
};

const customStyles_comment = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'

    }

};

class group_page extends Component {

    constructor(props) {
        super(props);
        this.state = {
            group_name: this.props.location.state.group_name,
            showModal: false,
            showModal_comment: false,
            comment_to_exsisting_expen: "",
            groupID: this.props.location.state.groupID,
            group_expenses_details: undefined,
            UID: this.props.user.UID,
            name: this.props.user.name,
            description: "",
            amount: "",
            comment: "",
            comments_number: "",
            Expense_ID_N: "",
            Expense_description_N: "",
            details_of_each_individual_owes_gets: undefined,
            auth_flag: false,
            error_message: "",
            all_comments_for_this_expense: undefined

        }
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleOpenModal_comment = this.handleOpenModal_comment.bind(this);
        this.handleCloseModal_comment = this.handleCloseModal_comment.bind(this);

    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }



    handleOpenModal_comment = async (index) => {
        const data = {
            expen_ID: this.state.group_expenses_details[index].Expense_ID
        }
        console.log("data is ", data)
        const get_all_comments = await axios.post(`${backendServer}/get_all_comments`, data)
        let temp_all_comments = []
        for (var i = 0; i < get_all_comments.data.comments_length; i++) {
            var options = { year: 'numeric', month: 'long', day: 'numeric' }
            var date_value = new Date(get_all_comments.data.all_comments_on_this_expense[i].date_time).toLocaleDateString([], options);
            temp_all_comments.push(
                {
                    comment: get_all_comments.data.all_comments_on_this_expense[i].comment,
                    made_by: get_all_comments.data.all_comments_on_this_expense[i].UID_adding_comment_name,
                    date: date_value

                }

            )
        }
        this.setState({
            showModal_comment: true,
            comments_number: get_all_comments.data.comments_length,
            Expense_ID_N: this.state.group_expenses_details[index].Expense_ID,
            Expense_description_N: this.state.group_expenses_details[index].description,
            all_comments_for_this_expense: temp_all_comments
        })
    }


    handleCloseModal_comment() {
        this.setState({ showModal_comment: false });
    }

    update = async (e) => {
        //add same thing as component did mount
        const data = {
            group_name: this.props.location.state.group_name,
            groupID: this.props.location.state.groupID,
            current_UID: this.props.user.UID
        }
        const get_users_in_group = await axios.post(`${backendServer}/get_users_in_group`, data)
        //  const get_expenses_of_group = await axios.post(`${backendServer}/get_expenses_of_group`, data)
        var options = { year: 'numeric', month: 'long', day: 'numeric' }

        let exepense_details = []
        let details_of_each_individual_owes_gets_temp = []

        for (var i = 0; i < get_users_in_group.data.group_expenses_details.length; i++) {
            var date_value = new Date(get_users_in_group.data.group_expenses_details[i].date_time).toLocaleDateString([], options);
            exepense_details.push({
                Expense_date: date_value,
                Expense_ID: get_users_in_group.data.group_expenses_details[i].expen_ID,
                paid_by_UID: get_users_in_group.data.group_expenses_details[i].paid_by_UID,
                amount: get_users_in_group.data.group_expenses_details[i].amount,
                description: get_users_in_group.data.group_expenses_details[i].description,
                paid_by: get_users_in_group.data.group_expenses_details[i].name_of_UID_who_paid

            })
        }

        for (var i = 0; i < get_users_in_group.data.details_of_each_individual_owes_gets.length; i++) {
            let amount_gets = 0
            let amount_owes = 0

            if (get_users_in_group.data.details_of_each_individual_owes_gets[i].amount_gets.length !== 0) {
                amount_gets = get_users_in_group.data.details_of_each_individual_owes_gets[i].amount_gets[0].amount_gets
            }

            if (get_users_in_group.data.details_of_each_individual_owes_gets[i].amount_ows.length !== 0) {
                amount_owes = get_users_in_group.data.details_of_each_individual_owes_gets[i].amount_ows[0].amount_ows
            }
            details_of_each_individual_owes_gets_temp.push(
                {
                    UID: get_users_in_group.data.details_of_each_individual_owes_gets[i].UID,
                    name: get_users_in_group.data.details_of_each_individual_owes_gets[i].name.name,
                    amount_gets: amount_gets,
                    amount_ows: amount_owes
                }
            )

        }


        this.setState(() => ({
            // group_member_details: get_users_in_group.data.details_of_group_members,
            group_expenses_details: exepense_details,
            details_of_each_individual_owes_gets: details_of_each_individual_owes_gets_temp
        }))

    }

    componentDidMount = async (e) => {

        const data = {
            group_name: this.props.location.state.group_name,
            groupID: this.props.location.state.groupID,
            current_UID: this.props.user.UID
        }
        const get_users_in_group = await axios.post(`${backendServer}/get_users_in_group`, data)
        //  const get_expenses_of_group = await axios.post(`${backendServer}/get_expenses_of_group`, data)
        var options = { year: 'numeric', month: 'long', day: 'numeric' }

        let exepense_details = []
        let details_of_each_individual_owes_gets_temp = []

        for (var i = 0; i < get_users_in_group.data.group_expenses_details.length; i++) {
            var date_value = new Date(get_users_in_group.data.group_expenses_details[i].date_time).toLocaleDateString([], options);
            exepense_details.push({
                Expense_date: date_value,
                Expense_ID: get_users_in_group.data.group_expenses_details[i].expen_ID,
                paid_by_UID: get_users_in_group.data.group_expenses_details[i].paid_by_UID,
                amount: get_users_in_group.data.group_expenses_details[i].amount,
                description: get_users_in_group.data.group_expenses_details[i].description,
                paid_by: get_users_in_group.data.group_expenses_details[i].name_of_UID_who_paid

            })
        }

        for (var i = 0; i < get_users_in_group.data.details_of_each_individual_owes_gets.length; i++) {
            let amount_gets = 0
            let amount_owes = 0

            if (get_users_in_group.data.details_of_each_individual_owes_gets[i].amount_gets.length !== 0) {
                amount_gets = get_users_in_group.data.details_of_each_individual_owes_gets[i].amount_gets[0].amount_gets
            }

            if (get_users_in_group.data.details_of_each_individual_owes_gets[i].amount_ows.length !== 0) {
                amount_owes = get_users_in_group.data.details_of_each_individual_owes_gets[i].amount_ows[0].amount_ows
            }
            details_of_each_individual_owes_gets_temp.push(
                {
                    UID: get_users_in_group.data.details_of_each_individual_owes_gets[i].UID,
                    name: get_users_in_group.data.details_of_each_individual_owes_gets[i].name.name,
                    amount_gets: amount_gets,
                    amount_ows: amount_owes
                }
            )

        }


        this.setState(() => ({
            // group_member_details: get_users_in_group.data.details_of_group_members,
            group_expenses_details: exepense_details,
            details_of_each_individual_owes_gets: details_of_each_individual_owes_gets_temp
        }))

    }

    HandelDescriptionOnChange = (e) => {

        this.setState({
            description: e.target.value
        })
    }

    HandelAmountOnChange = (e) => {

        this.setState({
            amount: e.target.value
        })
    }
    HandelCommentOnChange = (e) => {

        this.setState({
            comment: e.target.value
        })
    }


    OnClickSaveandSplit = async (e) => {
        //get the data to be inseretd 
        const data = {
            UID_adding_expense: this.state.UID,
            name: this.state.name,
            amount: this.state.amount,
            comment: this.state.comment,
            description: this.state.description,
            groupID: this.state.groupID,
            group_name: this.state.group_name
        }
        const response_Expense_add = await axios.post(`${backendServer}/Expense_add`, data)
        //check the respose 
        if (response_Expense_add.data.auth_falg === "F") {
            this.setState({
                auth_flag: true,
                error_message: <div>
                    {
                        response_Expense_add.data.message.map((error_message, index) => {
                            return (
                                <div key={index}>
                                    <ul list-style-position="inside" >
                                        <li>{error_message}</li>
                                    </ul>
                                </div>
                            )
                        })
                    }
                </div>

            })

        }
        else {

            this.handleCloseModal()
            this.update()

        }


    }

    HandleTextAreaCommentOnChange = (e) => {
        this.setState({
            comment_to_exsisting_expen: e.target.value
        })
    }

    OnClickPost = async (e) => {


        const data = {
            expen_ID: this.state.Expense_ID_N,
            description: this.state.Expense_description_N,
            UID: this.props.user.UID,
            name: this.props.user.name,
            groupID: this.props.location.state.groupID,
            group_name: this.props.location.state.group_name,
            comment: this.state.comment_to_exsisting_expen


        }
        const respose_from_post_comment = await axios.post(`${backendServer}/add_comment`, data)
        if (respose_from_post_comment.data.auth_falg === "S") {
            this.handleCloseModal_comment()
            this.update()
        }

    }


    handleOnClickLeave = async (e) => {
        //leae group
        const data = {
            UID: this.props.user.UID,
            name: this.props.user.name,
            groupID: this.props.location.state.groupID,
            group_name: this.props.location.state.group_name
        }
        const leave_group_response = await axios.post(`${backendServer}/leave_group`, data)
        if (leave_group_response.data.auth_falg === "F") {
            this.setState({
                auth_flag: true,
                error_message: <div>
                    {
                        leave_group_response.data.message.map((error_message, index) => {
                            return (
                                <div key={index}>
                                    <ul list-style-position="inside" >
                                        <li>{error_message}</li>
                                    </ul>
                                </div>
                            )
                        })
                    }
                </div>
            })
        }

    }
    render() {

        return (

            <div className="main_page_div">
                <div className="Main_inside_header">
                    <Login_header props={this.props} />
                </div>

                <div className="container">
                    <div className="leftdiv">
                        <Left_toggel_bar props={this.props} />
                    </div>
                    <div className="d-flex flex-row my-1 justify-content-between">
                        <div className="bg w-50">
                            <div className="d-flex flex-row justify-content-evenly">
                                <div className=" w-30">
                                    <img src={avatar_image} className="group_icon_logo">
                                    </img>
                                </div>
                                <div className=" w-70 mx-3 my-3 "><h1 className="fs-2">{this.state.group_name}</h1></div>
                            </div>

                        </div>
                        <div className=" w-50 mx-5 d-flex flex-row justify-content-end">
                            <div>
                                <button className="lightbutton my-3" onClick={this.handleOpenModal}>Add Expenses</button>
                            </div>
                            <div>
                                <button className="darkbutton my-3" onClick={this.handleOnClickLeave} >Leave</button>
                            </div>

                        </div>
                    </div>
                    {this.state.auth_flag && <div className="inputTextClass red_error_background">{this.state.error_message} </div>}
                    <div className="d-flex flex-row mx-2 pl-2 justify-contenet-start ">
                        <div className=" w-75 ">
                            <div className="d-flex flex-column my-3">
                                {
                                    this.state.group_expenses_details &&
                                    this.state.group_expenses_details.map((data, index) => {
                                        return (
                                            <div key={index}>
                                                <div >
                                                    <div className="d-flex flex-row border justify-content-start border ">
                                                        <div className=" w-5 mx-3">
                                                            <div className="d-flex flex-row">
                                                                <div className="w-5">
                                                                    <p>{data.Expense_date}</p>
                                                                </div>
                                                                <div className="w-5 mx-3">
                                                                    <img src={Bill_Logo}></img>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="w-25 mx-2 ">
                                                            <p>{data.description} for {data.amount} USD</p>
                                                        </div>
                                                        <div className="mx-2 w-5">
                                                            <button onClick={() => this.handleOpenModal_comment(index)}>comments</button>
                                                        </div>

                                                        <div className=" w-25">
                                                            <div className="d-flex flex row  justify-content-end ">
                                                                <div className="w-25"> <p>Paid By </p></div>
                                                                <div className="w-50"><p>{data.paid_by}</p></div>
                                                            </div>

                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })

                                }

                            </div>
                        </div>
                        <div className="w-25">
                            <div className="d-flex flex-column my-2">
                                {
                                    this.state.details_of_each_individual_owes_gets &&
                                    this.state.details_of_each_individual_owes_gets.map((data, index) => {
                                        return (
                                            <div key={index}>
                                                <div className="d-flex flex-column my-2 mx-2 border">
                                                    <div className="border">
                                                        <span >{data.name}</span>
                                                    </div>
                                                    <div className="d-flex flex-row justify-content-centre ">
                                                        <div className="w-50 mx-3 ">
                                                            <div className="d-flex flex-column">
                                                                <div><span >amount owes</span></div>
                                                                <div><span >${data.amount_ows}</span></div>
                                                            </div>
                                                        </div>
                                                        <div className="w-50 border">
                                                            <div className="d-flex flex-column">
                                                                <div><span >amount gets</span></div>
                                                                <div><span >${data.amount_gets}</span></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }


                            </div>
                        </div>
                    </div>


                    <Modal isOpen={this.state.showModal} style={customStyles} >
                        <div className="d-flex flex-row  justify-content-between">
                            <div className="w-100">
                                <div className="add_expenses_image">
                                    <h4>Add Expenses</h4>
                                </div>
                            </div>
                            <div className="w-10 ">
                                <button className="btnN" onClick={this.handleCloseModal}><i className="fa fa-close"></i> X</button>
                            </div>
                        </div>
                        <div className="d-flex flex-row">
                            <div className=" w-30 my-3">
                                <img src={Bill_Logo}></img>
                            </div>
                            <div className=" w-70">
                                <div className="d-flex flex-column">
                                    <div className="my-3">
                                        <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" placeholder="Enter a description" onChange={this.HandelDescriptionOnChange} />
                                    </div>
                                    <div className="my-0.5">
                                        <input type="Number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" placeholder="0.00" onChange={this.HandelAmountOnChange} />
                                    </div>
                                    <div className="my-3">
                                        <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" placeholder="Comment" onChange={this.HandelCommentOnChange} />
                                    </div>
                                    <div className="my-0.5">
                                        <img src={save_by}></img>
                                    </div>
                                    <div className="my-3">
                                        <button className="lightbutton w-50" onClick={this.OnClickSaveandSplit} > Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>

                    <Modal isOpen={this.state.showModal_comment} style={customStyles_comment} >
                        <div className="d-flex flex-row  justify-content-between">
                            <div className="w-100">
                                <div className="add_expenses_image">
                                    <h4>Comments</h4>
                                </div>
                            </div>
                            <div className="w-10 ">
                                <button className="btnN" onClick={this.handleCloseModal_comment}><i className="fa fa-close"></i> X</button>
                            </div>
                        </div>
                        <div className="d-flex flex-column  mx-2">
                            <div>
                                <p>comments({this.state.comments_number}) for {this.state.Expense_description_N}</p>
                            </div>
                            <div className="border">
                                {
                                    this.state.all_comments_for_this_expense &&
                                    this.state.all_comments_for_this_expense.map((data, index) => {
                                        return (
                                            <div key={index} className="border">
                                                <div className="d-flex flex-row justify-content-between ">
                                                    <div className="w-25">
                                                        <div className="d-flex flex-row">
                                                            <div className="w-25">
                                                                <img src={avatar_image} className="group_icon_logo_small"></img>
                                                            </div>
                                                            <div className="w-25">
                                                                <p>{data.made_by}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-75">
                                                        <p>{data.comment}</p>
                                                    </div>
                                                    <div className="w-20">
                                                        <p>{data.date}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div>
                                <textarea placeholder="Add comment here" cols="60" rows="2" className="text_area_style" onChange={this.HandleTextAreaCommentOnChange}></textarea>
                            </div>
                            <div>
                                <button className="lightbutton" onClick={this.OnClickPost}>Post</button>
                            </div>
                        </div>
                    </Modal>


                </div>



            </div>

        )
    }
}

export default connect(connection_to_redux)(group_page);