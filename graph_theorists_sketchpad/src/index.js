import React from 'react';
import ReactDom from 'react-dom';
import Sketchpad from "./Sketchpad";

class App extends React.Component{
    render() {
        return(
            <Sketchpad/>
        );
    }
}

ReactDom.render(<App/>, document.getElementById('root'));