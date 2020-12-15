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
    signOut(e) { 
        auth.signOut(); 
    }
     
    render(){
        return (
            <section>
                <div className="create-pad">
                    <h1>Welcome!</h1>
                    <p>A Web Sketchpad that allows graphing anywhere</p>

                    {/*TODO: Make it so signs in as guest*/}
                    <button className='create-graph'>Create Graph</button> 
                </div>

                <div className="login">
                    <h2>Sign In</h2>

                    <form id="signin-form">
                        <input type="email" id="user-email" value = {this.state.email} onChange = {this.handleChange} name="email" placeholder="Enter E-mail" />
                        <input type="password" id="user-password" value={this.state.password} onChange = {this.handleChange} name="password" placeholder="Enter Password" />
                        <input type="submit" onClick = {this.login} name="" value="Login" />
                        <button className="forgot-account" onClick={this.props.switchView.bind(this, '#')}>Forgot Password</button>
                        <button className="create-account" onClick={this.props.switchAccountView.bind(this, 'create')}>Create Account</button>
                    </form>
                </div>

                <ul className="dir">
                    <button className='home-button' onClick={this.props.switchView.bind(this, 'landing')}>Home</button>
                    <button className='about-button' onClick={this.props.switchView.bind(this, 'about')}>About</button>
                </ul>
            </section>
        )
    }
}
