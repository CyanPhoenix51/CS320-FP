import React from 'react';
import SavedSketch from "./SavedSketch";
import { auth, db } from './firebase.js';

export default class Sketchbook extends React.Component {
  signOut () { 
    auth.signOut(); 
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
    // console.log(this.props.user);
    let x=[];
    // db.collection('users').where('user','==',this.props.user.uid).get().then(()=>{
    //   console.log(this.props.user.docs);
    // });
    // console.log(x);
    return (
        <div>
          {/*{x.map((sketch) => (*/}
          {/*    <div key={sketch.name} onClick={this.props.loadSketch.bind(this, sketch)}>*/}
          {/*      <SavedSketch sketch={sketch}/>*/}
          {/*    </div>*/}
          {/*))}*/}
          <button onClick={this.props.loadSketch.bind(this, null)}>Create Graph</button>
          <button onClick= {this.signOut}> Sign out </button>
        </div>

    );
  }
}