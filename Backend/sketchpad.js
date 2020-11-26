const pad = document.getElementById('pad');

class Vertex {
    constructor(x, y, id) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.edges = [];

        //create the vertex object
        this.vertex = document.createElement('div');
        pad.appendChild(this.vertex);
        this.vertex.id = 'vertex';
        //position myself
        this.vertex.style.top = this.y + 'px';
        this.vertex.style.left = this.x + 'px';

        //Create the display objects
        this.degreeDisplay = document.createElement('div');
        this.degreeDisplay.id = 'degreeDisplay';
        this.degreeDisplay.style.visibility = 'hidden';
        this.degreeDisplay.innerHTML = '0';
        this.vertex.appendChild(this.degreeDisplay);

        this.idDisplay = document.createElement('div');
        this.idDisplay.id = 'idDisplay';
        this.idDisplay.style.visibility = 'hidden';
        this.idDisplay.innerHTML = id.toString();
        this.vertex.appendChild(this.idDisplay);

        //Add Event Listeners
        const v = this;
        this.vertex.addEventListener('mousedown', function () {
            //select the component
            sketchPad.selectElement(sketchPad.selectedVertices, v);
        });
        this.vertex.addEventListener('mouseenter', function () {
            //mouse over object
            sketchPad.mouseOverObj = v;
        });
        this.vertex.addEventListener('mouseleave', function () {
            //mouse exit object
            sketchPad.mouseOverObj = null;
        });
    }

    moveVertex(x, y) {
        //Am I within the bounds of the pad?
        //width check
        if (x > 2 * sketchPad.selectBorderRadius && x < sketchPad.padWidth - sketchPad.vertexDiameter / 2 - 2 * sketchPad.selectBorderRadius) {
            this.x = x;
        }
        //length check
        if (y > 2 * sketchPad.selectBorderRadius && y < sketchPad.padLength - sketchPad.vertexDiameter / 2 - 2 * sketchPad.selectBorderRadius) {
            this.y = y;
        }

        //put myself at new position
        this.vertex.style.top = this.y + 'px';
        this.vertex.style.left = this.x + 'px';

        //recalculate my edges
        for (let i = 0; i < this.edges.length; i++) {
            this.edges[i].positionEdge();
        }
    }

    select() {
        this.vertex.style.border = sketchPad.selectBorderRadius + 'px ' + sketchPad.selectionColor;
        this.y -= sketchPad.selectBorderRadius;
        this.x -= sketchPad.selectBorderRadius;
        this.vertex.style.top = this.y + 'px';
        this.vertex.style.left = this.x + 'px';
    }

    deselect(){
        this.vertex.style.border = null;
        this.y += sketchPad.selectBorderRadius;
        this.x += sketchPad.selectBorderRadius;
        this.vertex.style.top = this.y + 'px';
        this.vertex.style.left = this.x + 'px';
    }

    displayDegreeID(isOn) {
        if (isOn) {
            this.idDisplay.style.visibility = 'visible';
            this.degreeDisplay.style.visibility = 'visible';
        } else {
            this.idDisplay.style.visibility = 'hidden';
            this.degreeDisplay.style.visibility = 'hidden';
        }
    }

    addEdge(edge) {
        this.edges.push(edge);
        this.degreeDisplay.innerHTML = this.edges.length.toString();
    }

    removeEdge(edge) {
        this.edges = this.edges.filter(e => e.id !== edge.id);
        this.degreeDisplay.innerHTML = this.edges.length.toString();
    }
}

class Edge {
    constructor(vertex1, vertex2, id) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.id = id;
        this.isSelected = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isArc = false;
        this.targetVertex = null;

        //create the edge
        this.edge = document.createElement('div');
        pad.appendChild(this.edge);

        //is it a loop?
        this.isLoop = vertex1.id === vertex2.id;
        if (this.isLoop) {
            //if loop, only add myself once to the vertex
            vertex1.addEdge(this);
            this.edge.style.height = sketchPad.loopDiameter + 'px';
            this.edge.style.width = sketchPad.loopDiameter + 'px';
            this.edge.id = 'loop';
        } else {
            vertex1.addEdge(this);
            vertex2.addEdge(this);
            this.edge.id = 'edge';
        }
        this.positionEdge();

