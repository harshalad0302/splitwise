const { gql } = require('apollo-server-express');


const typeDefs = gql`
    type user {
        auth_flag:String,
        name:String,
        emailid:String,
        UID:Int,
        phone_number:String,
        token:String,
        message:[String],
        message_length:String,
      
    }

    
    type group_name_inside{
        _id: Int
        group_name:String
    }
    type invite_from_groups_inside{
        group_name:group_name_inside
        groupID: Int
    }
    type amount_gets_inside {
        _id :Int
        amount_gets:Int
    }
    type amount_owes_inside {
        _id : Int
        amount_owes : Int
    }
    type group {
        auth_flag:String,
        message:[String],
        message_length:Int
        invite_from_groups:[invite_from_groups_inside]
        amount_gets:[amount_gets_inside]
        amount_owes:[amount_owes_inside]
        amount_gets_length: Int
        amount_owes_length: Int
    }

    type Query {
        login(emailid: String, password: String): user
        Create_group(emailid_of_members: [String], length: Int, owner: String, owner_UID:Int, group_name:String):user
        group_page_invite(UID:Int,name:String):group
        group_invite_accept_req(group_name: String, name: String, UID:Int ,groupID:Int) :user
    }

    type Mutation {
        signup(emailid: String, password: String, name: String): user
      
       
    }

   
`


module.exports = typeDefs;