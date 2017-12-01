'use strict';

require('./main.scss');

class maintainPerspective {
    constructor({container, stage} = {}) {
        this.container = document.querySelector(container);
        this.stage     = document.querySelector(stage);
    }

    getOptions() {
        return {
            maxX: this.stage.clientWidth  - this.container.clientWidth,
            maxY: this.stage.clientHeight - this.container.clientHeight,
            containerWidth: this.container.clientWidth
        }
    }

    modifyOrientation(event) {
        let options = this.getOptions();
        let x = event.beta - 61;  // In degree in the range [-180,180]
        let y = event.gamma; // In degree in the range [-90,90]

        console.log("beta : " + x + "\n");
        console.log("gamma: " + y + "\n");

        // Because we don't want to have the device upside down
        // We constrain the x value to the range [-90,90]
        if (x >  90) { x =  90};
        if (x < -90) { x = -90};

        // To make computation easier we shift the range of 
        // x and y to [0,180]
        x += 90;
        y += 90;

        // 10 is half the size of the container
        // It center the positioning point to the center of the container
        this.container.style.top  = (options.maxX*x/180 - (options.containerWidth/2)) + "px";
        this.container.style.left = (options.maxY*y/180 - (options.containerWidth/2)) + "px";
    }
}

// var p = new maintainPerspective(['.container', '.stage']);
var p = new maintainPerspective({container: '.container', stage: '.stage'});
window.addEventListener('deviceorientation', () => p.modifyOrientation(event));


var newDiv = document.createElement("div");
var newContent = document.createTextNode("Hi there and greetings!");
newDiv.appendChild(newContent);
var currentDiv = document.querySelector(".stage");
currentDiv.appendChild(newDiv);
