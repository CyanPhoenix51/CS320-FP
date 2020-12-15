import React from 'react';
import Sketchbook from "./Sketchbook";
import Create from "./Create.js";
import Landing from "./Landing.js";
import { auth } from './firebase.js';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    //views: landing, sketchBook, create
    this.state = {
      currentView: 'landing',
      user: null
    }
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    auth.onAuthStateChanged((user) => {
      const state = this.state;
      if (user) {
        state.user = user;
        this.props.assignUser(user);
        this.setState(state);
      } else {
        state.user = null;
        this.props.assignUser(null);
        this.setState(state);
      }
    });

  }

  render() {
    if (this.state.user) {
      return <Sketchbook switchAccountView={this.switchAccountView} loadSketch={this.props.loadSketch} user={this.state.user}/>
    } else {
      switch (this.state.currentView) {
        case 'landing':
          return <Landing switchAccountView={this.switchAccountView} switchView={this.props.switchView}/>
        case 'create':
          return <Create switchAccountView={this.switchAccountView}/>
        case 'account': 
          return <Landing switchAccountView={this.switchAccountView} switchView={this.props.switchView}/>
        default:
          return <h1>OOGA BOOGA</h1>
      }
    }
  }

  switchAccountView=(view)=> {
    const state = this.state;
    state.currentView = view;
    this.setState(state);
  }
}
