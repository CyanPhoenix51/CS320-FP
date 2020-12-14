import React from 'react';
import SavedSketch from "./SavedSketch";
import './styles/sketchbook.css';

export default class Sketchbook extends React.Component {
  render() {
    //don't know where these came from, but they gotta go.
    document.cookie='_ga=;expires=Thu, 18 Dec 2013 12:00:00 UTC';
    document.cookie='_ga_PTLBR59D27=;expires=Thu, 18 Dec 2013 12:00:00 UTC';
    document.cookie = 'loadSketch=;expires=Thu, 18 Dec 2013 12:00:00 UTC';

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
      <section>

      <div className="book">
    
            <h5> Saved Graphs </h5>

          <div className="savedbox">

            {x.map((sketch) => (
              <form onSubmit={this.props.handleFormSubmit}>
              <div key={sketch.name} onChange={this.handleOptionChange}>
                <input type="radio" value={sketch.name} /*onClick={this.props.loadSketch.bind(this, sketch)}*/></input>
                <SavedSketch sketch={sketch}/>
              </div>
              </form>
            ))}
            
          </div>
            <ul className="Graph Buttons">

            <button className='create-graph' onClick={this.props.loadSketch.bind(this, null)}>Create Graph</button>
            <button className='load-graph' onClick={this.props.loadSketch.bind(this.SavedSketch, 'create')}>Load Graph</button>
            <button className='delete-graph' onClick={this.props.switchView.bind(this, '#')}>Delete Graph</button>
      
            </ul>

      </div>

      <div className='userinfo'>

      <h6> Profile Information </h6>

      <ul className="info">

        <li id="UserID">User: </li>
        <li id="Name">Name: </li>
        <li id="Email">E-mail: </li>

      </ul>

      <div className="logout">
        
        <input type="submit" id="logoutbutton" name="" value="Logout"></input>

      </div>
      </div>
      </section>
    );
  }
}