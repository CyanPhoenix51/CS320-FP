import React from 'react';
import './styles/main.css';
import Sketch from './Sketch';
import Sketchbook from './Sketchbook';

//The Sketchpad Page
export default class Sketchpad extends React.Component{
    render(){
        return(
          <div>
              <Sketch />
          </div>
        );
    }
}