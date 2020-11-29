// Singing up

const signinForm = document.querySelector('#signin-form');
const singupForm = document.querySelector('#signup-form')

auth.onAuthStateChanged(user => { 
  if (user) { 
    console.log("user logged in: ", user);
  } else { 
    console.log("user is logged out");
  }
});


signinForm.addEventListener('submit', (e) => { 
  e.preventDefault() 

  //Getting info from the user
  const userEmail = signinForm['user-email'].value;
  const userPassword = signinForm['user-password'].value; 

  //Logging the User in.
  auth.signInWithEmailAndPassword(userEmail, userPassword).then(cred => { 
    
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
})