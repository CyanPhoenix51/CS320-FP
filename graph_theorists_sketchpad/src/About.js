import React from 'react';
import './styles/info.css';
import Justin from "./Pictures/justin.png";
import Ed from "./Pictures/ed.png";
import Taylor from "./Pictures/taylor.png";
import Ryan from "./Pictures/ryan.png";
import Austin from "./Pictures/austin.png";
import Stick from "./Pictures/meme.png";

export default class About extends React.Component {
    render(){
        return (
            <section>
            <div className="about">
    
                <h1>Our Purpose.</h1>
                <p>Given the task of designing a software system for our class, we have 
                   chose to develop a graphing sketchpad website. </p>
    
                <p> With the world moving more online, it can be difficult for students, teachers, 
                    and other graph theorists to incorporate the complexities of a graph. We have 
                    created an online sketchpad that allows anyone from anywhere around the world 
                    to start sketching online.</p>
    
                <img src={Stick} class="meme" />
                
            </div>
    
            {/* <!-- Don't edit the paragraph, it will ruin the styling --> */}
            <div className="team">
    
                <p> ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎Ryan Welborn ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎‎ ‎‎Austin Betts ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ 
                    ‎ ‎‎ ‎‎ ‎‎ ‎‎Taylor Vo ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎‎Edward Le ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎  ‎‎Justin Tu</p>
    
                <img src={Ryan} class="avatar" />
                <img src={Austin} class="avatar2" /> 
                <img src={Taylor} class="avatar3" />
                <img src={Ed} class="avatar4" />
                <img src={Justin} class="avatar5" />
    
            </div>
    
            <ul className="dir">
    
                {/* <li><a href="landing.html">Home</a></li>
                <li><a href="info.html">About</a></li>    */}
                
                {/* <button onClick={this.props.switchView.bind(this, 'landing')}>Landing</button> */}
    
            </ul>
    
        </section>
        );
    }
}