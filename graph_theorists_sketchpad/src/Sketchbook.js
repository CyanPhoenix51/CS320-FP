import React from 'react';
import SavedSketch from "./SavedSketch";
import './styles/sketchbook.css';

export default class Sketchbook extends React.Component {
  constructor(props) {
    super(props);
    //holds the keys of all selected divs containing saved sketches
    this.selectedSketchDoc = null;
    this.selectedSketch = null;
  }

  handleSelect=(key, sketch)=> {
    //are we selecting or deselecting?
    if(this.selectedSketchDoc){
      //deselect selected document
      this.selectedSketchDoc.style.setProperty('--is-selected', null);
    }
    //send signal to this guy
    this.selectedSketchDoc = document.getElementById(key);
    this.selectedSketchDoc.style.setProperty('--is-selected', 'pink');

    //the guy we'd actually be loading/deleting
    this.selectedSketch = sketch;
  }

  attemptLoadSketch=()=> {
    if (this.selectedSketch) {
      this.props.loadSketch.bind(this, this.selectedSketch);
    }
  }

  render() {
    //don't know where these came from, but they gotta go.
    document.cookie = '_ga=;expires=Thu, 18 Dec 2013 12:00:00 UTC';
    document.cookie = '_ga_PTLBR59D27=;expires=Thu, 18 Dec 2013 12:00:00 UTC';
    document.cookie = 'loadSketch=;expires=Thu, 18 Dec 2013 12:00:00 UTC';

    let sketches = decodeURIComponent(document.cookie);
    sketches = sketches.split(';');
    //get rid of not needed parts
    let x = [];
    for (let i = 0; i < sketches.length; i++) {
      let y = sketches[i].split('=');
      x.push(JSON.parse(y[1]));
    }
    return (
        <section>

          <div className="book">

            <h5> Saved Graphs </h5>

            <div className="savedbox">

              {x.map((sketch) => (
                  <div key={sketch.name} id={sketch.name} onClick={this.handleSelect.bind(this, sketch.name, sketch)}>
                    <SavedSketch sketch={sketch}/>
                  </div>
              ))}

            </div>
            <ul className="Graph Buttons">

              <button className='create-graph' onClick={this.props.loadSketch.bind(this, null)}>Create Graph</button>
              <button className='load-graph' onClick={this.attemptLoadSketch.bind(this)}>Load Graph</button>
              <button className='delete-graph' onClick={this.props.switchView.bind(this, '#')}>Delete Graph</button>

            </ul>

          </div>

          <div className='userinfo'>

            <h6> Profile Information </h6>

            <ul className="info">

              <li id="UserID">User:</li>
              <li id="Name">Name:</li>
              <li id="Email">E-mail:</li>

            </ul>

            <div className="logout">

              <input type="submit" id="logoutbutton" name="" value="Logout"></input>

            </div>
          </div>
        </section>
    );
  }
}

