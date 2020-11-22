const pad=document.getElementById('pad');

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

        //this line is required because js is confused on what 'this' is in the event listeners
        const v = this;
        //add event listeners
        this.vertex.addEventListener('mousedown', function (ev) {
            //select the vertex
            sketchPad.selectElement(sketchPad.selectedVertices, v);
        });
        this.vertex.addEventListener('mouseenter', function (ev) {
            sketchPad.mouseOverObj = true;
        });
        this.vertex.addEventListener('mouseleave', function (ev) {
            sketchPad.mouseOverObj = false;
        });
    }

    moveVertex(x, y){
        this.x=x;
        this.y=y;
        //put myself at new position
        this.vertex.style.top=y+'px';
        this.vertex.style.left=x+'px';

        //recalculate my edges
        for (let i = 0; i < this.edges.length; i++) {
            this.edges[i].positionEdge();
        }
    }

    select() {
        this.vertex.style.border = sketchPad.selectBorderRadius + 'px solid pink';
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
}

class Edge {
    constructor(vertex1, vertex2, id) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.id = id;
        this.isSelected = false;
        this.offsetX=0;
        this.offsetY=0;

        //create the edge
        this.edge = document.createElement('div');
        pad.appendChild(this.edge);

        //is it a loop?
        this.isLoop = vertex1.id === vertex2.id;
        if (this.isLoop) {
            //if loop, only add myself once to the vertex
            vertex1.edges.push(this);
            this.edge.id = 'loop';
        } else {
            vertex1.edges.push(this);
            vertex2.edges.push(this);
            this.edge.id = 'edge';
        }
        this.positionEdge(0, 0);

        //this line is required because js is confused on what 'this' is in the event listeners
        const e = this;
        //add event listeners
        this.edge.addEventListener('mousedown', function (ev) {
            sketchPad.selectElement(sketchPad.selectedEdges, e);
        });
        this.edge.addEventListener('mouseenter', function (ev) {
            sketchPad.mouseOverObj = true;
        });
        this.edge.addEventListener('mouseleave', function (ev) {
            sketchPad.mouseOverObj = false;
        });
    }

    positionEdge() {
        if (this.isLoop) {
            //slap it on the vertex
            let x = this.vertex1.x - this.edge.style.width + this.vertex1.vertex.style.width;
            let y = this.vertex1.y - this.edge.style.height + this.vertex1.vertex.style.height;
            if (this.isSelected) {
                x -= sketchPad.selectBorderRadius;
                y -= sketchPad.selectBorderRadius;
            }
            this.edge.style.top = y + 'px';
            this.edge.style.left = x + 'px';
        } else {
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
            this.edge.style.height = height + 'px';
            this.edge.style.top = y - (height / 2) + (sketchPad.vertexRadius / 2) + 'px';
            this.edge.style.left = x - (sketchPad.edgeWidth / 2) + (sketchPad.vertexRadius / 2) + 'px';
            this.edge.style.transform = 'rotate(' + theta.toString() + 'rad)';
        }
    }

    select(){
        this.edge.style.border = sketchPad.selectBorderRadius + 'px solid pink';
        this.isSelected = true;
        this.positionEdge(0, 0);
    }

    deselect(){
        this.edge.style.border = null;
        this.isSelected = false;
        this.positionEdge(0, 0);
    }
}

class Sketchpad {
    constructor(vertexRadius, edgeWidth, selectBorderRadius) {
        this.vertexRadius = vertexRadius;
        this.edgeWidth = edgeWidth;
        this.selectBorderRadius = selectBorderRadius;
        this.parallelEdgeSpacing=2*edgeWidth;

        this.vertices = [];
        //DO NOT RESET ON DELETION
        this.vertexIDCount = 0;
        this.edges=[];
        this.edgeIDCount=0;

        this.selectedVertices = [];
        this.selectedEdges = [];

        this.mouseMoveCTX=null;
        this.grabber = false;
        this.mouseGrabInitPos = [0, 0];
        this.mouseOverObj=false;
    }

    drawVertex(ev) {
        if (!this.mouseOverObj) {
            this.vertices.push(new Vertex(ev.clientX - this.vertexRadius / 2, ev.clientY - this.vertexRadius / 2, this.vertexIDCount++));
        }
    }

