// Singing up


const signinForm = document.querySelector('#signin-form');
const signupForm = document.querySelector('#signup-form');
const logout = document.querySelector('#logoutbutton');



auth.onAuthStateChanged(user => { 
  if (user) { 
    console.log("user logged in: ", user);
    
  } else { 
    console.log("user is logged out");
  }
});
checkloggedin = function() { 
  auth.onAuthStateChanged(user => { 
    if (user) { 
      return true;
    } else { 
      return false;
    }
});
}

if(signinForm != null) { 
  signinForm.addEventListener('submit', (e) => { 
    e.preventDefault() 

    //Getting info from the user
    const userEmail = signinForm['user-email'].value;
    const userPassword = signinForm['user-password'].value; 

    //Logging the User in.
    auth.signInWithEmailAndPassword(userEmail, userPassword).then(cred => { 
      window.location.replace("sketchbook.html")
      signinForm.reset(); 
    }).catch(function(error) { 
      
      var errorUserNotfoundCodeMessage = "Email is not signed up";
      var errorInvalidEmailPasswordMessaage = "Wrong Email or Password" 


      // Error handing on sign-in 
      if (error.code === "auth/user-not-found") { 
        alert(errorUserNotfoundCodeMessage); 
      }
      else if(error.code === "auth/invalid-email" || error.code === "auth/wrong-password") { 
        alert(errorInvalidEmailPasswordMessaage);
      }
      else { 
        alert(error.message); 
      }

    
    })
  });
}



if (signupForm != null) { 
  signupForm.addEventListener('submit', (e) => { 
    e.preventDefault() 

    //Getting the information

    const userEmail = signupForm['user-email'].value; 
    const userPassword = signupForm['user-password'].value; 
    const userFirstName = signupForm['first-name'].value; 
    const userLastname = signupForm['last-name'].value; 
    const userConfirmPassword = signupForm['user-confirm'].value;
    

    // Confirming the user's password. 
    if(userPassword === userConfirmPassword) { 
      auth.createUserWithEmailAndPassword(userEmail, userPassword).then( cred => {  
        //Once we created the user, now we update the information about the user. 
        if(cred) { 
          auth.currentUser.updateProfile({ 
            displayName: userFirstName + " " + userLastname
          }).then()
        }
        window.location.replace("sketchbook.html")
        signupForm.reset();
        // Error Handling
      }).catch(function(error) { 
        var errorCode = error.code; 
        var errorMessage = error.message; 

        if (errorCode === "auth/email-already-in-use") { 
          alert("Email is already in use!!"); 
        }
        else if (errorCode === "auth/invalid-email") { 
          alert("Email is not valid."); 
        }
        else if (errorCode === "auth-weakpassword") { 
          alert("Weak password."); 
        }
        else { 
          alert(errorMessage);
        }
        console.log(error); 
        })
    }
    else { 
      alert('Passwords do not match'); 
    }
  });
}

if(logout != null) { 
  logout.addEventListener('click', (e) => { 
    e.preventDefault() 
    window.location.replace("landing.html");
    auth.signOut().then(() => { 
      console.log('signed user out')
    })
  })
}