        //Add Event Listeners
        const e = this;
        this.edge.addEventListener('mousedown', function () {
            //select the component
            sketchPad.selectElement(sketchPad.selectedEdges, e);
        });
        this.edge.addEventListener('mouseenter', function () {
            //mouse over object
            sketchPad.mouseOverObj = e;
        });
        this.edge.addEventListener('mouseleave', function () {
            //mouse exit object
            sketchPad.mouseOverObj = null;
        });
    }

    positionEdge() {
        if (this.isLoop) {
            //slap it on the vertex
            let x = this.vertex1.x - parseFloat(this.edge.style.width) + sketchPad.vertexDiameter / 2;
            let y = this.vertex1.y - parseFloat(this.edge.style.height) + sketchPad.vertexDiameter / 2;
            if (this.isSelected) {
                x -= sketchPad.selectBorderRadius;
                y -= sketchPad.selectBorderRadius;
            }
            this.edge.style.top = y + 'px';
            this.edge.style.left = x + 'px';
            if (this.isArc) {
                //position the arrow
                this.arrow.id = 'arrow_left';
                this.arrow.style.left = parseFloat(this.edge.style.width) / 2 - sketchPad.arrowSize / 2 + 'px';
                this.arrow.style.top = -(sketchPad.arrowSize + sketchPad.edgeWidth / 2) + 'px';
            }
        } else {
            //is it an arc?
            if (this.isArc && this.vertex1.id !== this.targetVertex.id) {
                //switcharoo
                const temp = this.vertex2;
                this.vertex2 = this.vertex1;
                this.vertex1 = temp;
            }
            //math time
            let x1 = parseFloat(this.vertex1.vertex.style.left);
            let x2 = parseFloat(this.vertex2.vertex.style.left);
            let y1 = parseFloat(this.vertex1.vertex.style.top);
            let y2 = parseFloat(this.vertex2.vertex.style.top);

            //first, find the height
            let dx = x1 - x2;
            let dy = y2 - y1;
            let height = Math.sqrt((dx * dx) + (dy * dy));

            //second, find the angle
            let theta = Math.atan2(dx, dy);

            //third, find the position
            //console.log(this.offsetX, this.offsetY);
            let x = ((x1 + x2) / 2) + this.offsetX;
            let y = ((y1 + y2) / 2) + this.offsetY;
            if (this.isSelected) {
                x -= sketchPad.selectBorderRadius;
                y -= sketchPad.selectBorderRadius;
            }

            //apply the calculations
            if (this.isArc) {
                this.arrow.id = 'arrow_up';
                this.arrow.style.top = height / 2 - sketchPad.arrowSize / 2 + 'px';
                this.arrow.style.left = -(sketchPad.arrowSize / 2 + sketchPad.edgeWidth / 2) + 'px';
            }
            this.edge.style.height = height + 'px';
            this.edge.style.top = y - (height / 2) + (sketchPad.vertexDiameter / 2) + 'px';
            this.edge.style.left = x - (sketchPad.edgeWidth / 2) + (sketchPad.vertexDiameter / 2) + 'px';
            this.edge.style.transform = 'rotate(' + theta.toString() + 'rad)';
        }
    }

    makeArc(targetVertex) {
        this.targetVertex = targetVertex;
        this.isArc = true;
        //make myself a triangle to show direction
        this.arrow = document.createElement('div');
        this.edge.appendChild(this.arrow);
        this.positionEdge();
    }

    select() {
        this.edge.style.border = sketchPad.selectBorderRadius + 'px ' + sketchPad.selectionColor;
        this.isSelected = true;
        this.positionEdge();
    }

    deselect(){
        this.edge.style.border = null;
        this.isSelected = false;
        this.positionEdge();
    }
}

class Sketchpad {
    constructor() {
        //basic constants
        this.padWidth = 500;
        this.padLength = 500;
        this.arrowSize = 10;
        this.selectionColor = 'solid pink';

        this.vertexDiameter = 25;
        this.edgeWidth = 5;
        this.selectBorderRadius = 4;
        this.loopDiameter = 50;
        this.parallelEdgeSpacing = 3.5 * this.edgeWidth;
        this.vertexDegreeIDShow = false;

        //create displays for vertex and edge counts
        this.vertexCountDisplay = document.createElement('div');
        this.vertexCountDisplay.id = 'vertexDisplay';
        this.vertexCountDisplay.style.visibility = 'hidden';
        this.vertexCountDisplay.innerHTML = 'v = 0';
        pad.appendChild(this.vertexCountDisplay);

        this.edgeCountDisplay = document.createElement('div');
        this.edgeCountDisplay.id = 'edgeDisplay';
        this.edgeCountDisplay.style.visibility = 'hidden';
        this.edgeCountDisplay.innerHTML = 'e = 0';
        pad.appendChild(this.edgeCountDisplay);

        this.vertices = [];
        //DO NOT RESET ON DELETION
        this.vertexIDCount = 0;
        //DO RESET ON DELETION
        this.vertexCount = 0;
        this.edges = [];
        //DO NOT RESET ON DELETION
        this.edgeIDCount = 0;
        //DO RESET ON DELETION
        this.edgeCount = 0;

        //fields to be manipulated heavily
        this.selectedVertices = [];
        this.selectedEdges = [];

        this.mouseMoveCTX = null;
        this.grabber = false;
        this.mouseGrabInitPos = [0, 0];
        this.mouseOverObj = null;
    }

