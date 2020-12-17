# Graph Theorist's Sketchpad
Welcome to Team 4's Final Project for CS320-Fall 2020

## About the project
This project was built for our Final for CS320 at WSUV. We wanted to make an web application where it would be easy to create a quick mathematical graph. This web application was built in mind for anyone who wanted to play with graphs and see some useful informatiom about what they created. 

## Built with
This project only used: 
- [React](https://reactjs.org/) 
- [Firebase](https://firebase.google.com/)
- [Node](https://nodejs.org/en/)

React would be our choice for the front end application and we would use Firebase for our database system and authentication system. 

## Getting Started
To get this project into your system you need to follow the instructions below to get it up and running. 

### Prerequisites 
- Node

You need to have node package on your system. To check if you have this please run the follwoing command. This should pop up with the version you are running, if you dont have it installed please follow node's website for installation. 
```
npm -v
```

- React

In order to run react please install it, please run the following command. This will install react along with react-dom which we will need. 
```
npm install --save react react-dom
```

- Firebase 

You will also need firebase, to install it please run: 

```
npm install firebase
```

## Installation 
You will need to clone the repo onto your system. Then go into graphtheoristsketchapd folder: 
```
cd graph_theorists_sketchpad
```

From there you should be able to run the web app: 

```
npm start
```

## Usage 
### Sketchpad Keyboard Shortcuts
- When a vertex(or more) are selected press any number to change its color
- e: edge (when two or more vertices are selected)
- a: arc (when one or two verticees are selected)
- l: loop (when one vertex is selected)
- r: reset ids
- c: graph data
- i: vertex data
- g: grab (when one or more vertices are selected)
- s: deselect
- b: bridge



