import React from 'react';
import './styles/main.css';

//Each vertex that is on the pad
export default class Vertex extends React.Component {
  render() {
    const { id, x, y, isSelected, borderRadius, selectionColor, displayVertexData, color, isHovering } = this.props.vertex;
    return (
        <div className='vertex' style={
          {
            top: isSelected ? y - borderRadius + 'px' : y + 'px',
            left: isSelected ? x - borderRadius + 'px' : x + 'px',
            border: isSelected ? borderRadius + 'px ' + selectionColor : null,
            // for some reason I have to use pink, I can't use the selection color
            background: isHovering ? 'pink' : color
          }
        } onClick={this.props.selectElement.bind(this, true, id)}
             onMouseEnter={this.props.mouseEnterElement.bind(this, true, id)}
             onMouseLeave={this.props.mouseLeaveElement.bind(this, true, id)}>

          <div className='vertexData' style={{
            visibility: displayVertexData ? 'visible' : 'hidden'
          }}>
            <div className='vertexID'>
              <p>{id}</p>
            </div>
            <div className='vertexDegree'>
              <p>{this.props.vertex.edges.length}</p>
            </div>
          </div>
        </div>
    )
  }
}