    //----------------COMMANDS------------------//
    //Drawing
    drawVertex(ev) {
        if (!this.mouseOverObj) {
            const vertex = new Vertex(ev.clientX - this.vertexDiameter / 2, ev.clientY - this.vertexDiameter / 2, this.vertexIDCount++);
            this.vertices.push(vertex);
            this.vertexCount++;
            this.vertexCountDisplay.innerHTML = 'v = ' + this.vertexCount;
            return vertex;
        }
    }

    generateEdges() {
        if (this.selectedVertices.length < 2) return;
        this.deselectWithoutClear();
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
        this.selectedVertices=[];
        this.selectedEdges=[];
    }

    generateArc() {
        //An arc can only be generated between 2 vertices at a time, or a loop
        if (this.selectedVertices.length !== 1 && this.selectedVertices.length !== 2) return;
        this.deselectWithoutClear();
        if (this.selectedVertices.length === 1) {
            const edge = this.drawEdge(this.selectedVertices[0], this.selectedVertices[0]);
            //make the edge an arc
            edge.makeArc(this.selectedVertices[0]);
        } else if (this.selectedVertices.length === 2) {
            const edge = this.drawEdge(this.selectedVertices[0], this.selectedVertices[1]);
            //make it an arc
            edge.makeArc(this.selectedVertices[1]);
        }
        this.selectedVertices = [];
        this.selectedEdges = [];
    }

    loopVertices() {
        this.deselectWithoutClear();
        for (let i = 0; i < this.selectedVertices.length; i++) {
            this.drawEdge(this.selectedVertices[i], this.selectedVertices[i]);
        }
        this.selectedEdges=[];
        this.selectedVertices=[];
    }

    deleteSelection() {
        //select all edges attached to each vertex
        for (let i = 0; i < this.selectedVertices.length; i++) {
            for (let j = 0; j < this.selectedVertices[i].edges.length; j++) {
                this.selectElement(this.selectedEdges, this.selectedVertices[i].edges[j]);
            }
        }

        //is the object mouse is over about to get deleted?
        if(this.mouseOverObj) {
            let objectFound = false;
            //scan vertices
            for (let i = 0; i < this.selectedVertices.length; i++) {
                if (this.selectedVertices[i].id === this.mouseOverObj.id) {
                    this.mouseOverObj = null;
                    objectFound = true;
                }
            }
            //if not found, scan edges
            if (!objectFound) {
                for (let i = 0; i < this.selectedEdges.length; i++) {
                    if (this.selectedEdges[i].id===this.mouseOverObj.id) {
                        this.mouseOverObj=null;
                    }
                }
            }
        }

        //delete all edges
        for (let i = 0; i < this.selectedEdges.length; i++) {
            //remove the edge from each of its vertices' edges
            this.selectedEdges[i].vertex1.removeEdge(this.selectedEdges[i]);

            if (!this.selectedEdges[i].isLoop) {
                this.selectedEdges[i].vertex2.removeEdge(this.selectedEdges[i]);
            }

            //remove the edge from all the edges
            this.edges = this.edges.filter(edge => edge.id !== this.selectedEdges[i].id);

            //remove it from the html
            this.selectedEdges[i].edge.parentNode.removeChild(this.selectedEdges[i].edge);

            this.edgeCount--;
            this.edgeCountDisplay.innerHTML='e = '+this.edgeCount;
        }

        //delete all vertices
        for (let i = 0; i < this.selectedVertices.length; i++) {
            this.vertices = this.vertices.filter(vertex => vertex.id !== this.selectedVertices[i].id);
            this.selectedVertices[i].vertex.parentNode.removeChild(this.selectedVertices[i].vertex);
            this.vertexCount--;
            this.vertexCountDisplay.innerHTML='v = '+this.vertexCount;
        }

        //need to fix parallel edges, go to each vertex and recalculate each edge
        this.recalculateEdges();

        //clear the lists
        this.selectedEdges = [];
        this.selectedVertices = [];
    }

