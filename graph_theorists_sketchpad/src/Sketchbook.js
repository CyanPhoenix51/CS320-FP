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