    selectElement(list, element) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === element.id) {
                return;
            }
        }
        list.push(element);
        element.select();
    }

    deselectAll(){
        for (let i = 0; i < this.selectedVertices.length; i++) {
            this.selectedVertices[i].deselect();
        }
        for (let i = 0; i < this.selectedEdges.length; i++) {
            this.selectedEdges[i].deselect();
        }
        this.selectedVertices = [];
        this.selectedEdges = [];
    }

    generateEdges() {
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

                //find any parallel edges that are already between these two vertices
                const parallelEdges = this.parallelEdgeFinder(this.selectedVertices[i], this.selectedVertices[j]);
                //make the new edge
                const edge=new Edge(this.selectedVertices[i], this.selectedVertices[j], this.edgeIDCount++);
                this.edges.push(edge);

                //do we have to calculate offsets?
                if (parallelEdges.length > 0) {
                    //add the new edge to parallelEdges first
                    parallelEdges.push(edge);
                    this.calculateEdgeOffsets(parallelEdges, this.selectedVertices[i], this.selectedVertices[j]);
                    //new offsets, reposition edges
                    for (let k = 0; k < parallelEdges.length; k++) {
                        parallelEdges[k].positionEdge();
                    }
                }

                filledEdges.push(ij);
            }
        }
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
        //do check for loops

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

    loopVertices(){
        for (let i = 0; i < this.selectedVertices.length; i++) {
            this.edges.push(new Edge(this.selectedVertices[i], this.selectedVertices[i], this.edgeCount++));
        }
        this.deselectAll();
    }

    toggleGrabber(){
        this.grabber=!this.grabber;
        if (this.grabber) {
            this.mouseGrabInitPos[0] =this.mouseMoveCTX.offsetX;
            this.mouseGrabInitPos[1] = this.mouseMoveCTX.offsetY;
        }
    }

    deleteSelection() {
        //select all edges attached to each vertex
        for (let i = 0; i < this.selectedVertices.length; i++) {
            for (let j = 0; j < this.selectedVertices[i].edges.length; j++) {
                this.selectElement(this.selectedEdges, this.selectedVertices[i].edges[j]);
            }
        }

        //delete all edges
        for (let i = 0; i < this.selectedEdges.length; i++) {
            //remove the edge from each of its vertices' edges
            let vertexEdges = this.selectedEdges[i].vertex1.edges;
            vertexEdges = vertexEdges.filter(edge => edge.id !== this.selectedEdges[i].id);
            this.selectedEdges[i].vertex1.edges = vertexEdges;
            if (!this.selectedEdges[i].isLoop) {
                vertexEdges = this.selectedEdges[i].vertex2.edges;
                vertexEdges = vertexEdges.filter(edge => edge.id !== this.selectedEdges[i].id);
                this.selectedEdges[i].vertex2.edges = vertexEdges;
            }

            //remove the edge from all the edges
            this.edges = this.edges.filter(edge => edge.id !== this.selectedEdges[i].id);

            //remove it from the html
            this.selectedEdges[i].edge.parentNode.removeChild(this.selectedEdges[i].edge);
        }

        //delete all vertices
        for (let i = 0; i < this.selectedVertices.length; i++) {
            this.vertices = this.vertices.filter(vertex => vertex.id !== this.selectedVertices[i].id);
            this.selectedVertices[i].vertex.parentNode.removeChild(this.selectedVertices[i].vertex);
        }


        //need to fix parallel edges, go to each vertex and recalculate each edge
        for (let i = 0; i < this.vertices.length; i++) {
            for (let j = 0; j < this.vertices[i].edges.length; j++) {
                const vertex1 = this.vertices[i];
                const vertex2 = this.vertices[i].edges[j].vertex2;

                //find any parallel edges
                const parallelEdges = this.parallelEdgeFinder(vertex1, vertex2);
                //recalculate?
                if (parallelEdges.length > 0) {
                    this.calculateEdgeOffsets(parallelEdges, vertex1, vertex2);
                    //reposition each of the edges
                    for (let k = 0; k < parallelEdges.length; k++) {
                        parallelEdges[k].positionEdge();
                    }
                }
            }
        }

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
}

const sketchPad=new Sketchpad(25, 5, 4);

pad.addEventListener('mousedown', ev => sketchPad.drawVertex(ev));
document.addEventListener('keydown', keyDown);
//added to document so you can grab and not be over the pad. EG need to move something really far
document.addEventListener('mousemove',ev => sketchPad.mouseMoveCTX=ev);

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
            //deselection takes place like this so the graph looks a little nicer on creation
            for(let i=0;i<sketchPad.selectedEdges.length;i++){
                sketchPad.selectedEdges[i].deselect();
            }
            for (let i = 0; i < sketchPad.selectedVertices.length; i++) {
                sketchPad.selectedVertices[i].deselect();
            }
            sketchPad.generateEdges();
            sketchPad.selectedVertices = [];
            sketchPad.selectedEdges=[];
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
            sketchPad.deselectAll();
            break;
        // case 49:
        // //colorings
        // case 50:
        // case 51:
        // case 52:
        //     sketchPad.color(ev.keyCode);
        //     break;
    }
}

function clearPad(){
    sketchPad.clearPad();
}
