// import React from 'react';
// import ReactDom from 'react-dom';
import Sketchpad from './Sketchpad';
import Sketchbook from './Sketchbook';

'use-strict';

const e=React.createElement;
const domContainer = document.querySelector('#app_container');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'sketchPad',
      currentSketch: null
    }
  }

  render() {
    switch (this.state.currentView) {
      case "sketchBook":
         return ReactDOM.render(e(Sketchbook), domContainer);
      case 'sketchPad':
         return ReactDOM.render(e(Sketchpad), domContainer);
      default:
        return React.createElement('h1', 'Ooga Booga');
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
}

ReactDOM.render(e(App), domContainer);
// ReactDom.render(e(App), document.getElementById('root'));