const pad=document.getElementById('pad');

const vertexRadius=25;
const edgeWidth=5;

let vertices=[];
//DO NOT RESET this on vertex deletion
let vertexCount=0;
let edges=[];
//DO NOT RESET this on edge deletion
let edgeCount=0;
let selectedVertices=[];
let selectedEdges=[];

let mouseOverObj=false;
let grabber=false;
let mouseGrabInitPos=[0,0];
let mouseMoveCTX=null;

pad.addEventListener('mousedown', drawVertex);
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
//added to document so you can grab and not be over the pad. EG need to move something really far
document.addEventListener('mousemove',ev => mouseMoveCTX=ev);

//33ms = 30 fps
setInterval(update, 33);
function update(){
    //BUG: doesn't like it when the mouse runs over a previously drawn object
    if(grabber){
        //move any selected vertices and recalculate their edges
        for(let i=0;i<selectedVertices.length;i++){
            //first, find the deltas
            const dx=mouseMoveCTX.offsetX-mouseGrabInitPos[0];
            const dy=mouseMoveCTX.offsetY-mouseGrabInitPos[1];
            //apply the deltas
            selectedVertices[i].moveVertex(selectedVertices[i].x+dx, selectedVertices[i].y+dy);
        }
        //reset grab position
        mouseGrabInitPos[0]=mouseMoveCTX.offsetX;
        mouseGrabInitPos[1]=mouseMoveCTX.offsetY;
    }
}

class Vertex{
    constructor(x, y, id) {
        this.id=id;
        this.x=x;
        this.y=y;
        this.edges=[];
        //create the vertex object
        this.vertex = document.createElement('div');
        pad.appendChild(this.vertex);
        this.vertex.id = 'vertex';
        //position myself
        this.vertex.style.top = y + 'px';
        this.vertex.style.left = x + 'px';

        //this line is required because js is confused on what 'this' is in the event listeners
        const v=this;
        //add event listeners
        this.vertex.addEventListener('mousedown', function (ev){
            //select the vertex
            select(selectedVertices, v);
        });
        this.vertex.addEventListener('mouseenter', function (ev){
            mouseOverObj=true;
        });
        this.vertex.addEventListener('mouseleave', function (ev){
            mouseOverObj=false;
        });
    }

    moveVertex(x, y){
        this.x=x;
        this.y=y;
        //put myself at new position
        this.vertex.style.top=y+'px';
        this.vertex.style.left=x+'px';

        //recalculate my edges
        for(let i=0;i<this.edges.length;i++){
            this.edges[i].positionEdge();
        }
    }
}

class Edge {
    constructor(vertex1, vertex2, id) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.id = id;

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
        this.positionEdge();

        //this line is required because js is confused on what 'this' is in the event listeners
        const e = this;
        //add event listeners
        this.edge.addEventListener('mousedown', function (ev) {
            select(selectedEdges, e);
        });
        this.edge.addEventListener('mouseenter', function (ev) {
            mouseOverObj = true;
        });
        this.edge.addEventListener('mouseleave', function (ev) {
            mouseOverObj = false;
        });
    }

    positionEdge() {
        if (this.isLoop) {
            //slap it on the vertex
            const x = this.vertex1.x - this.edge.style.width + this.vertex1.vertex.style.width;
            const y = this.vertex1.y - this.edge.style.height + this.vertex1.vertex.style.height;
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
            let x = (x1 + x2) / 2;
            let y = (y1 + y2) / 2;

            //apply the calculations
            this.edge.style.height = height + 'px';
            this.edge.style.top = y - (height / 2) + (vertexRadius / 2) + 'px';
            this.edge.style.left = x - (edgeWidth / 2) + (vertexRadius / 2) + 'px';
            this.edge.style.transform = 'rotate(' + theta.toString() + 'rad)';
        }
    }
}

