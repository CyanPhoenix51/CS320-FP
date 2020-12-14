import React from 'react';
import SavedSketch from "./SavedSketch";
import { auth, db } from './firebase.js';

export default class Sketchbook extends React.Component {
  constructor(props){ 
    super(props);
    this.state={
      x: []
    }
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
  render() {
    //don't know where these came from, but they gotta go.
    // document.cookie='_ga=;expires=Thu, 18 Dec 2013 12:00:00 UTC';
    // document.cookie='_ga_PTLBR59D27=;expires=Thu, 18 Dec 2013 12:00:00 UTC';
    // let sketches = decodeURIComponent(document.cookie);
    // sketches = sketches.split(';');
    // //get rid of not needed parts
    // let x = [];
    // if(sketches[0]) {
    //   for (let i = 0; i < sketches.length; i++) {
    //     let y = sketches[i].split('=');
    //     x.push(JSON.parse(y[1]));
    //   }
    // }
    console.log(this.state.x);
    return (
        <div>
          {this.state.x.map((sketch) => (
              <div key={sketch.name} onClick={this.props.loadSketch.bind(this, sketch)}>
               <SavedSketch sketch={sketch}/>
             </div>
          ))}
          <button onClick={this.props.loadSketch.bind(this, null)}>Create Graph</button>
          <button onClick= {this.signOut}> Sign out </button>
        </div>

    );
  }
}