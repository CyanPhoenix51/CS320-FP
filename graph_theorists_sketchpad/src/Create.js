import React from 'react';
import './styles/create.css';
import './firebase.js'
import { auth, db } from './firebase.js';

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
  this.canContinue=false;
   
}

handleChange (event) {
  const { id, value } = event.currentTarget;  
  const state = this.state; 
  if ( id === "first-name") { 
    state.firstName = value; 
  }
  else if(id=== "last-name") { 
    state.lastName = value;
  }
  else if(id=== "user-email") { 
    state.useremail = value;
  }
  else if(id=== "user-password") { 
    state.password = value;
  }
  else if(id === "user-confirm") { 
    state.cpassword = value;
  }
  this.setState(state);
}

clearForm () { 
  this.setState(emptyState);
}

daddySubmitter=(event)=> {
  if (this.handleSubmit(event)) {
    console.log(true);
    this.clearForm();
    this.props.switchView("sketchBook");
  }
  console.log(false);
}

 handleSubmit = (event) => {
   const state = this.state;
   event.preventDefault();
   if (state.password === state.cpassword) {
     auth.createUserWithEmailAndPassword(state.useremail, state.password).then(cred => {
       return db.collection('users').doc(cred.user.uid).set({
         sketchpad: "TestingFromReact"
       }).then(() => {
         console.log(cred);
         //Once we created the user, now we update the information about the user.
         if (cred) {
           auth.currentUser.updateProfile({
             displayName: state.firstName + " " + state.lastName
           }).then(()=>{
             this.canContinue=true;
             this.setState(this.state);
           });
         }
       })
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
    if(this.canContinue){
      this.props.switchView('sketchBook');
    }
    return (
        <section>
          <div className="main">
            <h1>Create Account</h1>
            <form id="signup-form">
              <input type="fname" id="first-name" name="" placeholder="Enter First Name" onChange = {event => this.handleChange(event)}/>
              <input type="lname" id="last-name" name="" placeholder="Enter Last Name" onChange = {event => this.handleChange(event)}/>

              <input type="email" id="user-email" name="" placeholder="Enter E-mail" onChange = {event => this.handleChange(event)}/>
              <input type="password" id="user-password" name="" placeholder="Enter Password" onChange = {event => this.handleChange(event)}/>
              <input type="password" id="user-confirm" name="" placeholder="Confirm Password" onChange = {event => this.handleChange(event)}/>
              <input type="submit" name="" value="Create" onClick = {this.handleSubmit}/>
              {/*<a href="landing.html">Sign in instead</a>*/}
            </form>
          </div>
        </section>
    );
  }
}