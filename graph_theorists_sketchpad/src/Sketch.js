import React from 'react';
import './styles/main.css';
import Vertex from "./Vertex";

//The Pad where the drawing happens
export default class Sketch extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            vertices: [
                {
                    id: 0,
                    x: 250,
                    y: 250
                }
            ]
        }
    }

    render(){
        return(
          <div id='pad'>
              {this.state.vertices.map((vertex) => (
                  <Vertex key={vertex.id} x={vertex.x} y={vertex.y}/>
              ))}
          </div>
        );
    }
}