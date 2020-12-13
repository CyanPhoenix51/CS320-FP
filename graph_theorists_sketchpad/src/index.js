import React from 'react';
import ReactDom from 'react-dom';
import Sketchpad from "./Sketchpad";
import Sketchbook from "./Sketchbook";
import Create from "./Create.js";
import Landing from "./Landing.js";
import About from "./About.js";

const e=React.createElement;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'landing',
      currentSketch: null
    }
  }

  render() {
    switch (this.state.currentView) {
      case "sketchBook":
        return <Sketchbook loadSketch={this.loadSketch} switchView={this.switchView}/>
      case 'sketchPad':
        return <Sketchpad saveSketch={this.saveSketch} switchView={this.switchView}/>
      case "create":
        return <Create />
      case "landing":
        return <Landing switchView={this.switchView} loadSketch={this.loadSketch}/>
      case "about":
        return <About switchView={this.switchView}/>
      default:
        return <h1>Ooga Booga</h1>
    }
  }

  loadSketch = (sketch) => {
    //change view
    const state = this.state;
    state.currentView = 'sketchPad';
    document.cookie = 'loadSketch=' + JSON.stringify(sketch);
    this.setState(state);
  }

  saveSketch = (sketch) => {
    //create a cookie for the sketch
    const s = JSON.parse(sketch);
    if (!s.name)
      return;
    const name = s.name;
    document.cookie = name + '=' + sketch;

    //change view
    const state = this.state;
    state.currentView = 'sketchBook';

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