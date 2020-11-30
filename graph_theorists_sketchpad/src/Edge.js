import React from 'react';
import './styles/main.css';

//Each edge that is on the pad
export default class Edge extends React.Component{
    render() {
        const {
            id, x, y, height, borderRadius, selectionColor, isSelected, loopRadius
        } = this.props.edge;
        if (this.props.edge.isLoop) {
            return (
                <div id='loop' style={{
                    top: isSelected ? y - borderRadius + 'px' : y + 'px',
                    left: isSelected ? x - borderRadius + 'px' : x + 'px',
                    height: 2 * loopRadius + 'px',
                    width: 2 * loopRadius + 'px',
                    border: isSelected ? borderRadius + 'px ' + selectionColor : null,
                    zIndex: this.props.edge.zIndex.toString()
                }}
                     onClick={this.props.selectElement.bind(this, false, id)}
                     onMouseEnter={this.props.mouseEnterElement.bind(this, false, id)}
                     onMouseLeave={this.props.mouseLeaveElement.bind(this, false, id)}/>
            );
        } else {
            return (
                <div id='edge' style={{
                    height: height + 'px',
                    top: isSelected ? y - borderRadius + 'px' : y + 'px',
                    left: isSelected ? x - borderRadius + 'px' : x + 'px',
                    transform: 'rotate(' + this.props.edge.theta.toString() + 'rad)',
                    border: isSelected ? borderRadius + 'px ' + selectionColor : null
                }}
                     onClick={this.props.selectElement.bind(this, false, id)}
                     onMouseEnter={this.props.mouseEnterElement.bind(this, false, id)}
                     onMouseLeave={this.props.mouseLeaveElement.bind(this, false, id)}/>
            );
        }
    }
}