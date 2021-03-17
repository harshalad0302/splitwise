import React, { Component } from 'react';
import '../../App.css';
import Login_header from '../Login_header/Login_header'
import { connect } from 'react-redux';
import axios from 'axios';
import Modal from '../../Component/Modal/Modal'


const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}



class group_page extends Component {

    constructor() {
        super();
        this.state = {
            show: false,
            users_in_group: undefined,
            user_id_in_group: undefined,
            currency: 0,
            description: "",
            error_flag: false,
            error_message: "",
            expenses_of_this_group: undefined,
            expense_amount_of_this_group: undefined,
            expense_paid_by_uid_of_this_group: undefined,
            name_of_user_who_paid: undefined,
            group_bal_users_get:undefined,
            group_bal_users_ows:undefined
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    componentDidMount = async (e) => {

        const data = {
            group_name: this.props.history.location.state.group_name,
            group_id: this.props.history.location.state.group_id,
            current_UID: this.props.user.UID_user
        }

        const get_users_in_group = await axios.post('http://localhost:3002/get_users_in_group', data)

        let array_users_in_group = []
        let array_users_in_group_id = []
        let expenses_of_the_group = []
        let expenses_paid_by_UID = []
        let expense_amount = []
        let name_of_user_who_paid_for_this = []
        let group_bal_users_get_temp=[]
        let group_bal_users_ows_temp=[]

        for (var i = 0; i < get_users_in_group.data.count_no_of_members; i++) {
            array_users_in_group.push(get_users_in_group.data.Name_of_members[i].name)
            array_users_in_group_id.push(get_users_in_group.data.UID_of_members[i].UID)
        }



        //load the arrays to display
        for (var i = 0; i < get_users_in_group.data.expense_ids_for_this_group.length; i++) {
            expenses_of_the_group.push(get_users_in_group.data.expense_description[i].description)
            expenses_paid_by_UID.push(get_users_in_group.data.expense_paid_by_UID[i].paid_by_UID)
            expense_amount.push(get_users_in_group.data.expense_amount_for_this_group[i].amount)
            name_of_user_who_paid_for_this.push(get_users_in_group.data.user_name_who_paid[i].name)
        }


        for(var i=0;i<get_users_in_group.data.arr_expense_gets.length;i++)
        {
           
            if(get_users_in_group.data.arr_expense_gets[i].amount_gets!==null)
            {
                group_bal_users_get_temp.push({UID:get_users_in_group.data.arr_expense_gets[i].UID,name:get_users_in_group.data.arr_expense_gets[i].name.name,amount_gets:get_users_in_group.data.arr_expense_gets[i].amount_gets})
            }
            
        }

        //to display the balence of the groups
      

        for(var i=0;i<get_users_in_group.data.arr_expenses_ows.length;i++)
        {
           
          
            if(get_users_in_group.data.arr_expenses_ows[i].amount_ows!==null)
            {
                group_bal_users_ows_temp.push({UID:get_users_in_group.data.arr_expenses_ows[i].UID ,name:get_users_in_group.data.arr_expenses_ows[i].name.name,amount_ows:get_users_in_group.data.arr_expenses_ows[i].amount_ows})
            }
            
        }




        //now setting a state
        this.setState(() => ({
            group_bal_users_ows:group_bal_users_ows_temp,
            group_bal_users_get:group_bal_users_get_temp,
            users_in_group: array_users_in_group,
            user_id_in_group: array_users_in_group_id,
            expenses_of_this_group: expenses_of_the_group,
            expense_amount_of_this_group: expense_amount,
            expense_paid_by_uid_of_this_group: expenses_paid_by_UID,
            name_of_user_who_paid: name_of_user_who_paid_for_this

        }))

    



    }

    HandelCurrencyOnChange = (e) => {

        this.setState({
            currency: e.target.value
        })
    }

    HandelDescriptionOnChange = (e) => {

        this.setState({
            description: e.target.value
        })
    }

    OnClickSaveandSplit = async (e) => {

        //get the values in one object

        const data = {
            paid_by_UID: this.props.user.UID_user,
            expense_of_Group_ID: this.props.history.location.state.group_id,
            amount: this.state.currency,
            currency: "USD",
            description: this.state.description

        }
        //validate the inputs
        if (data.amount === 0 || data.description === "") {

            this.setState({
                error_flag: true,
                error_message: <div>
                    <h3>Either amount or description is empty!</h3>
                </div>
            })
        }
        else {

            //send data to backend 
            this.hideModal()
            const response_Expense_add = axios.post('http://localhost:3002/Expense_add', data)


        }





    }

    render() {

        return (
            <div>
                <div>
                    <Login_header props={this.props} />
                    <div>
                        <div><h3>Group page for {this.props.history.location.state.group_name} </h3></div>
                    </div>
                    <div><h4>Group Members </h4></div>
                    <div>
                        {

                            this.state.users_in_group &&
                            this.state.users_in_group.map((user, index) => {
                                return (
                                    <div key={index}>

                                        <input value={user} readOnly="readonly" />
                                    </div>
                                )
                            })

                        }
                    </div>
                    <br />
                    <br />
                    <Modal show={this.state.show} handleClose={this.hideModal}>
                        <h2>Add expenses</h2>
                        <br />
                        <label>Amount:</label>
                        <br />
                        <input type="number" onChange={this.HandelCurrencyOnChange}></input>
                        <br />
                        <label>Description:</label>
                        <br />
                        <input type="text" onChange={this.HandelDescriptionOnChange}></input>
                        <br />
                        <br />
                        <button type="button" onClick={this.OnClickSaveandSplit}>
                            Save and Split
                    </button>
                        <br />
                        <br />
                        {this.state.error_flag && <div>{this.state.error_message} </div>}
                        <br />
                        <br />
                    </Modal>
                    <button onClick={this.showModal} >Add expenses</button>
                </div>
                <div>

                    <div>
                        <h2>Group Expenses</h2>
                        <h4>Expenses........amount.......................paid by</h4>
                        {
                            this.state.expenses_of_this_group &&
                            this.state.expenses_of_this_group.map((expense, index) => {
                                return (
                                    <div key={index}>
                                        <input value={expense} readOnly="readonly" /> <input value={this.state.expense_amount_of_this_group[index]} readOnly="readonly" /> <input value={this.state.name_of_user_who_paid[index]} readOnly="readonly" />
                                    </div>
                                )
                            })

                        }
                        

                    </div>
                    <div>
                        <h2>Group Balance</h2>
                        {
                            //group_bal_users_get
                            this.state.group_bal_users_get &&
                            this.state.group_bal_users_get.map((data, index) => {
                                return (
                                    <div key={index}>
                                        <input value={data.name} readOnly="readonly" /><label>Amount gets </label>  <input value={data.amount_gets} readOnly="readonly" />
                                    </div>
                                )
                            })

                        }
                      
                    </div>
                    <div>
                    {
                        //group_bal_users_ows
                        this.state.group_bal_users_ows &&
                        this.state.group_bal_users_ows.map((data, index) => {
                            return (
                                <div key={index}>
                                    <input value={data.name} readOnly="readonly" /><label>Amount ows </label>  <input value={data.amount_ows} readOnly="readonly" />
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

export default connect(connection_to_redux)(group_page);