import React from 'react';
import ReactDom from 'react-dom';
import Sketchpad from "./Sketchpad";
import Sketchbook from "./Sketchbook";

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
                return <Sketchbook loadSketch={this.loadSketch} saveSketch={this.saveSketch}/>
            case 'sketchPad':
                return <Sketchpad loadSketch={this.loadSketch} saveSketch={this.saveSketch}/>
            default:
                return <h1>Ooga Booga</h1>
        }
    }

    loadSketch=(sketch)=>{
        //change view
        const state=this.state;
        state.currentView='sketchPad';
        document.cookie='loadSketch='+JSON.stringify(sketch)
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

ReactDom.render(<App/>, document.getElementById('root'));