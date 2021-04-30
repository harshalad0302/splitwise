import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Login_header from '../Login_header/Login_header'
import avatar_image from '../../Assests/Img/avatar.png'
import { connect } from 'react-redux';
import { add_user } from '../../Actions/user_action'
import backendServer from '../../../src/WebConfig';
import Left_toggel_bar from '../Left_Toggle_bar/left_toggel_bar'

const connection_to_redux = (state) => {

    return {
        user: state.user
    }
}


class profile extends Component {


    constructor(props) {
        super(props);
        this.state = {
            emailid: "",
            name: "",
            UID: "",
            phone_number: "",
            password: "",
            auth_flag_update: "",
            file: "",
            auth_flag: false,
            error_message: "",
            profile_photo: "",
            token: this.props.user.token
        }

    }


    edit_name_click = (e) => {
        document.getElementById("name_field_id").removeAttribute('readonly');
        document.getElementById("name_field_id").removeAttribute('placeholder');

    }


    OnChange_name_input = (e) => {

        this.setState({
            name: e.target.value

        })

    }


    edit_email_click = (e) => {
        document.getElementById("edit_email").removeAttribute('readonly');
        document.getElementById("edit_email").removeAttribute('placeholder');

    }


    OnChange_email_input = (e) => {

        this.setState({
            emailid: e.target.value

        })

    }

    passwordOnChange = (e) => {

        this.setState({
            password: e.target.value

        })

    }

    PasswordEditClick = (e) => {
        document.getElementById("password_edit_box").removeAttribute('readonly');
        document.getElementById("password_edit_box").removeAttribute('placeholder');

    }


    edit_phone_number_click = (e) => {
        document.getElementById("edit_phone_number").removeAttribute('readonly');
        document.getElementById("edit_phone_number").removeAttribute('placeholder');

    }


    OnChange_phone_number_input = (e) => {

        this.setState({
            phone_number: e.target.value

        })

    }


