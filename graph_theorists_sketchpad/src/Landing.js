import React from 'react';
import './styles/landing.css';

export default class Landing extends React.Component {
    render(){
        return (
            <section>
                <div className="create-pad">
                    <h1>Welcome!</h1>
                    <p>A Web Sketchpad that allows graphing anywhere</p>
                    <button className='create-graph' onClick={this.props.loadSketch.bind(this, null)}>Create Graph</button>
                </div>

                <div className="login">
                    <h2>Sign In</h2>

                    <form id="signin-form">
                        <input type="email" id="user-email" name="" placeholder="Enter E-mail" />
                        <input type="password" id="user-password" name="" placeholder="Enter Password" />
                        <input type="submit" name="" value="Login" />
                        <button className="forgot-account" onClick={this.props.switchView.bind(this, '#')}>Forgot Password</button>
                        <button className="create-account" onClick={this.props.switchView.bind(this, 'create')}>Create Account</button>
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
