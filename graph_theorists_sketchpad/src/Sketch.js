import React from 'react';
import './styles/main.css';
import Vertex from "./Vertex";
import Edge from "./Edge";

//The Pad where the drawing happens
export default class Sketch extends React.Component{
    constructor(props) {
      super(props);

      this.vertexRadius = 25 / 2;
      this.edgeWidth = 5;
      this.edgeSpacing = 2.25 * this.edgeWidth;
      this.selectionBorderRadius = 4;
      this.arrowSize = 10;
      this.loopRadius = 25;
      this.padWidth = 750;
      this.padHeight = 500;
      this.windowCenter = [window.innerWidth / 2, window.innerHeight / 2];
      this.padOrigin = [this.windowCenter[0] - this.padWidth / 2, this.windowCenter[1] - this.padHeight / 2];

      this.selectionColor = 'solid pink';
      this.bridgeColor = 'solid red';
      this.canDrawVertex = true;
      this.isGrabber = false;
      this.displayingCounts = false;
      this.isBp = 'false';
      this.mouseMoveInitPos = [0, 0];

      this.vertices = [];
      this.edges = [];
      this.selectedVertices = [];
      this.selectedEdges = [];
      this.bridges = [];

      const loadSketch = JSON.parse(this.findLoadSketchCookie());
      //expire the cookie
      document.cookie = 'loadSketch=;expires=Thu, 18 Dec 2013 12:00:00 UTC';
      if (loadSketch) {
        //gonna need to recreate some stuff
        this.state = loadSketch;
        this.loadSketch(loadSketch);
      } else {
        this.state = {
          vertices: [],
          vertexIDCount: 0,
          edges: [],
          edgeIDCount: 0,
          name: ''
        }
      }

      document.addEventListener('keypress', e => this.pressKey(e))
      //update at 33ms = ~30pfs
      setInterval(this.update, 33);
    }

