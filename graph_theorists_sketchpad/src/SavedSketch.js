import React from 'react';


export default class SavedSketch extends React.Component {

    render() {
        return(
            <h1>{this.props.sketch.name}</h1>
        );
    }
}