import React from 'react';
import SavedSketch from "./SavedSketch";

export default class Sketchbook extends React.Component {
  render() {
    //don't know where these came from, but they gotta go.
    document.cookie='_ga=;expires=Thu, 18 Dec 2013 12:00:00 UTC';
    document.cookie='_ga_PTLBR59D27=;expires=Thu, 18 Dec 2013 12:00:00 UTC';

    let sketches = decodeURIComponent(document.cookie);
    sketches = sketches.split(';');
    console.log(sketches);
    //get rid of not needed parts
    let x = [];
    for (let i = 0; i < sketches.length; i++) {
      let y = sketches[i].split('=');
      x.push(JSON.parse(y[1]));
    }
    return (
        <div>
          {x.map((sketch) => (
              <div key={sketch.name} onClick={this.props.loadSketch.bind(this, sketch)}>
                <SavedSketch sketch={sketch}/>
              </div>
          ))}
          <button onClick={this.props.loadSketch.bind(this, null)}>Create Graph</button>
        </div>

    );
  }
}