import React from 'react';
import './styles/main.css';
import Vertex from "./Vertex";
import Edge from "./Edge";

//The Pad where the drawing happens
export default class Sketch extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            vertices: [],
            vertexIDCount: 0,
            edges: [],
            edgeIDCount: 0
        }
        this.vertexRadius = 25 / 2;
        this.edgeWidth = 5;
        this.selectionBorderRadius = 10;
        this.canDrawVertex = true;
        this.selectedVertices = [];
    }

    render() {
        return (
            <div id='sketchRoot'>
                <div id='pad' onClick={this.drawVertex}>
                    {this.state.vertices.map((vertex) => (
                        <Vertex key={vertex.id} vertex={vertex} selectElement={this.selectElement}
                                mouseEnterElement={this.mouseEnterElement} mouseLeaveElement={this.mouseLeaveElement}/>
                    ))}
                    {this.state.edges.map((edge)=>(
                        <Edge key={edge.id} edge={edge}/>
                    ))}
                </div>
                <button id='generateEdges' onClick={this.generateEdges}>Generate Edges</button>
            </div>
        );
    }

    selectElement = (isVertex, id) => {
        if (isVertex) {
            this.selectedVertices.push(this.state.vertices.find((vertex) => vertex.id === id));
        }
    }

    //Vertex Handling
    drawVertex = (e) => {
        if(this.canDrawVertex) {
            const vertex = {
                id: this.state.vertexIDCount++,
                x: e.clientX - this.vertexRadius,
                y: e.clientY - this.vertexRadius,
            }

            this.state.vertices.push(vertex);
            this.setState(this.state);
        }
    }


    //Mouse Handling
    mouseEnterElement = (isVertex, id) => {
        this.canDrawVertex = false;
    }

    mouseLeaveElement = (isVertex, id) => {
        this.canDrawVertex = true;
    }

    //Edges
    generateEdges = () => {
        if (this.selectedVertices.length < 2) return;
        let filledEdges = [];
        for (let i = 0; i < this.selectedVertices.length; i++) {
            for (let j = 0; j < this.selectedVertices.length; j++) {
                //don't draw loops
                if (i === j) continue;
                //don't wanna draw the same edge twice
                let ij = i.toString() + j.toString();
                let ji = j.toString() + i.toString();
                if (filledEdges.includes(ij) || filledEdges.includes(ji)) continue;

                this.drawEdge(this.selectedVertices[i], this.selectedVertices[j]);
                filledEdges.push(ij);
            }
        }
        this.selectedVertices = [];

        this.setState(this.state);
    }

    drawEdge = (vertex1, vertex2) => {
        //make the edge
        const edge={
            id: this.state.edgeIDCount++,
            vertex1: vertex1,
            vertex2: vertex2
        }
        this.state.edges.push(edge);

        //position it
        this.positionEdge(edge);
        return edge;
    }

    positionEdge = (edge) => {
        //math time
        let x1 = edge.vertex1.x;
        let x2 = edge.vertex2.x;
        let y1 = edge.vertex1.y;
        let y2 = edge.vertex2.y;

        //first, find the height
        let dx = x1 - x2;
        let dy = y2 - y1;
        let height = Math.sqrt((dx * dx) + (dy * dy));

        //second, find the angle
        let theta = Math.atan2(dx, dy);

        //third, find the position
        let x = ((x1 + x2) / 2);// + this.offsetX;
        let y = ((y1 + y2) / 2);// + this.offsetY;

        edge.height = height;
        edge.y = y - (height / 2) + (this.vertexRadius);
        edge.x = x - (this.edgeWidth / 2) + (this.vertexRadius);
        edge.theta = theta;
    }

}