    clearPad(){
        //select all, then delete all
        for(let i=0;i<this.vertices.length;i++){
            this.selectElement(this.selectedVertices, this.vertices[i]);
        }
        //edges can't exist without vertices, so its ok to only select the vertices
        this.deleteSelection();
    }

    //Manipulating
    color(key){
        switch (key){
            case 49:
                this.colorSelection('black');
                break;
            case 50:
                this.colorSelection('red');
                break;
            case 51:
                this.colorSelection('blue');
                break;
            case 52:
                this.colorSelection('green');
                break;
        }
    }

    toggleGrabber() {
        this.grabber = !this.grabber;
        if (this.grabber) {
            this.mouseGrabInitPos[0] = this.mouseMoveCTX.offsetX;
            this.mouseGrabInitPos[1] = this.mouseMoveCTX.offsetY;
        } else {
            this.recalculateEdges();
        }
    }

    //Selecting
    selectElement(list, element) {
        //don't select if already selected
        if (element.isSelected) return;

        for (let i = 0; i < list.length; i++) {
            if (list[i].id === element.id) {
                return;
            }
        }
        list.push(element);
        element.select();
    }

    deselectAll() {
        for (let i = 0; i < this.selectedVertices.length; i++) {
            this.selectedVertices[i].deselect();
        }
        for (let i = 0; i < this.selectedEdges.length; i++) {
            this.selectedEdges[i].deselect();
        }
        this.selectedVertices = [];
        this.selectedEdges = [];
    }

    //Display Data
    toggleVertexEdgeCounts() {
        this.vertexEdgeCountDisplay = !this.vertexEdgeCountDisplay;
        if (this.vertexEdgeCountDisplay) {
            //turn them on
            this.vertexCountDisplay.style.visibility = 'visible';
            this.edgeCountDisplay.style.visibility = 'visible';
        } else {
            //turn them off
            this.vertexCountDisplay.style.visibility = 'hidden';
            this.edgeCountDisplay.style.visibility = 'hidden';
        }
    }

    toggleVertexData() {
        //loop through the vertices, turn on their displays
        this.vertexDegreeIDShow = !this.vertexDegreeIDShow;
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].displayDegreeID(this.vertexDegreeIDShow);
        }
    }

    //---------------HELPER METHODS---------------//
    //Quality of Life
    deselectWithoutClear() {
        for (let i = 0; i < sketchPad.selectedEdges.length; i++) {
            sketchPad.selectedEdges[i].deselect();
        }
        for (let i = 0; i < sketchPad.selectedVertices.length; i++) {
            sketchPad.selectedVertices[i].deselect();
        }
    }

    colorSelection(color) {
        for (let i = 0; i < this.selectedVertices.length; i++) {
            this.selectedVertices[i].vertex.style.background = color;
        }
        for (let i = 0; i < this.selectedEdges.length; i++) {
            this.selectedEdges[i].edge.style.background = color;
        }
    }

    //Math Palace
    drawEdge(vertex1, vertex2) {
        //make the edge
        const edge = new Edge(vertex1, vertex2, this.edgeIDCount++);
        this.edgeCount++;
        this.edgeCountDisplay.innerHTML = 'e = ' + this.edgeCount;
        this.edges.push(edge);

        //check for parallel edges
        const parallelEdges = this.parallelEdgeFinder(vertex1, vertex2);

        //recalculate for parallel edges?
        if (parallelEdges.length > 1) {
            this.calculateEdgeOffsets(parallelEdges, vertex1, vertex2);
            //reposition parallel edges
            //is it a loop?
            if (vertex1.id === vertex2.id) {
                //I guess you'll only be able to have 9000 loops smh
                let z = 9000;
                for (let i = 0; i < parallelEdges.length; i++) {
                    parallelEdges[i].positionEdge();
                    //need to stack based on z values
                    parallelEdges[i].edge.style.zIndex = z.toString();
                    z--;
                }
            } else {
                for (let i = 0; i < parallelEdges.length; i++) {
                    parallelEdges[i].positionEdge();
                }
            }
        }

        return edge;
    }

    parallelEdgeFinder(vertex1, vertex2) {
        let parallelEdges = [];
        for (let i = 0; i < vertex1.edges.length; i++) {
            const edge = vertex1.edges[i];
            if ((edge.vertex1.id === vertex1.id && edge.vertex2.id === vertex2.id) || (edge.vertex1.id === vertex2.id && edge.vertex2.id === vertex1.id)) {
                parallelEdges.push(edge);
                //standardize vertices
                edge.vertex1 = vertex1;
                edge.vertex2 = vertex2;
            }
        }
        return parallelEdges;
    }

    calculateEdgeOffsets(parallelEdges, vertex1, vertex2) {
        //check for loops
        if (vertex1.id === vertex2.id) {
            let loopDiameter = this.loopDiameter;
            for (let i = 0; i < parallelEdges.length; i++) {
                parallelEdges[i].edge.style.height = loopDiameter+'px';
                parallelEdges[i].edge.style.width = loopDiameter+'px';
                loopDiameter += this.parallelEdgeSpacing;
            }
        } else {
            let slope = (vertex2.y - vertex1.y) / (vertex2.x - vertex1.x);
            slope = -1 / slope;
            //check parity
            const isOdd = parallelEdges.length % 2 === 1;
            let distance = isOdd ? 0 : this.parallelEdgeSpacing / 2;
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
                    let val = Math.abs(distance) + this.parallelEdgeSpacing;
                    distance = distance < 0 ? -val : val;
                }

                distance *= -1;
            }
        }
    }

    recalculateEdges() {
        for (let i = 0; i < this.vertices.length; i++) {
            for (let j = 0; j < this.vertices[i].edges.length; j++) {
                const vertex1 = this.vertices[i];
                const vertex2 = this.vertices[i].edges[j].vertex2;

                //find any parallel edges
                const parallelEdges = this.parallelEdgeFinder(vertex1, vertex2);
                //recalculate
                if (parallelEdges.length > 0) {
                    this.calculateEdgeOffsets(parallelEdges, vertex1, vertex2);
                    //reposition each of the edges
                    for (let k = 0; k < parallelEdges.length; k++) {
                        parallelEdges[k].positionEdge();
                    }
                } else {
                    this.vertices[i].edges[j].positionEdge();
                }
            }
        }
    }
}