function keyDown(ev){
    switch (ev.keyCode){
        case 69:
            //e, generate edges
            generateEdges();
            selectedVertices=[];
            selectedEdges=[];
            break;
        case 71:
            //g, toggle grabber
            grabber=!grabber;
            if(grabber){
                mouseGrabInitPos[0]=mouseMoveCTX.offsetX;
                mouseGrabInitPos[1]=mouseMoveCTX.offsetY;
            }
            break;
        case 17:
            //ctrl, clear selection
            selectedVertices=[];
            selectedEdges=[];
            break;
        case 68:
            //d, delete selection
            deleteEdges();
            deleteVertices();
            break;
        case 76:
            //l, loop selected vertices onto themselves
            loopVertices();
            break;
      case 49:
        //colorings
      case 50:
      case 51:
      case 52:
        color(ev.keyCode);
        break;
    }
}

function keyUp(ev){
    switch (ev.keyCode){
    }
}

function select(list, element){
    //select the edge
    let notPrevSelected=true;
    for(let i=0;i<list.length;i++){
        if(list[i].id===element.id){
            notPrevSelected=false;
            break;
        }
    }
    if(notPrevSelected){
        list.push(element);
    }
}

function generateEdges(){
    if(selectedVertices.length<2) return;
    let filledEdges=[];
    for(let i=0;i<selectedVertices.length;i++){
        for(let j=0;j<selectedVertices.length;j++){
            if(i===j) continue;
            //don't wanna draw the same edge twice
            let ij=i.toString()+j.toString();
            let ji=j.toString()+i.toString();
            if(filledEdges.includes(ij) || filledEdges.includes(ji)) continue;

            edges.push(new Edge(selectedVertices[i], selectedVertices[j], edgeCount++));
            filledEdges.push(ij);
        }
    }
}

function drawVertex() {
    if(mouseOverObj) return;
    vertices.push(new Vertex((event.clientX - vertexRadius / 2), (event.clientY - vertexRadius / 2), vertexCount));
    vertexCount++;
}

function deleteEdges(){
    for(let i=0;i<selectedEdges.length;i++){
        //remove the edge from each of its vertices' edges
        let vertexEdges=selectedEdges[i].vertex1.edges;
        vertexEdges=vertexEdges.filter(edge => edge.id!==selectedEdges[i].id);
        selectedEdges[i].vertex1.edges=vertexEdges;
        vertexEdges=selectedEdges[i].vertex2.edges;
        vertexEdges=vertexEdges.filter(edge => edge.id!==selectedEdges[i].id);
        selectedEdges[i].vertex2.edges=vertexEdges;

        //remove the edge from all the edges
        edges=edges.filter(edge => edge.id!==selectedEdges[i].id);

        //remove it from the html
        selectedEdges[i].edge.parentNode.removeChild(selectedEdges[i].edge);
    }
    selectedEdges=[];
}

function deleteVertices(){
    for(let i=0;i<selectedVertices.length;i++){
        //first, select all edges connected to the vertex and delete them
        for(let j=0;j<selectedVertices[i].edges.length;j++){
            select(selectedEdges, selectedVertices[i].edges[j]);
        }
        //console.log(selectedEdges.length);
        deleteEdges();

        //second, delete the vertex
        vertices=vertices.filter(vertex => vertex.id!==selectedVertices[i].id);

        //remove it from the html
        selectedVertices[i].vertex.parentNode.removeChild(selectedVertices[i].vertex);
    }
    selectedVertices=[];
}

function loopVertices(){
    for(let i=0;i<selectedVertices.length;i++){
        edges.push(new Edge(selectedVertices[i], selectedVertices[i], edgeCount++));
    }
    selectedVertices=[];
}

function color(key){
  //color the selection based on the key pressed
  //start with vertices
  let color=null;
  switch (key){
    case 49:
      color='red';
      break;
    case 50:
      color='blue';
      break;
    case 51:
      color='green';
      break;
    case 52:
      color='orange';
      break;
  }
  for(let i=0;i<selectedVertices.length;i++){
    selectedVertices[i].vertex.style.background=color;
  }
}
