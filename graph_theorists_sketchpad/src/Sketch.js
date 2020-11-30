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
        this.edgeSpacing = 1.5 * this.edgeWidth;
        this.selectionBorderRadius = 4;
        this.loopRadius = 25;
        this.padWidth = 500;
        this.padHeight = 500;
        this.selectionColor = 'solid pink';
        this.canDrawVertex = true;
        this.isGrabber = false;
        this.mouseMoveInitPos = [0, 0];
        this.selectedVertices = [];
        this.selectedEdges = [];

        //update at 33ms = ~30pfs
        setInterval(this.update, 33);
    }

    render() {
        return (
            <div id='sketchRoot'>
                <div id='pad' onClick={this.drawVertex}>
                    {this.state.vertices.map((vertex) => (
                        <Vertex key={vertex.id} vertex={vertex} selectElement={this.selectElement}
                                mouseEnterElement={this.mouseEnterElement} mouseLeaveElement={this.mouseLeaveElement}/>
                    ))}
                    {this.state.edges.map((edge) => (
                        <Edge key={edge.id} edge={edge} selectElement={this.selectElement}
                              mouseEnterElement={this.mouseEnterElement} mouseLeaveElement={this.mouseLeaveElement}/>
                    ))}
                </div>
                <button id='clearPad' onClick={this.clearPad}>Clear Pad</button>
                <button id='deleteSelection' onClick={this.deleteSelection}>Delete Selection</button>
                <button id='deselectAll' onClick={this.deselectAll}>Deselect All</button>
                <button id='generateEdges' onClick={this.generateEdges}>Generate Edges</button>
                <button id='loopButton' onClick={this.loopVertices}>Loop</button>
                <button id='grabber' onClick={this.toggleGrabber}>Grabber</button>
            </div>
        );
    }

    update = () => {
        if (this.isGrabber) {
            const mouseMoveCTX = this.props.mouseMoveCTX();
            if (!mouseMoveCTX) return;
            //loop through selected vertices, reposition, reset state
            const deltas = [mouseMoveCTX.clientX - this.mouseMoveInitPos[0], mouseMoveCTX.clientY - this.mouseMoveInitPos[1]];
            this.mouseMoveInitPos = [mouseMoveCTX.clientX, mouseMoveCTX.clientY];
            for (let i = 0; i < this.selectedVertices.length; i++) {
                //move the vertex
                const x = this.selectedVertices[i].x + deltas[0];
                const y = this.selectedVertices[i].y + deltas[1];
                //check bounds
                const widthCheck = x > 2 * this.vertexRadius && x < this.padWidth - 2 * this.vertexRadius;
                const heightCheck = y > 2 * this.vertexRadius && y < this.padHeight - 2 * this.vertexRadius;
                if (widthCheck)
                    this.selectedVertices[i].x = x;
                if (heightCheck)
                    this.selectedVertices[i].y = y;
                //reposition its vertices
                for (let j = 0; j < this.selectedVertices[i].edges.length; j++) {
                    this.positionEdge(this.selectedVertices[i].edges[j]);
                }
            }
            this.setState(this.state);
        }
    }

    toggleGrabber = () =>{
        this.isGrabber=!this.isGrabber;
    }

    selectElement = (isVertex, id) => {
        if (isVertex) {
            const vertex = this.state.vertices.find((vertex) => vertex.id === id);
            vertex.isSelected = true;
            this.selectedVertices.push(vertex);
        } else {
            const edge = this.state.edges.find((edge) => edge.id === id);
            edge.isSelected = true;
            this.selectedEdges.push(edge);
        }
        this.setState(this.state);
    }

    deselectAll = () => {
        //deselect vertices
        for (let i = 0; i < this.selectedVertices.length; i++) {
            this.selectedVertices[i].isSelected = false;
        }
        //deselect edges
        for (let i = 0; i < this.selectedEdges.length; i++) {
            this.selectedEdges[i].isSelected = false;
        }
        this.selectedVertices = [];
        this.selectedEdges = [];
        this.setState(this.state);
    }

    clearPad = () => {
        this.state.vertices = [];
        this.state.edges = [];
        this.setState(this.state);
    }

    deleteSelection = () => {
        //add all vertex edges to selectedEdges
        for (let i = 0; i < this.selectedVertices.length; i++) {
            for (let j = 0; j < this.selectedVertices[i].edges.length; j++) {
                if (!this.selectedEdges.find(edge => edge.id === this.selectedVertices[i].edges[j])) {
                    this.selectedEdges.push(this.selectedVertices[i].edges[j]);
                }
            }
        }

        //delete edges
        for (let i = 0; i < this.selectedEdges.length; i++) {
            this.state.edges = this.state.edges.filter(edge => edge.id !== this.selectedEdges[i].id);
        }

        //delete all vertices
        for (let i = 0; i < this.selectedVertices.length; i++) {
            this.state.vertices = this.state.vertices.filter(vertex => vertex.id !== this.selectedVertices[i].id);
        }

        this.selectedVertices = [];
        this.selectedEdges = [];

        this.setState(this.state);
    }

    //Vertex Handling
    drawVertex = (e) => {
        if(this.canDrawVertex) {
            const vertex = {
                id: this.state.vertexIDCount++,
                x: e.clientX - this.vertexRadius,
                y: e.clientY - this.vertexRadius,
                borderRadius: this.selectionBorderRadius,
                selectionColor: this.selectionColor,
                edges: []
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
        for (let i = 0; i < this.selectedVertices.length; i++) {
            for (let j = 0; j < this.selectedVertices.length; j++) {
                //don't draw loops
                //don't wanna draw the same edge twice
                if (i === j || !this.selectedVertices[i].isSelected || !this.selectedVertices[j].isSelected)
                    continue;

                this.drawEdge(this.selectedVertices[i], this.selectedVertices[j]);
            }
            this.selectedVertices[i].isSelected = false;
        }

        this.selectedVertices = [];
        this.selectedEdges = [];

        this.setState(this.state);
    }

    drawEdge = (vertex1, vertex2) => {
        //make the edge
        const edge = {
            id: this.state.edgeIDCount++,
            vertex1: vertex1,
            vertex2: vertex2,
            borderRadius: this.selectionBorderRadius,
            selectionColor: this.selectionColor,
            isLoop: vertex1.id===vertex2.id,
            loopRadius: this.loopRadius,
            offsetX: 0,
            offsetY: 0,
            zIndex: 1,
            parallelEdgeIndex: 0
        }
        vertex1.edges.push(edge);
        //don't add loops twice
        if(!edge.isLoop)
            vertex2.edges.push(edge);
        this.state.edges.push(edge);

        //check for parallel Edges
        const parallelEdges=this.parallelEdgeFinder(vertex1, vertex2);
        if(parallelEdges.length>1) {
            //recalculate parallel Edge positions
            this.calculateEdgeOffsets(parallelEdges, vertex1, vertex2);
            //position all parallel edges
            let z = 9000;
            for (let i = 0; i < parallelEdges.length; i++) {
                //are they loops?
                if (vertex1.id === vertex2.id) {
                    parallelEdges[i].parallelEdgeIndex = i;
                    parallelEdges[i].zIndex = z--;
                }
                this.positionEdge(parallelEdges[i]);
            }

        }
        else{
            //position it
            this.positionEdge(edge);
        }

        return edge;
    }

    positionEdge = (edge) => {
        if(edge.isLoop) {
            let x = edge.vertex1.x + this.vertexRadius - 2 * this.edgeWidth;
            let y = edge.vertex1.y + this.vertexRadius - 2 * this.edgeWidth;
            edge.x = x;
            edge.y = y;
        }
        else {
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
            let x = ((x1 + x2) / 2) + edge.offsetX;
            let y = ((y1 + y2) / 2) + edge.offsetY;

            edge.height = height;
            edge.y = y - (height / 2) + (this.vertexRadius);
            edge.x = x - (this.edgeWidth / 2) + (this.vertexRadius);
            edge.theta = theta;
        }
    }

    loopVertices = () => {
        //loop through selected vertices, adding loops to each
        for (let i = 0; i < this.selectedVertices.length; i++) {
            this.drawEdge(this.selectedVertices[i], this.selectedVertices[i]);
        }
        this.deselectAll();
    }

    parallelEdgeFinder(vertex1, vertex2) {
        //returns a list of parallel edges between 2 vertices
        let parallelEdges = [];
        for (let i = 0; i < vertex1.edges.length; i++) {
            const vertexA = vertex1.edges[i].vertex1;
            const vertexB = vertex1.edges[i].vertex2;
            if ((vertex1.id === vertexA.id && vertex2.id === vertexB.id)
                || (vertex1.id === vertexB.id && vertex2.id === vertexA.id)) {
                parallelEdges.push(vertex1.edges[i]);
            }
        }
        return parallelEdges;
    }

    calculateEdgeOffsets(parallelEdges, vertex1, vertex2) {
        //loop check
        if (vertex1.id === vertex2.id) {
            let loopRadius = this.loopRadius;
            for (let i = 0; i < parallelEdges.length; i++) {
                parallelEdges[i].loopRadius = loopRadius;
                loopRadius += this.edgeSpacing;
            }
        } else {
            let slope = (vertex2.y - vertex1.y) / (vertex2.x - vertex1.x);
            slope = -1 / slope;
            //check parity
            const isOdd = parallelEdges.length % 2 === 1;
            let distance = isOdd ? 0 : this.edgeSpacing / 2;
            for (let i = 0; i < parallelEdges.length; i++) {
                //calculate the offsets
                const x = (distance / Math.sqrt(1 + (slope * slope)));
                const y = slope * x;
                
                //apply the offsets
                parallelEdges[i].offsetX = x;
                parallelEdges[i].offsetY = y;

                //increment the magnitude of distance?
                if ((isOdd && i % 2 === 0) || (!isOdd && i % 2 === 1)) {
                    //increment odd sets on even i's and even sets on odd i's
                    let val = Math.abs(distance) + this.edgeSpacing;
                    distance = distance < 0 ? -val : val;
                }

                distance *= -1;
            }
        }
    }


}