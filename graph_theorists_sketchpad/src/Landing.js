import React from 'react';
import './styles/landing.css';

export default class Landing extends React.Component {
    render(){
        return (
        <section>
        
        <div className="main">

                <h1>Welcome!</h1>
                <p>A Web Sketchpad that allows graphing anywhere</p>
                <button onClick={this.props.loadSketch.bind(this, null)}>Create Graph</button>

        </div>

        <div className="login">

            <h2>Sign In</h2>

            <form id="signin-form">

                <input type="email" id="user-email" name="" placeholder="Enter E-mail" />
                <input type="password" id="user-password" name="" placeholder="Enter Password" />
                <input type="submit" name="" value="Login" />

                {/* <a href="#">Forgot Password</a>
                <a href="create.html">Create Account</a> */}

            </form>
        </div>

        <div className="logout">
            <input type="submit" id="logoutbutton" name="" value="Logout" />

        </div>


        <ul className="dir">

            <button onClick={this.props.switchView.bind(this, 'landing')}>Home</button>
            <button onClick={this.props.switchView.bind(this, 'about')}>About</button>

        </ul>

    </section>
        )
    }
}