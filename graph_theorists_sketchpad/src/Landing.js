import React from 'react';
import { auth } from './firebase';
import './styles/landing.css';

export default class Landing extends React.Component {
    constructor(props) { 
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = { 
            email: '', 
            password: '',
        }
    }
    
    login (e) { 
        e.preventDefault(); 
        auth.signInWithEmailAndPassword(this.state.email, this.state.password).then((cred) => { 
            if(cred) { 
                console.log(cred);
            }
        }).catch((error) => {
            console.log(error);
        });
    }
    handleChange(e) { 
        this.setState( { 
            [e.target.name] : e.target.value, 
        })
    }
     
    render(){
        return (
        <section>
        
        <div className="main">

                <h1>Welcome!</h1>
                <p>A Web Sketchpad that allows graphing anywhere</p>

        </div>

        <div className="login">

            <h2>Sign In</h2>

            <form id="signin-form">

                <input type="email" id="user-email" value = {this.state.email} onChange = {this.handleChange} name="email" placeholder="Enter E-mail" />
                <input type="password" id="user-password" value={this.state.password} onChange = {this.handleChange} name="password" placeholder="Enter Password" />
                <input type="submit" onClick = {this.login} name="" value="Login" />

                <button onClick={this.props.switchAccountView.bind(this, 'create')}>Create Account</button>

            </form>
        </div>

        <div className="logout">
            <input type="submit" id="logoutbutton" name="" value="Logout" />

        </div>


        <ul className="dir">


        </ul>

    </section>
        )
    }
}