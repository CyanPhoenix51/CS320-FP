import React from 'react';
import './styles/main.css';

//Each vertex that is on the pad
export default class Vertex extends React.Component{
    render(){
        return(
            <div id='vertex' style={
                {
                    top: this.props.y+'px',
                    left: this.props.x+'px'
                }
            }/>
        )
    }
}