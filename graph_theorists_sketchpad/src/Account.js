import React from 'react';
import Sketchbook from "./Sketchbook";
import Create from "./Create.js";
import Landing from "./Landing.js";

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    //views: landing, sketchBook, create
    this.state = {
      currentView: 'landing'
    }
  }

  render() {
    switch (this.state.currentView){
      case 'landing':
        return <Landing switchAccountView={this.switchAccountView}/>;
      case 'sketchBook':
        return <Sketchbook switchAccountView={this.switchAccountView} loadSketch={this.props.loadSketch}/>;
      case 'create':
        return <Create switchAccountView={this.switchAccountView}/>
      default:
        return <h1>OOGA BOOGA</h1>
    }
  }

  switchAccountView = (view) =>{
    const state=this.state;
    state.currentView=view;
    this.setState(state);
  }


}
