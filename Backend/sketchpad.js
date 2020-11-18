const pad=document.getElementById('pad');

const vertexRadius=25;
const edgeWidth=5;
let selectedVertices=[];
let mouseOverObj=false;

pad.addEventListener('mousedown', drawVertex);
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e){
    switch (e.keyCode){
        case 69:
            //e, generate edges
            generateEdges();
            break;
    }
}

function keyUp(e){
    switch (e.keyCode){
        case 17:
            //ctrl, clear selection
            selectedVertices=[];
            break;
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

            const edge=document.createElement('div');
            pad.appendChild(edge);
            edge.id='edge';
            //math time
            let x1=parseFloat(selectedVertices[i].style.left);
            let x2=parseFloat(selectedVertices[j].style.left);
            let y1=parseFloat(selectedVertices[i].style.top);
            let y2=parseFloat(selectedVertices[j].style.top);
            //first, find the height
            let dx=x1-x2;
            let dy=y2-y1;
            let height=Math.sqrt((dx*dx)+(dy*dy));
            //second, find the angle
            let theta=Math.atan2(dx, dy);
            //third, find the position
            let x=(x1+x2)/2;
            let y=(y1+y2)/2;

            edge.style.height=height+'px';
            edge.style.top=y-(height/2)+(vertexRadius/2)+'px';
            edge.style.left=x-(edgeWidth/2)+(vertexRadius/2)+'px';
            edge.style.transform='rotate('+theta.toString()+'rad)';

            filledEdges.push(ij);
        }
    }
}

function drawVertex() {
    if(mouseOverObj) return;
    const vertex = document.createElement('div');
    pad.appendChild(vertex);
    vertex.id = 'vertex';
    vertex.style.top = (event.clientY - vertexRadius / 2) + 'px';
    vertex.style.left = (event.clientX - vertexRadius / 2) + 'px';

    vertex.addEventListener('mousedown', function (ev){
        //select the vertex
        selectedVertices.push(vertex);
    });
    vertex.addEventListener('mouseenter', function (ev){
        mouseOverObj=true;
    });
    vertex.addEventListener('mouseleave', function (ev){
        mouseOverObj=false;
    });
}
