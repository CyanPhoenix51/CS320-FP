import React from 'react';
import ReactDom from 'react-dom';
import Sketchpad from "./Sketchpad";
import Sketchbook from "./Sketchbook";

const e=React.createElement;

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            currentView: 'sketchPad',
            currentSketch: null
        }
    }

    render() {
        switch (this.state.currentView){
            case "sketchBook":
                return <Sketchbook loadSketch={this.loadSketch}/>
            case 'sketchPad':
                return <Sketchpad saveSketch={this.saveSketch}/>
            default:
                return <h1>Ooga Booga</h1>
        }
    }

    loadSketch=(sketch)=> {
      //change view
      const state = this.state;
      state.currentView = 'sketchPad';
      document.cookie = 'loadSketch=' + JSON.stringify(sketch);
      this.setState(state);
    }

    saveSketch=(sketch)=> {
        //change view
        const state = this.state;
        state.currentView = 'sketchBook';

        //create a cookie for the sketch
        const s=JSON.parse(sketch);
        const name=s.name;
        document.cookie=name+'='+sketch;
        this.setState(state);
    }
}

//const domContainer = document.querySelector('#app_container');
ReactDom.render(e(App), document.getElementById('root'));