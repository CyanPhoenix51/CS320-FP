import React from 'react';
import './styles/main.css';

//Each edge that is on the pad
export default class Edge extends React.Component{
    render() {
        const {id, x, y, height, theta, borderRadius, selectionColor, isSelected} = this.props.edge;
        const thetaStr = theta.toString();
        return (
            <div id='edge' style={{
                height: height + 'px',
                top: isSelected ? y - borderRadius + 'px' : y + 'px',
                left: isSelected ? x - borderRadius + 'px' : x + 'px',
                transform: 'rotate(' + thetaStr + 'rad)',
                border: isSelected ? borderRadius + 'px ' + selectionColor : null
            }}
                 onClick={this.props.selectElement.bind(this, false, id)}
                 onMouseEnter={this.props.mouseEnterElement.bind(this, false, id)}
                 onMouseLeave={this.props.mouseLeaveElement.bind(this, false, id)}/>
        );
    }
}