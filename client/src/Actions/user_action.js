// import config_store from '../Store/config_store'

// const store = config_store()

//user actions 
export const add_user = ({
    name = "",
    emailid = "",
    UID="",
    phone_number=""


} = {}) => {

    return {
        type: 'add_user',
        user: {
            name_user: name,
            emailid_user: emailid,
            phone_number_user:phone_number,
            UID_user:UID


        }
    }

}

export const remove_user = () => {

    return {
        type: 'remove_user',
        user: {
            name_user: "",
            emailid_user: "",
            UID:"",
            phone_number:""
        }
    }

}



