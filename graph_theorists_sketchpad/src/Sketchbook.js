import React from 'react';
import SavedSketch from "./SavedSketch";

export default class Sketchbook extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            sketches: []
        }
    }

    render() {
        let sketches=document.cookie.split(';');
        //get rid of not needed parts
        let x=[];
        for(let i=0;i<sketches.length;i++){
            let y=sketches[i].split('=');
            x.push(JSON.parse(y[1]));
        }
        return (
            <div>
                {x.map((sketch) => (
                    <SavedSketch key={sketch.name} sketch={sketch}/>
                ))}
                <button onClick={this.props.loadSketch}>Create Graph</button>
            </div>

        );
    }
}