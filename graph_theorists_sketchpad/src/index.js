import React from 'react';
import ReactDom from 'react-dom';
import Sketchpad from "./Sketchpad";
import About from "./About.js";
import Account from "./Account.js";
import {db} from "./firebase.js";

const e=React.createElement;

class App extends React.Component {
  constructor(props) {
    super(props);
    //views: account, about, sketchPad
    this.state = {
      currentView: 'account',
      user: null,
      sketchToLoad: null
    }
  }

  render() {
    switch (this.state.currentView) {
      case 'account':
        return <Account switchView={this.switchView} loadSketch={this.loadSketch} assignUser={this.assignUser}/>
      case 'sketchPad':
        return <Sketchpad saveSketch={this.saveSketch} switchView={this.switchView} loadSketch={this.state.sketchToLoad}/>
      case "about":
        return <About switchView={this.switchView} loadSketch={this.loadSketch}/>
      default:
        return <h1>Ooga Booga</h1>
    }
  }

  assignUser =(user)=> {
    const state = this.state;
    state.user = user;
    this.setState(state);
  }

  loadSketch = (sketch) => {
    //change view
    console.log("INDEX");
    const state = this.state;
    state.currentView = 'sketchPad';
    state.sketchToLoad = sketch;
    this.setState(state);
  }

  saveSketch = (sketch) => {
    //create a cookie for the sketch
    const s = JSON.parse(sketch);
    if (!s.name)
      return;

    const userRef = db.collection(this.state.user.uid).doc(s.name);
    userRef.set(s);

    //change view
    const state = this.state;
    state.currentView = 'account';

    this.setState(state);
  }

  switchView = (view) => {
    //to access sketchpad, must go through load sketch
    if (view === 'sketchPad')
      return;
    const state = this.state;
    state.currentView = view;
    this.setState(state);
  }
}

//const domContainer = document.querySelector('#app_container');
ReactDom.render(e(App), document.getElementById('root'));
