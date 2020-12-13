import React from 'react';
import '../styles/landing.css';

export default class Landing extends React.Component {
    render(){
        return (
        <section>
        
        <div className="main">

                <h1>Welcome!</h1>
                <p>A Web Sketchpad that allows graphing anywhere</p>
                {/* <a href="sketchpad.html">Start Graph</a>*/}

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

            {/* <li><a href="landing.html">Home</a></li>
            <li><a href="about.html">About</a></li> */}

        </ul>

    </section>
        )
    }
}