import React from 'react';
import './styles/main.css';
import Sketch from './Sketch';

//The Sketchpad Page
export default class Sketchpad extends React.Component {
    constructor(props) {
        super(props);
        this.mouseCTX = null;
    }

    render() {
        return (
            <div onMouseMove={(e) => this.mouseCTX = e}>
                <Sketch mouseMoveCTX={this.getMouseCTX.bind(this)}/>
            </div>
        );
    }

    getMouseCTX() {
        return this.mouseCTX;
    }
}