    render() {
      this.windowCenter=[window.innerWidth/2, window.innerHeight/2];
      this.padOrigin=[this.windowCenter[0]-this.padWidth/2, this.windowCenter[1]-this.padHeight/2];
        return (
            <div id='sketchRoot'>
                <input type='text' placeholder={this.state.name} name='sketchName' onChange={this.renameSketch}/>
                <button id='saveSketch' onClick={this.props.saveSketch.bind(this, JSON.stringify(this.state))}>Save
                    Sketch
                </button>
                <div id='pad' onClick={this.drawVertex}>
                    <div id='padData' style={{visibility: this.displayingCounts ? 'visible' : 'hidden'}}>
                        {this.determineBipartite()}
                        v = {this.vertices.length}<br/>
                        e = {this.edges.length} <br/>
                        BP = {this.isBp.toString()} <br/>
                    </div>
                    {this.vertices.map((vertex) => (
                        <Vertex key={vertex.id} vertex={vertex} selectElement={this.selectElement}
                                mouseEnterElement={this.mouseEnterElement} mouseLeaveElement={this.mouseLeaveElement}/>
                    ))}
                    {this.edges.map((edge) => (
                        <Edge key={edge.id} edge={edge} selectElement={this.selectElement}
                              mouseEnterElement={this.mouseEnterElement} mouseLeaveElement={this.mouseLeaveElement}/>
                    ))}
                </div>
                <div id='sketchCommands'>
                    <button id='clearPad' onClick={this.clearPad}>Clear Pad</button>
                    <button id='deleteSelection' onClick={this.deleteSelection}>Delete Selection</button>
                    <button id='deselectAll' onClick={this.deselectAll}>Deselect All</button>
                    <button id='generateEdges' onClick={this.generateEdges}>Generate Edges</button>
                    <button id='loopButton' onClick={this.loopVertices}>Loop</button>
                    <button id='grabber' onClick={this.toggleGrabber}>Grabber</button>
                    <button id='idDegree' onClick={this.toggleDisplayVertexData}>ID's</button>
                    <button id='veCounts' onClick={this.toggleCountsDisplay}>Counts</button>
                    <button id='resetIDs' onClick={this.resetIDs}>Reset ID's</button>
                    <button id='idBridges' onClick={this.identifyBridges}>Bridges</button>
                    <button id='generateArc' onClick={this.generateArc}>Arc</button>
                </div>
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
          if (widthCheck) {
            this.selectedVertices[i].x = x;
            this.state.vertices.find((vertex) => vertex.id === this.selectedVertices[i].id).x = x;
          }
          if (heightCheck) {
            this.selectedVertices[i].y = y;
            this.state.vertices.find((vertex) => vertex.id === this.selectedVertices[i].id).y = y;
          }
          //reposition its edges
          this.positionVertexEdges(this.selectedVertices[i]);
        }
        this.setState(this.state);
      }
    }

    renameSketch=(e)=>{
        const state=this.state;
        state.name=e.target.value;
        this.setState(state);
    }

    toggleGrabber = () => {
      this.isGrabber = !this.isGrabber;
      this.mouseMoveInitPos = [this.props.mouseMoveCTX.clientX, this.props.mouseMoveCTX.clientY];
    }

    resetIDs=()=> {
        const state = this.state;
        state.vertexIDCount = 0;
        state.edgeIDCount = 0;
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].id = state.vertexIDCount++;
            state.vertices[i].id = this.vertices[i].id;
        }
        for (let i = 0; i < this.edges.length; i++) {
            this.edges[i].id = state.edgeIDCount++;
            state.edges[i].id = this.edges[i].id;
        }
        this.setState(state);
    }

    pressKey(e){
      switch (e.code) {
        case 'KeyE':
          //generate edges
          this.generateEdges();
          break;
        case 'KeyG':
          //grabber
          this.toggleGrabber();
          break;
        case 'KeyD':
          //delete selection
          this.deleteSelection();
          break;
        case 'KeyC':
          //toggle pad counts
          this.toggleCountsDisplay();
          break;
        case 'KeyI':
          //toggle vertex data
          this.toggleDisplayVertexData();
          break;
        case 'KeyS':
          //deselect
          this.deselectAll();
          break;
        case 'KeyL':
          //loops
          this.loopVertices();
          break;
        case 'KeyR':
          //reset ID's
          this.resetIDs();
          break;
        case 'KeyB':
          //show bridges
          this.identifyBridges();
          break;
        case 'KeyA':
          //arc
          this.generateArc();
          break;
          //colorings
        case 'Digit1':
          this.colorVertices('black');
          break;
        case 'Digit2':
          this.colorVertices('white');
          break;
        case 'Digit3':
          this.colorVertices('red');
          break;
        case 'Digit4':
          this.colorVertices('orange');
          break;
        case 'Digit5':
          this.colorVertices('yellow');
          break;
        case 'Digit6':
          this.colorVertices('green');
          break;
        case 'Digit7':
          this.colorVertices('blue');
          break;
        case 'Digit8':
          this.colorVertices('purple');
          break;
        case 'Digit9':
          this.colorVertices('brown');
          break;
        case 'Digit0':
          this.colorVertices('cyan');
          break;
      }
    }

    findLoadSketchCookie(){
      let sketches=decodeURIComponent(document.cookie);
      sketches=sketches.split(';');
      for(let i=0;i<sketches.length;i++){
        const parts=sketches[i].split('=');
        if(parts[0]===' loadSketch'){
          return parts[1];
        }
      }
      return 'null';
    }

    loadSketch(sketch){
      //build all the vertices first
      for(let i=0;i<sketch.vertices.length;i++){
        this.drawLoadVertex(sketch.vertices[i]);
      }
      //build all the edges
      for(let i=0;i<sketch.edges.length;i++){
        this.drawLoadEdge(sketch.edges[i]);
      }
    }

    //Selection and Deletion
    selectElement = (isVertex, id) => {
        if (isVertex) {
          //has it already been selected?
          if(this.selectedVertices.find((v)=>v.id===id)){
            return;
          }
            const vertex = this.vertices.find((vertex) => vertex.id === id);
            vertex.isSelected = true;
            this.selectedVertices.push(vertex);
        } else {
          if(this.selectedEdges.find((e)=>e.id===id))
              return;
            const edge = this.edges.find((edge) => edge.id === id);
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
      if (this.isGrabber)
        this.isGrabber = false;
      this.setState(this.state);
    }

    clearPad = () => {
      //if the grabber is on, turn it off
      if (this.isGrabber) this.toggleGrabber();
      const s = this.state;
      s.vertices = [];
      s.edges = [];
      this.vertices = [];
      this.edges = [];
      this.setState(s);
    }

    deleteSelection = () => {
      const state = this.state;
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
        state.edges = state.edges.filter(edge => edge.id !== this.selectedEdges[i].id);
        //remove from connected vertices
        const vertex1 = this.selectedEdges[i].vertex1;
        const vertex2 = this.selectedEdges[i].vertex2;

        vertex1.edges = vertex1.edges.filter((edge) => edge.id !== this.selectedEdges[i].id);
        if (!this.selectedEdges[i].isLoop) {
          vertex2.edges = vertex2.edges.filter((edge) => edge.id !== this.selectedEdges[i].id);
        }

        //remove from all edges
        this.edges = this.edges.filter(edge => edge.id !== this.selectedEdges[i].id);
      }

      //delete all vertices
      for (let i = 0; i < this.selectedVertices.length; i++) {
        state.vertices = state.vertices.filter(vertex => vertex.id !== this.selectedVertices[i].id);
        this.vertices = this.vertices.filter(vertex => vertex.id !== this.selectedVertices[i].id);
      }

      //recalculate edges
      for (let i = 0; i < this.vertices.length; i++) {
        this.positionVertexEdges(this.vertices[i]);
      }

      this.selectedVertices = [];
      this.selectedEdges = [];

      this.setState(state);
    }

    //Vertex Handling
    drawVertex = (e) => {
      if (this.canDrawVertex) {
        const state = this.state;
        const vertex = {
          id: state.vertexIDCount++,
          x: e.clientX - this.vertexRadius - this.padOrigin[0],
          y: e.clientY - this.vertexRadius - this.padOrigin[1],
          borderRadius: this.selectionBorderRadius,
          selectionColor: this.selectionColor,
          displayVertexData: this.displayingVertexData,
          edges: [],
          color: 'blue',
          isHovering: false
        }
        const stateVertex = {
          id: vertex.id,
          x: vertex.x,
          y: vertex.y,
          edges: [],
          color: 'blue'
        }

        this.vertices.push(vertex);
        this.state.vertices.push(stateVertex);
        this.setState(state);
      }
    }

    drawLoadVertex(stateVertex){
      const vertex={
        id: stateVertex.id,
        x: stateVertex.x,
        y: stateVertex.y,
        borderRadius: this.selectionBorderRadius,
        selectionColor: this.selectionColor,
        displayVertexData: this.displayingVertexData,
        edges: [],
        color: stateVertex.color,
        isHovering: false
      }
      this.vertices.push(vertex);
    }

    toggleDisplayVertexData=()=> {
        this.displayingVertexData = !this.displayingVertexData;
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].displayVertexData = this.displayingVertexData;
        }
        this.setState(this.state);
    }

    toggleCountsDisplay=()=> {
        this.displayingCounts = !this.displayingCounts;
        this.setState(this.state);
    }

    colorVertices(color) {
      const state = this.state;
      for (let i = 0; i < this.selectedVertices.length; i++) {
        this.selectedVertices[i].color = color;
        const vertex = state.vertices.find((v) => v.id === this.selectedVertices[i].id);
        vertex.color = color;
      }
      this.setState(state);
    }

    //Mouse Handling
    mouseEnterElement = (isVertex, id) => {
      this.canDrawVertex = false;
      if (isVertex) {
        //find the vertex tell it that it's hovering
        const vertex = this.vertices.find((v) => v.id === id);
        vertex.isHovering = true;
      } else {
        //same but for edge
        const edge = this.edges.find((e) => e.id === id);
        edge.isHovering = true;
      }
      this.setState(this.state);
    }

    mouseLeaveElement = (isVertex, id) => {
      this.canDrawVertex = true;
      if (isVertex) {
        //find the vertex tell it that it's hovering
        const vertex = this.vertices.find((v) => v.id === id);
        vertex.isHovering = false;
      } else {
        //same but for edge
        const edge = this.edges.find((e) => e.id === id);
        edge.isHovering = false;
      }
      this.setState(this.state);
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

    generateArc=()=> {
      const state = this.state;
      //arcs can only be loops and edges
      if (this.selectedVertices.length !== 1 && this.selectedVertices.length !== 2)
        return;
      let edge;
      //loop or edge?
      if (this.selectedVertices.length === 1) {
        edge = this.drawEdge(this.selectedVertices[0], this.selectedVertices[0]);
      } else {
        edge = this.drawEdge(this.selectedVertices[0], this.selectedVertices[1]);
        edge.targetVertex = this.selectedVertices[1];
      }
      edge.arrowSize = this.arrowSize;
      edge.isArc = true;
      //make the stateEdge an arc too
      const e = state.edges.find((ed) => ed.id === edge.id);
      e.isArc = true;

      this.positionEdge(edge);
      this.setState(state);
      this.deselectAll();
    }

    drawEdge = (vertex1, vertex2) => {
      const state = this.state;
      //make the edge
      const edge = {
        id: state.edgeIDCount++,
        vertex1: vertex1,
        vertex2: vertex2,
        borderRadius: this.selectionBorderRadius,
        selectionColor: this.selectionColor,
        isLoop: vertex1.id === vertex2.id,
        loopRadius: this.loopRadius,
        offsetX: 0,
        offsetY: 0,
        zIndex: 1,
        bridgeColor: this.bridgeColor,
        edgeWidth: this.edgeWidth,
        isArc: false,
        isHovering: false
      }
      const stateEdge = {
        id: edge.id,
        vertex1: edge.vertex1.id,
        vertex2: edge.vertex2.id
      }
      vertex1.edges.push(edge);
      //don't add loops twice
      if (!edge.isLoop)
        vertex2.edges.push(edge);
      this.edges.push(edge);
      state.edges.push(stateEdge);

      //check for parallel Edges
      const parallelEdges = this.parallelEdgeFinder(vertex1, vertex2);
      if (parallelEdges.length > 1) {
        //recalculate parallel Edge positions
        this.calculateEdgeOffsets(parallelEdges, vertex1, vertex2);
        //position all parallel edges
        let z = 9000;
        for (let i = 0; i < parallelEdges.length; i++) {
          //are they loops?
          if (vertex1.id === vertex2.id) {
            parallelEdges[i].zIndex = z--;
          }
          this.positionEdge(parallelEdges[i]);
        }

      } else {
        //position it
        this.positionEdge(edge);
      }

      this.setState(state);
      return edge;
    }

    drawLoadEdge(stateEdge){
      const v1=this.vertices.find((v)=>v.id===stateEdge.vertex1);
      const v2=this.vertices.find((v)=>v.id===stateEdge.vertex2);
      const edge = {
        id: stateEdge.id,
        vertex1: v1,
        vertex2: v2,
        borderRadius: this.selectionBorderRadius,
        selectionColor: this.selectionColor,
        isLoop: v1.id===v2.id,
        loopRadius: this.loopRadius,
        offsetX: 0,
        offsetY: 0,
        zIndex: 1,
        bridgeColor: this.bridgeColor,
        edgeWidth: this.edgeWidth,
        isArc: stateEdge.isArc,
        isHovering: false
      }
      v1.edges.push(edge);
      if(!edge.isLoop) {
        v2.edges.push(edge);
      }
      this.edges.push(edge);

      //check for parallel Edges
      const parallelEdges = this.parallelEdgeFinder(v1, v2);
      if (parallelEdges.length > 1) {
        //recalculate parallel Edge positions
        this.calculateEdgeOffsets(parallelEdges, v1, v2);
        //position all parallel edges
        let z = 9000;
        for (let i = 0; i < parallelEdges.length; i++) {
          //are they loops?
          if (v1.id === v2.id) {
            parallelEdges[i].zIndex = z--;
          }
          this.positionEdge(parallelEdges[i]);
        }

      } else {
        //position it
        this.positionEdge(edge);
      }
    }

    positionEdge = (edge) => {
        if(edge.isLoop) {
            let x = edge.vertex1.x + this.vertexRadius - 2 * this.edgeWidth;
            let y = edge.vertex1.y + this.vertexRadius - 2 * this.edgeWidth;
            if (edge.isSelected) {
                x += 2*this.selectionBorderRadius;
                y += 2*this.selectionBorderRadius;
            }
            edge.x = x;
            edge.y = y;
        }
        else {
            if(edge.isArc && edge.vertex1.id!==edge.targetVertex.id){
                //switcharoo
                const temp = edge.vertex2;
                edge.vertex2 = edge.vertex1;
                edge.vertex1 = temp;
            }
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

    positionVertexEdges(vertex){
        //repositions a moved vertices edges
        //find parallel edge clusters
        let visitedEdges=[];
        for(let i=0;i<vertex.edges.length;i++) {
            if (visitedEdges.find(edge => edge.id === vertex.edges[i].id))
                continue;
            const vertex1 = vertex.edges[i].vertex1;
            const vertex2 = vertex.edges[i].vertex2;
            const parallelEdges = this.parallelEdgeFinder(vertex1, vertex2);
            this.calculateEdgeOffsets(parallelEdges, vertex1, vertex2);
            for (let j = 0; j < parallelEdges.length; j++) {
                visitedEdges.push(parallelEdges[j]);
                this.positionEdge(parallelEdges[j]);
            }
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

    //Advanced Features
    identifyBridges=()=> {
        //loop through edges, remove it. Can I still get from one vertex to the other? add the edge back
        //Currently won't work for digraphs
        this.idBridges = !this.idBridges;
        if (!this.idBridges) {
            //turn off bridge id
            for (let i = 0; i < this.bridges.length; i++) {
                this.bridges[i].isBridge = false;
            }
            this.bridges = [];
        } else {
            //highlight bridges in some color
            //loop through all edges, remove them one at a time. Does the graph become disconnected? If so, it's a bridge
            //check for disconnect via dfs
            for (let i = 0; i < this.edges.length; i++) {
                //remove the edge from its vertices
                //loops can't be bridges
                if (this.edges[i].isLoop)
                    continue;
                const vertex1 = this.edges[i].vertex1;
                const vertex2 = this.edges[i].vertex2;
                vertex1.edges = vertex1.edges.filter((edge) => edge.id !== this.edges[i].id);
                vertex2.edges = vertex2.edges.filter((edge) => edge.id !== this.edges[i].id);

                //did the removal of this edge disconnect the two vertices?
                const path = this.dfs(vertex1, vertex2);
                if (path.length === 0) {
                    this.edges[i].isBridge = true;
                    this.bridges.push(this.edges[i]);
                }
                //add the edge back in
                vertex1.edges.push(this.edges[i]);
                vertex2.edges.push(this.edges[i]);
            }
        }
        this.setState(this.state);
    }

    dfs(start, finish) {
        //returns the shortest list of vertices connecting start to finish
        let paths = [];
        this.dfsHelper(start, [], paths, finish);

        //return the shortest path in paths
        if (paths.length === 0) return paths;
        let shortestPath = paths[0];
        for (let i = 0; i < paths.length; i++) {
            if (paths[i].length < shortestPath.length) {
                shortestPath = paths[i];
            }
        }
        return shortestPath;
    }

    dfsHelper(currentVertex, path, paths, finish){
        path.push(currentVertex);
        if(currentVertex.id===finish.id){
            paths.push(path);
            return;
        }
        for(let i=0;i<currentVertex.edges.length;i++){
            if(!path.find(v=>v.id===currentVertex.edges[i].vertex1.id)){
                //continue search on vertex1
                this.dfsHelper(currentVertex.edges[i].vertex1, path, paths, finish);
            }
            else if(!path.find(v=>v.id===currentVertex.edges[i].vertex2.id)){
                //continue search on vertex2
                this.dfsHelper(currentVertex.edges[i].vertex2, path, paths, finish);
            }
            //else do nothing for this edge
        }
    }

    determineBipartite = () => {
        if (this.vertices.length === 0) {
            this.isBp = false;
            return;
        }
        //try to 2 color the sketch
        let visitedVertices = [];
        this.isBp = true;
        while (visitedVertices.length !== this.vertices.length) {
            this.bpHelper(this.vertices[0], 1, visitedVertices);
            if (this.isBp) {
                const unseenVertex = this.findUnseenVertex(visitedVertices);
                this.bpHelper(unseenVertex, 1, visitedVertices);
            } else break;
        }
    }

    bpHelper(currentVertex, mColor, visitedVertices) {
        if(!currentVertex) return;
        //if it's already determined not bp, then return
        if (this.isBp === false) {
            return;
        }
        //if I've visited this vertex before, I must be trying to color it the same else bad
        if (visitedVertices.length>0 && visitedVertices.find((vertex) => vertex.id === currentVertex.id)) {
            if (currentVertex.mColor !== mColor) {
                this.isBp = false;
            }
            return;
        }

        //color this vertex
        currentVertex.mColor = mColor;
        visitedVertices.push(currentVertex);
        if (mColor === 1) mColor = 2;
        else mColor = 1;

        //recurse for all children
        for (let i = 0; i < currentVertex.edges.length; i++) {
            if(currentVertex.edges[i].isLoop)
                continue;
            const adj = this.determineAdjacentVertex(currentVertex, currentVertex.edges[i].vertex1, currentVertex.edges[i].vertex2);
            this.bpHelper(adj, mColor, visitedVertices);
        }
    }

    determineAdjacentVertex(currentVertex, vertex1, vertex2){
        if(currentVertex.id===vertex1.id)
            return vertex2;
        else
            return vertex1;
    }

    findUnseenVertex(visitedVertices) {
        let unseenVertices = this.vertices.filter((vertex) => !visitedVertices.find((v) => v.id === vertex.id));
        if (unseenVertices.length === 0) return null;
        return unseenVertices[0];
    }
}