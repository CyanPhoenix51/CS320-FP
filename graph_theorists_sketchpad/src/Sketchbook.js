import React from 'react';
import SavedSketch from "./SavedSketch";
import './styles/sketchbook.css';
import { auth, db } from './firebase.js';

export default class Sketchbook extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      x: []
    }
    //holds the keys of all selected divs containing saved sketches
    this.selectedSketchDoc = null;
    this.selectedSketch = null;
  }
  
  signOut () { 
    auth.signOut(); 
  }

  componentDidMount() {
    const uidRef = db.collection(this.props.user.uid);
    uidRef.get().then((snapshot) => {
      const state = this.state;
      snapshot.forEach(doc => {
        state.x.push(doc.data());
      })
      this.setState(state);
    });
  }

  handleSelect=(key, sketch)=> {
    //are we selecting or deselecting?
    if(this.selectedSketchDoc){
      //deselect selected document
      this.selectedSketchDoc.style.setProperty('--is-selected', null);
    }
    //send signal to this guy
    this.selectedSketchDoc = document.getElementById(key);
    this.selectedSketchDoc.style.setProperty('--is-selected', 'pink');

    //the guy we'd actually be loading/deleting
    this.selectedSketch = sketch;
  }

  attemptLoadSketch=()=> {
    if (this.selectedSketch) {
      this.props.loadSketch.bind(this, this.selectedSketch);
    }
  }
  
   render() {
    return (
        <section>

          <div className="book">

            <h5> Saved Graphs </h5>

            <div className="savedbox">

          {this.state.x.map((sketch) => (
              <div key={sketch.name} onClick={this.props.loadSketch.bind(this, sketch)}>
               <SavedSketch sketch={sketch}/>
             </div>
          ))}

            </div>
            <ul className="Graph Buttons">

              <button className='create-graph' onClick={this.props.loadSketch.bind(this, null)}>Create Graph</button>
              <button className='load-graph' >Load Graph</button>
              <button className='delete-graph'>Delete Graph</button>

            </ul>

          </div>

          <div className='userinfo'>

            <h6> Profile Information </h6>

            <ul className="info">

              <li id="UserID">UserID: {this.props.user.uid}</li>
              <li id="Name">Name: {this.props.user.displayName} </li>
              <li id="Email">E-mail: {this.props.user.email}</li>

            </ul>

            <div className="logout">

              <input type="submit" id="logoutbutton" name="" value="Logout" onClick= {this.signOut}></input>

            </div>
          </div>
        </section>
    );
  }
}
