import React from 'react';
import './styles/about.css';
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
    
                <h4>Our Purpose.</h4>

                <p>Given the task of designing a software system for our class, we have 
                   chose to develop a graphing sketchpad website. </p>
    
                <p> With the world moving more online, it can be difficult for students, teachers, 
                    and other graph theorists to incorporate the complexities of a graph. We have 
                    created an online sketchpad that allows anyone from anywhere around the world 
                    to start sketching online.</p>
    
                <img src={Stick} class="meme" alt="Stick" />
                
            </div>
    
            {/* <!-- Don't edit the paragraph, it will ruin the styling --> */}
            <div className="team">
    
                <p> ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎Ryan Welborn ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎‎ ‎‎Austin Betts ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ 
                    ‎ ‎‎ ‎‎ ‎‎ ‎‎Taylor Vo ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎‎Edward Le ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎  ‎‎Justin Tu</p>
    
                <img src={Ryan}className="avatar" alt="Ryan" />
                <img src={Austin} className="avatar2" alt="Austin" /> 
                <img src={Taylor} className="avatar3" alt="Taylor" />
                <img src={Ed} className="avatar4" alt="Ed" />
                <img src={Justin} className="avatar5" alt="Justin" />
    
            </div>
    
            <ul className="dir2">

            <button className='home-button' onClick={this.props.switchView.bind(this, 'landing')}>Home</button>
            <button className='about-button' onClick={this.props.switchView.bind(this, 'about')}>About</button>
                
            </ul>

        </section>
        );
    }
}