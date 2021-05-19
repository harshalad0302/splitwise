import { Query } from 'react-apollo'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost';

const LOGIN = gql`
query login($emailid: String, $password:String){
    login(emailid: $emailid, password: $password){
     auth_flag,
     name,
    emailid,
    UID,
    phone_number,
     token,
     message,
     message_length
    }
}`

const CREATE_GROUP = gql`
query Create_group($emailid_of_members: [String], $length:Int, $owner: String, $owner_UID:Int, $group_name:String){
  Create_group(emailid_of_members: $emailid_of_members, length: $length, owner:$owner, owner_UID:$owner_UID, group_name:$group_name){
     auth_flag,
     message,
     message_length
    }
}`

const GROUP_PAGE_INVITE = gql`
query group_page_invite($UID: Int, $name:String){
  group_page_invite(UID: $UID, name: $name){
    auth_flag
    message
      message_length
      invite_from_groups{
        group_name{
          group_name
        }
        
        groupID
      }
      amount_owes{
        amount_owes
      }
      amount_gets{
        amount_gets
      }
      amount_gets_length
      amount_owes_length
    }
}`



const group_invite_accept_req = gql`
query group_invite_accept_req($UID: Int, $name:String, $group_name :String, $groupID : Int){
  group_invite_accept_req(UID: $UID, name: $name , group_name: $group_name, groupID : $groupID ){
    auth_flag
    message
    message_length

  }
}`


export { LOGIN ,CREATE_GROUP,GROUP_PAGE_INVITE,group_invite_accept_req }