    save_button_click = async (e) => {
        e.preventDefault();

        let formData = new FormData()
        formData.append('u_avatar', this.state.file)
        formData.append('name', this.state.name)
        formData.append('emailid', this.state.emailid)
        formData.append('phone_number', this.state.phone_number)
        formData.append('password', this.state.password)
        formData.append('UID', this.props.user.UID)
        formData.append('token', this.props.user.token)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        const response_save = (await axios.post(`${backendServer}/profile`, formData, config)).data



        if (response_save.auth_flag === "S") {

            response_save.updated_state.token = response_save.token
            await this.props.dispatch(add_user(response_save.updated_state))
            await this.props.history.push("/actual_dashboard")

        }
        else {
            this.setState({
                auth_flag: true,
                error_message: <div>
                    {
                        response_save.message.map((error_message, index) => {
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

    FileOnChange = (e) => {

        this.setState({

            file: e.target.files[0]
        })

    }

    componentDidMount = (e) => {


        if (this.props.user.profile_photo) {
            this.setState(() => ({ profile_photo: `data:image/png;base64,${Buffer.from(this.props.user.profile_photo, 'base64')}` }))
        }
        else {
            this.setState(() => {

                return ({ profile_photo: avatar_image })
            })
        }

     



    }


    render() {

        return (
            <div>
                <div className="Main_inside_header">
                    <Login_header props={this.props} />
                </div>
                <div className="container">
                    <div className="leftdiv">
                        <Left_toggel_bar props={this.props} />
                    </div>
                    <div className="d-flex flex-column my-2">
                        <div className="my-2 font_class">
                            {this.state.auth_flag && <div className="inputTextClass red_error_background">{this.state.error_message} </div>}
                            <h2>Your account</h2>
                        </div>
                        <div className="d-flex flex-row display-content-start mx-2">
                            <div className="w-25">
                                <div className="d-flex flex-column">
                                    <div>
                                        <img src={this.state.profile_photo} style={{ width: "200px", height: "200px" }}></img>

                                    </div>
                                    <div className="my-4">
                                        <input type="file" name="filetag" onChange={this.FileOnChange} />
                                        <img src="" className="rounded mx-auto d-block" name="imagetag"></img>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <div className="d-flex flex-column ">
                                    <div>
                                        <p>Your name</p>
                                    </div>
                                    <div>
                                        <div className="d-flex flex-row justify-content-start">
                                            <div className="w-75">
                                                <input type="text" className="inputTextClass_invisible" placeholder={this.props.user.name} readOnly="readonly" onChange={this.OnChange_name_input} name="Name" id="name_field_id"></input>
                                            </div>
                                            <div className="w-25">
                                                <a className="text-decoration-none EditTag ">
                                                    <button className="button_edit" onClick={this.edit_name_click} >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"></path>
                                                        </svg>Edit
                                                    </button>
                                                </a>
                                            </div>

                                        </div>
                                    </div>
                                    <div>
                                        <p>Your email address</p>
                                    </div>
                                    <div className="d-flex flex-row justify-content-start">
                                        <div className="w-75">
                                            <input type="text" className="inputTextClass_invisible" placeholder={this.props.user.emailid} readOnly="readonly" id="edit_email" onChange={this.OnChange_email_input} ></input>
                                        </div>
                                        <div className="w-25">
                                            <a className="text-decoration-none EditTag">
                                                <button className="button_edit" onClick={this.edit_email_click}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"></path>
                                                    </svg>Edit
                                                </button>
                                            </a>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Your phone number</p>
                                    </div>
                                   
                                    <div className="d-flex flex-row justify-content-start">
                                        <div className="w-75 ">
                                       +1 <input type="number" className="inputTextClass_invisible" id="edit_phone_number" placeholder={this.props.user.phone_number} readOnly="readonly" onChange={this.OnChange_phone_number_input}></input>
                                        </div>
                                        <div className="w-25">
                                            <a className="text-decoration-none EditTag">
                                                <button className="button_edit" onClick={this.edit_phone_number_click}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"></path>
                                                    </svg>Edit
                                                </button>
                                            </a>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Your password</p>
                                    </div>
                                    <div className="d-flex flex-row justify-content-start">
                                        <div className="w-75 ">
                                            <input type="password" className="inputTextClass_invisible" placeholder="********" readOnly="readonly" id="password_edit_box" onChange={this.passwordOnChange} ></input>
                                        </div>
                                        <div className="w-25">
                                            <a className="text-decoration-none EditTag">
                                                <button className="button_edit" onClick={this.PasswordEditClick}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"></path>
                                                    </svg>Edit
                                                </button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-25">
                                <div className="d-flex flex-column my-2">
                                    <div className="my-2">
                                        <p>Your default currency</p>
                                    </div>
                                    <div className="w-100">
                                        <select className="select_styles" defaultValue="0">
                                            <option value="0">USD</option>
                                            <option value="1">KWD</option>
                                            <option value="2">BHD</option>
                                            <option value="3">GBP</option>
                                            <option value="4">EUR</option>
                                            <option value="5">CAD</option>
                                        </select>
                                    </div>
                                    <div className="my-2">
                                        <p>Your time zone</p>
                                    </div>
                                    <div className="w-100">
                                        <select className="select_styles" defaultValue="0">
                                            <option value="0">(GMT -12:00) Eniwetok, Kwajalein</option>
                                            <option value="-11:00">(GMT -11:00) Midway Island, Samoa</option>
                                            <option value="-10:00">(GMT -10:00) Hawaii</option>
                                            <option value="-09:50">(GMT -9:30) Taiohae</option>
                                            <option value="-09:00">(GMT -9:00) Alaska</option>
                                            <option value="-08:00">(GMT -8:00) Pacific Time (US &amp; Canada)</option>
                                            <option value="-07:00">(GMT -7:00) Mountain Time (US &amp; Canada)</option>
                                            <option value="-06:00">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>
                                            <option value="-05:00">(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
                                            <option value="-04:50">(GMT -4:30) Caracas</option>
                                            <option value="-04:00">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>
                                            <option value="-03:50">(GMT -3:30) Newfoundland</option>
                                            <option value="-03:00">(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>
                                            <option value="-02:00">(GMT -2:00) Mid-Atlantic</option>
                                            <option value="-01:00">(GMT -1:00) Azores, Cape Verde Islands</option>
                                            <option value="+00:00" selected="selected">(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
                                            <option value="+01:00">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</option>
                                            <option value="+02:00">(GMT +2:00) Kaliningrad, South Africa</option>
                                            <option value="+03:00">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>
                                            <option value="+03:50">(GMT +3:30) Tehran</option>
                                            <option value="+04:00">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
                                            <option value="+04:50">(GMT +4:30) Kabul</option>
                                            <option value="+05:00">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>
                                            <option value="+05:50">(GMT +5:30) Bombay, Calcutta, Madras, New Delhi</option>
                                            <option value="+05:75">(GMT +5:45) Kathmandu, Pokhara</option>
                                            <option value="+06:00">(GMT +6:00) Almaty, Dhaka, Colombo</option>
                                            <option value="+06:50">(GMT +6:30) Yangon, Mandalay</option>
                                            <option value="+07:00">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                                            <option value="+08:00">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</option>
                                            <option value="+08:75">(GMT +8:45) Eucla</option>
                                            <option value="+09:00">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>
                                            <option value="+09:50">(GMT +9:30) Adelaide, Darwin</option>
                                            <option value="+10:00">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>
                                            <option value="+10:50">(GMT +10:30) Lord Howe Island</option>
                                            <option value="+11:00">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>
                                            <option value="+11:50">(GMT +11:30) Norfolk Island</option>
                                            <option value="+12:00">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>
                                            <option value="+12:75">(GMT +12:45) Chatham Islands</option>
                                            <option value="+13:00">(GMT +13:00) Apia, Nukualofa</option>
                                            <option value="+14:00">(GMT +14:00) Line Islands, Tokelau</option>
                                        </select>
                                    </div>
                                    <div className="my-2">
                                        <p>Language</p>
                                    </div>
                                    <div>
                                        <select className="select_styles" defaultValue="0">
                                            <option value="0">English</option>
                                            <option value="SQ">Albanian</option>
                                            <option value="AR">Arabic</option>
                                            <option value="HY">Armenian</option>
                                            <option value="EU">Basque</option>
                                            <option value="BN">Bengali</option>
                                            <option value="BG">Bulgarian</option>
                                            <option value="CA">Catalan</option>
                                            <option value="KM">Cambodian</option>
                                            <option value="ZH">Chinese (Mandarin)</option>
                                            <option value="HR">Croatian</option>
                                            <option value="CS">Czech</option>
                                            <option value="DA">Danish</option>
                                            <option value="NL">Dutch</option>
                                            <option value="ET">Estonian</option>
                                            <option value="FJ">Fiji</option>
                                            <option value="FI">Finnish</option>
                                            <option value="FR">French</option>
                                            <option value="KA">Georgian</option>
                                            <option value="DE">German</option>
                                            <option value="EL">Greek</option>
                                            <option value="GU">Gujarati</option>
                                            <option value="HE">Hebrew</option>
                                            <option value="HI">Hindi</option>
                                            <option value="HU">Hungarian</option>
                                            <option value="IS">Icelandic</option>
                                            <option value="ID">Indonesian</option>
                                            <option value="GA">Irish</option>
                                            <option value="IT">Italian</option>
                                            <option value="JA">Japanese</option>
                                            <option value="JW">Javanese</option>
                                            <option value="KO">Korean</option>
                                            <option value="LA">Latin</option>
                                            <option value="LV">Latvian</option>
                                            <option value="LT">Lithuanian</option>
                                            <option value="MK">Macedonian</option>
                                            <option value="MS">Malay</option>
                                            <option value="ML">Malayalam</option>
                                            <option value="MT">Maltese</option>
                                            <option value="MI">Maori</option>
                                            <option value="MR">Marathi</option>
                                            <option value="MN">Mongolian</option>
                                            <option value="NE">Nepali</option>
                                            <option value="NO">Norwegian</option>
                                            <option value="FA">Persian</option>
                                            <option value="PL">Polish</option>
                                            <option value="PT">Portuguese</option>
                                            <option value="PA">Punjabi</option>
                                            <option value="QU">Quechua</option>
                                            <option value="RO">Romanian</option>
                                            <option value="RU">Russian</option>
                                            <option value="SM">Samoan</option>
                                            <option value="SR">Serbian</option>
                                            <option value="SK">Slovak</option>
                                            <option value="SL">Slovenian</option>
                                            <option value="ES">Spanish</option>
                                            <option value="SW">Swahili</option>
                                            <option value="SV">Swedish </option>
                                            <option value="TA">Tamil</option>
                                            <option value="TT">Tatar</option>
                                            <option value="TE">Telugu</option>
                                            <option value="TH">Thai</option>
                                            <option value="BO">Tibetan</option>
                                            <option value="TO">Tonga</option>
                                            <option value="TR">Turkish</option>
                                            <option value="UK">Ukrainian</option>
                                            <option value="UR">Urdu</option>
                                            <option value="UZ">Uzbek</option>
                                            <option value="VI">Vietnamese</option>
                                            <option value="CY">Welsh</option>
                                            <option value="XH">Xhosa</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mx-2">
                            <button className="lightbutton" onClick={this.save_button_click}>Save</button>
                        </div>

                    </div>

                </div>
            </div>

        )
    }
}


export default connect(connection_to_redux)(profile);