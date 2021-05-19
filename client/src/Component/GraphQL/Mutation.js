
import {gql} from 'apollo-boost';


export  const signupMutation = gql`
mutation signup($emailid: String, $password:String, $name:String){
    signup(emailid: $emailid, password: $password,  name: $name){
     auth_flag,
     message,
     message_length,
     UID,
     name,
     emailid,
     token
    }
}`


