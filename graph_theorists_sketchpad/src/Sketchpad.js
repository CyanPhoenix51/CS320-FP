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
            <section onMouseMove={(e) => this.mouseCTX = e}>
                <Sketch mouseMoveCTX={this.getMouseCTX.bind(this)} saveSketch={this.props.saveSketch}
                        loadSketch={this.props.loadSketch}/>
            </section>
        );
    }

    getMouseCTX() {
        return this.mouseCTX;
    }
}