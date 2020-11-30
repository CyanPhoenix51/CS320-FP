import React from 'react';


export default class Sketchbook extends React.Component {


    render() {
        let text = this.props.saveSketch ? this.props.saveSketch : 'Hello'
        return (
            <div>
                <h1>{text}</h1>
                <button onClick={this.props.loadSketch}>Create Graph</button>
            </div>

        );
    }
}