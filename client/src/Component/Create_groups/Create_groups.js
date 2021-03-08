import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import logo_image from '../../Assests/Img/splitwise_logo.svg'
import Login_header from '../Login_header/Login_header'


class Create_groups extends Component {

    render() {


        return (
            <div>

                <div>
                    <Login_header props={this.props} />
                </div>
                <div>
                    <p>START A NEW GROUP</p>
                    <br />
                  
                    <label>My group shall be called…</label>
                    <br></br>
                    <input type="text"></input>
                    <br />
                    <br />

                    <input type="text"></input>
                    <br />
                    <br />
                    <button>SAVE</button>
                    <br />
                    <br />
                    <input type="file" name = "filetag" />
                    <br></br>
                    <br></br>
                    <img src="" className="rounded mx-auto d-block" name = "imagetag"></img>
                </div>

                <div>

                </div>

        ]</div>


        )
    }
}
//Export The Main Component
export default Create_groups;