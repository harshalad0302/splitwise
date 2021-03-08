import React, {Component} from 'react';
import '../../App.css';
import Login_header from '../Login_header/Login_header'

class dashboard extends Component {
   
   

    render(){
        
       
        return(

            <div>
            <div className="App">
            <Login_header props={this.props}/>
           <h1>Dashboard</h1>
           </div> 
            </div>
        )
    }
}
//Export The Main Component
export default dashboard;