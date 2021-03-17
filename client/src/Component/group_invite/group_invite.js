import React, { Component } from 'react';
import '../../App.css';
import Login_header from '../Login_header/Login_header'
import { connect } from 'react-redux';
import axios from 'axios';


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
         User_is_part_of_group_id:undefined
    }


    componentDidMount = async (e) => {
        const data = {
            UID: this.props.user.UID_user
        }
     
       
       const group_invite_req = await axios.post('http://localhost:3002/group_page_invite', data)
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

     const rejected_group =  axios.post('http://localhost:3002/group_invite_reject_req', data)
      
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
            current_UID:this.props.user.UID_user
        }

        const response_accepted_group_req=axios.post('http://localhost:3002/group_invite_accept_req', data)



    }


    GotoGroup_on_click =(index)=>{

      
        this.props.history.push({
            pathname: '/group_page',
          
            state: { group_name: this.state.User_is_part_of_group[index],
                group_id:this.state.User_is_part_of_group_id[index]
             }
          })

    }


    OnClickLeaveGroup=(index)=>
    {

        console.log("On leave is submitted for ")
    }

    render() {


        return (

            <div>
                <div className="App">
                    <Login_header props={this.props} />

                    {
                        this.state.invites_from_group &&
                        this.state.invites_from_group.map((invite, index) => {
                            return (
                                <div key={index}>
                                    <input value={invite} readOnly="readonly" /><button onClick={ () => this.handelAcceptOnClick(index)}>Accept</button> <button onClick={ () => this.handelRejecteOnClick(index)}>reject</button>
                                </div>
                            )
                        })

                    }

                    <div>
                    <h2>my groups </h2>
                    {
                        this.state.User_is_part_of_group &&
                        this.state.User_is_part_of_group.map((user, index) => {
                            return (
                                <div key={index}>
                                    <input value={user} readOnly="readonly" /> <button onClick={() =>this.GotoGroup_on_click(index)}>Go to group</button> <button onClick={() =>this.OnClickLeaveGroup(index)}>Leave Group</button>
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


export default connect(connection_to_redux)(group_invite);