const sketchPad = new Sketchpad();

pad.addEventListener('mousedown', ev => sketchPad.drawVertex(ev));
document.addEventListener('keydown', keyDown);
//added to document so you can grab and not be over the pad. EG need to move something really far
document.addEventListener('mousemove',ev => sketchPad.mouseMoveCTX = ev);

//33ms = 30 fps
setInterval(update, 33);
function update(){
    //BUG: doesn't like it when the mouse runs over a previously drawn object
    if(sketchPad.grabber) {
        //move any selected vertices and recalculate their edges
        for (let i = 0; i < sketchPad.selectedVertices.length; i++) {
            //first, find the deltas
            const dx = sketchPad.mouseMoveCTX.offsetX - sketchPad.mouseGrabInitPos[0];
            const dy = sketchPad.mouseMoveCTX.offsetY - sketchPad.mouseGrabInitPos[1];
            //apply the deltas
            sketchPad.selectedVertices[i].moveVertex(sketchPad.selectedVertices[i].x + dx, sketchPad.selectedVertices[i].y + dy);
        }
        //reset grab position
        sketchPad.mouseGrabInitPos[0] = sketchPad.mouseMoveCTX.offsetX;
        sketchPad.mouseGrabInitPos[1] = sketchPad.mouseMoveCTX.offsetY;
    }
}

function keyDown(ev) {
    switch (ev.keyCode) {
        case 69:
            //e, generate edges
            sketchPad.generateEdges();
            break;
        case 71:
            //g, toggle grabber
            sketchPad.toggleGrabber();
            break;
        case 17:
            //ctrl, clear selection
            sketchPad.deselectAll();
            break;
        case 68:
            //d, delete selection
            sketchPad.deleteSelection();
            break;
        case 76:
            //l, loop selected vertices onto themselves
            sketchPad.loopVertices();
            break;
        case 67:
            //c, display edge and vertex counts
            sketchPad.toggleVertexEdgeCounts();
            break;
        case 73:
            //i, display vertex degrees and ID's
            sketchPad.toggleVertexData();
            break;
        case 65:
            //a, generate an arc
            sketchPad.generateArc();
            break;
        case 49:
        case 50:
        case 51:
        case 52:
            //colorings
            sketchPad.color(ev.keyCode);
            break;
    }
}

function clearPad(){
    sketchPad.clearPad();
}
