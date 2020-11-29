import React from 'react';
import ReactDom from 'react-dom';
import Sketchpad from "./Sketchpad";

class Layout extends React.Component{
    render() {
        return(
            <Sketchpad/>
        );
    }
}

ReactDom.render(<Layout/>, document.getElementById('root'));