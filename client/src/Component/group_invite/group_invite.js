import React, { Component } from 'react';
import '../../App.css';
import Login_header from '../Login_header/login_header'
import { connect } from 'react-redux';
import axios from 'axios';
import backendServer from '../../../src/WebConfig';


const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}



class group_invite extends Component {

    state = {
        invites_from_group: undefined,
         group_ids_invite:undefined,
         User_is_part_of_group:undefined,
         User_is_part_of_group_id:undefined,
         auth_flag :false,
         error_message:"",
         filtered_array:undefined
    }


    componentDidMount = async (e) => {
        const data = {
            UID: this.props.user.UID_user
        }
     
       
       const group_invite_req = await axios.post(`${backendServer}/group_page_invite`, data)
        const group_names=[]
        const group_ids=[]
        const group_name_accepted=[]
        const group_id_accepted=[]
       for(var i=0;i<group_invite_req.data.count_invitations;i++)
       {
        group_names.push(group_invite_req.data.group_names[i].group_name)
        group_ids.push(group_invite_req.data.group_ids[i].invite_from_group_id)
       }

       for(var i=0;i<group_invite_req.data.count_invitations_accepted;i++)
       {
        group_name_accepted.push(group_invite_req.data.group_names_accpeted[i].group_name)
        group_id_accepted.push(group_invite_req.data.group_ids_accepted[i].invite_from_group_id)
       }

       this.setState(()=>({
           invites_from_group:group_names,
           User_is_part_of_group:group_name_accepted,
           User_is_part_of_group_id:group_id_accepted,
           group_ids_invite:group_ids
       }))






    }


    handelRejecteOnClick =  (index) => 
    {

      const data={
        group_to_be_rejeceted:this.state.invites_from_group[index],
        group_ids_to_be_rejected:this.state.group_ids_invite[index],
        current_UID:this.props.user.UID_user
      }

     const rejected_group =  axios.post(`${backendServer}/group_invite_reject_req`, data)
      
      this.state.invites_from_group.splice(index,1)

        this.setState(()=>({
            invites_from_group:this.state.invites_from_group
        }))
      

    }

    handelAcceptOnClick =async(index)=>
    {
        
        //sending this to backed to get inserted
        const data={
            accepted_group_name:this.state.invites_from_group[index],
            accepted_group_id:this.state.group_ids_invite[index],
            current_UID:this.props.user.UID_user,
            current_UID_name:this.props.user.name_user
        }

        const response_accepted_group_req=axios.post(`${backendServer}/group_invite_accept_req`, data)
        this.state.invites_from_group.splice(index,1)
        this.forceUpdate()

    }


    GotoGroup_on_click =(index)=>{

      
        this.props.history.push({
            pathname: '/group_page',
          
            state: { group_name: this.state.User_is_part_of_group[index],
                group_id:this.state.User_is_part_of_group_id[index]
             }
          })

    }


    OnClickLeaveGroup= async (index)=>
    {

        
        const data={
            group_name:this.state.User_is_part_of_group[index],
            group_id:this.state.User_is_part_of_group_id[index],
            UID:this.props.user.UID_user,
            UID_name:this.props.user.name_user
        }

        const response_leave_group= await axios.post(`${backendServer}/leave_group`, data)
       
        if(response_leave_group.data.flag_settle==="S")
        {
            //user can leave the group
            this.state.User_is_part_of_group.splice(index,1)
            this.forceUpdate()
        }
        if(response_leave_group.data.flag_settle==="F")
        {
            this.setState({
                auth_flag :true,
                error_message : <div>
                <label><b>User has not settled up the expenses in this group! cant leave before that</b></label>
                </div>
               })
        }
      
    }

    OnChangSerachBar= (e)=>{
        const value_serach=e.target.value
      const filtered=this.state.User_is_part_of_group.filter((group)=>{
          return group.includes(value_serach)
      })

      this.setState(()=>({
        filtered_array:filtered
    }))
  
  
    }

    render() {


        return (

            <div>
                <div className="App">
                    <Login_header props={this.props} />
                    <div>
                    <br/>
                    <label><b>Invites from </b></label>
                    <div > {this.state.invite_from_group_id ? "":"You have zero invites right now"}</div>
                    </div>

                    {
                       
                        this.state.invites_from_group &&
                        this.state.invites_from_group.map((invite, index) => {
                            return (
                                <div key={index}>
                                    <input value={invite} readOnly="readonly" /><button onClick={ () => this.handelAcceptOnClick(index)} className="button_Login">Accept</button> <button onClick={ () => this.handelRejecteOnClick(index)} className="button_signUp">reject</button>
                                </div>
                            )
                        })

                    }

                    <div>
                    <br/>
                   
                    <br/>
                    <label><b>My groups  </b></label>
                    <div>
                    <input type="text" placeholder="search for group" onChange={this.OnChangSerachBar}></input>
                    <br/>
                    <br/>
                    </div>
                    {
                        !this.state.filtered_array &&
                        this.state.User_is_part_of_group &&
                        this.state.User_is_part_of_group.map((user, index) => {
                            return (
                                <div key={index}>
                                    <input value={user} readOnly="readonly" /> <button onClick={() =>this.GotoGroup_on_click(index)}className="button_Login">Go to group</button> <button onClick={() =>this.OnClickLeaveGroup(index)} className="button_signUp">Leave Group</button>
                                </div>
                            )
                        })

                        
                    }
                    {
                        this.state.filtered_array &&
                        this.state.filtered_array.map((user, index) => {
                            return (
                                <div key={index}>
                                    <input value={user} readOnly="readonly" /> <button onClick={() =>this.GotoGroup_on_click(index)} className="button_Login">Go to group</button> <button onClick={() =>this.OnClickLeaveGroup(index)} className="button_signUp">Leave Group</button>
                                </div>
                            )
                        })

                        
                    }
                    </div>
                    {this.state.auth_flag && <div className="error_div">{this.state.error_message} </div>}
                </div>
            </div>
        )
    }
}


export default connect(connection_to_redux)(group_invite);