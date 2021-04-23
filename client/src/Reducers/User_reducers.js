// import config_store from '../Store/config_store'

// const store = config_store()


//default global states
const user_global_state = {
    name: "",
    emailid: "",
    UID: "",
    phone_number: "",
    profile_photo:"",
    token:""


}


export default (state = user_global_state, action) => {
    switch (action.type) {
        case 'add_user':
            {
               
                return action.user
            }
        case 'remove_user':
            {
                return action.user
            }
        

        default:
            {
                return state;
            }
    }
}