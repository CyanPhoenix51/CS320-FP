import React from 'react';
import './styles/main.css';

//Each edge that is on the pad
export default class Edge extends React.Component{
    render() {
        const {x, y, height, theta} = this.props.edge;
        const thetaStr = theta.toString();
        return (
            <div id='edge' style={{
                height: height + 'px',
                top: y + 'px',
                left: x + 'px',
                transform: 'rotate(' + thetaStr + 'rad)'
            }}/>
        );
    }
}