import React from 'react';
import './styles/main.css';

//Each vertex that is on the pad
export default class Vertex extends React.Component{
    render() {
        const {id, x, y} = this.props.vertex;
        return (
            <div id='vertex' style={
                {
                    top: y + 'px',
                    left: x + 'px'
                }
            } onClick={this.props.selectElement.bind(this, true, id)}
                 onMouseEnter={this.props.mouseEnterElement.bind(this, true, id)}
                 onMouseLeave={this.props.mouseLeaveElement.bind(this, true, id)}/>
        )
    }
}