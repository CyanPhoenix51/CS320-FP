import React from 'react';
import ReactDom from 'react-dom';
import Sketchpad from "./Sketchpad";
import Sketchbook from "./Sketchbook";

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            currentView: 'sketchBook',
            currentSketch: null
        }
    }

    render() {
        switch (this.state.currentView){
            case "sketchBook":
                return <Sketchbook loadSketch={this.loadSketch} saveSketch={this.state.currentSketch}/>
            case 'sketchPad':
                return <Sketchpad loadSketch={this.state.currentSketch} saveSketch={this.saveSketch}/>
            default:
                return <h1>Ooga Booga</h1>
        }
    }

    loadSketch=(sketch)=>{
        const state=this.state;
        state.currentView='sketchPad';
        state.currentSketch=sketch;
        this.setState(state);
    }

    saveSketch=(sketch)=>{
        const state=this.state;
        state.currentView='sketchBook';
        state.currentSketch=sketch;
        this.setState(state);
    }
}

ReactDom.render(<App/>, document.getElementById('root'));