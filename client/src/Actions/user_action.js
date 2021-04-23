// import config_store from '../Store/config_store'

// const store = config_store()

//user actions 
export const add_user = ({
    name = "",
    emailid = "",
    UID = "",
    phone_number = "",
    profile_photo = "",
    token=""


} = {}) => {

    return {
        type: 'add_user',
        user: {
            name,
            emailid,
            phone_number,
            UID,
            profile_photo,
            token


        }
    }

}

export const remove_user = () => {

    return {
        type: 'remove_user',
        user: {
            name: "",
            emailid: "",
            UID: "",
            phone_number: "",
            profile_photo: "",
            token: ""
        }
    }

}



