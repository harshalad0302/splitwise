import React, {Component} from 'react';
import '../../App.css';


class landing extends Component {
   
   

        submitSignup = (e) => {
       this.props.history.push("/signup")
    }
    submitLogin =(e) =>
    {
        this.props.history.push("/Login")
    }

   

    render(){
        
       
        return(

            
            <div>
            <div className="App">
            <h1>LandingPage</h1>
            <div>
            <button onClick={this.submitLogin}>Login</button>
            <br />
            <br /> 
            <button onClick={this.submitSignup}>SignUp</button>
            <br />
            <br />
            
            </div>
           </div> 
            </div>
        )
    }
}
//Export The Main Component
export default landing;