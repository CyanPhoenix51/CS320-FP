import React from 'react';
import './styles/main.css';
import Sketch from './Sketch';

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