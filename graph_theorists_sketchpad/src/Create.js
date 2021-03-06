import React from 'react';
import './styles/create.css';
import './firebase.js'
import { auth} from './firebase.js';

const emptyState = { 
    firstName: "", 
    lastName: "", 
    useremail: "", 
    password: "", 
    cpassword: "", 
  };
export default class Create extends React.Component {
  constructor(props) { 
    super(props); 
  this.state = emptyState;
   
}

handleChange(e) { 
        this.setState( { 
            [e.target.name] : e.target.value, 
        })
    }

clearForm () { 
  this.setState(emptyState);
}

 handleSubmit = (event) => {
   const state = this.state;
   event.preventDefault();
   if (state.password === state.cpassword) {
     auth.createUserWithEmailAndPassword(state.useremail, state.password).then(cred => {
       //Once we created the user, now we update the information about the user.
       if (cred) {
           auth.currentUser.updateProfile({
             displayName: state.firstName + " " + state.lastName
           }).then(() => {
             this.props.switchAccountView('sketchBook');
           });
         }
     }).catch(error => {
       var errorCode = error.code;
       var errorMessage = error.message;

       if (errorCode === "auth/email-already-in-use") {
         alert("Email is already in use!!");
       } else
         if (errorCode === "auth/invalid-email") {
           alert("Email is not valid.");
         } else
           if (errorCode === "auth-weakpassword") {
             alert("Weak password.");
           } else {
             alert(errorMessage);
           }
       console.log(error);
     });
   }
 }

  render() {
    return (
        <section>
          <div className="account">
            <h1>Create Account</h1>
            <form id="signup-form">
              <input type="fname" id="first-name" name="firstName" placeholder="Enter First Name" onChange = {event => this.handleChange(event)}/>
              <input type="lname" id="last-name" name="lastName" placeholder="Enter Last Name" onChange = {event => this.handleChange(event)}/>

              <input type="email" id="user-email" name="useremail" placeholder="Enter E-mail" onChange = {event => this.handleChange(event)}/>
              <input type="password" id="user-password" name="password" placeholder="Enter Password" onChange = {event => this.handleChange(event)}/>
              <input type="password" id="user-confirm" name="cpassword" placeholder="Confirm Password" onChange = {event => this.handleChange(event)}/>
              <input type="submit" name="" value="Create" onClick = {this.handleSubmit}/>

              <button className='signIn-button' onClick={this.props.switchAccountView.bind(this, 'landing')}>Sign In Instead</button>

            </form>
          </div>
        </section>
    );
  }
} 
