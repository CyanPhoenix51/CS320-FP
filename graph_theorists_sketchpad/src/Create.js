import React from 'react';
import './styles/create.css';

export default class Create extends React.Component {
  render() {
    return (

        <section>

          <div className="main">

            <h1>Create Account</h1>

            <form id="signup-form">

              <input type="fname" id="first-name" name="" placeholder="Enter First Name"/>
              <input type="lname" id="last-name" name="" placeholder="Enter Last Name" />

              <input type="email" id="user-email" name="" placeholder="Enter E-mail"/>
              <input type="password" id="user-password" name="" placeholder="Enter Password"/>
              <input type="password" id="user-confirm" name="" placeholder="Confirm Password"/>
              <input type="submit" name="" value="Create"/>


              {/*<a href="landing.html">Sign in instead</a>*/}

            </form>

          </div>

        </section>

    );
  }
}