import React from 'react';
import './styles/main.css';
import Vertex from "./Vertex";

//The Pad where the drawing happens
export default class Sketch extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            vertices: [],
            vertexIDCount: 0
        }
    }

    render(){
        return(
          <div id='pad' onClick={this.drawVertex.bind(this)}>
              {this.state.vertices.map((vertex) => (
                  <Vertex key={vertex.id} x={vertex.x} y={vertex.y}/>
              ))}
          </div>
        );
    }

    drawVertex(e) {
        const vertex = {
            id: this.state.vertexIDCount++,
            x: e.clientX,
            y: e.clientY
        }

        this.state.vertices.push(vertex);
        this.setState(this.state);
    }
}