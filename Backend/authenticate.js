// Singing up

const signupForm = document.querySelector('#signup-form');

auth.onAuthStateChanged(user => { 
  if (user) { 
    console.log("user logged in: ", user);
  } else { 
    console.log("user is logged out");
  }
});




signupForm.addEventListener('submit', (e) => { 
  e.preventDefault() 

  //Getting info from the user
  const userEmail = signupForm['user-email'].value;
  const userPassword = signupForm['user-password'].value; 

  //Logging the User in.
  auth.signInWithEmailAndPassword(userEmail, userPassword).then(cred => { 
    
    signupForm.reset(); 
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