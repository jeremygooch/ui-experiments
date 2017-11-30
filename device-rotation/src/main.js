'use strict';

require('./main.scss');

class maintainPerspective {
    constructor([c, s, o]) {
        this.container = document.querySelector(c);
        this.stage     = document.querySelector(s);
        this.output    = document.querySelector(o);
    }

    getOptions() {
        return {
            maxX: this.stage.clientWidth  - this.container.clientWidth,
            maxY: this.stage.clientHeight - this.container.clientHeight
        }
    }

    modifyOrientation(event) {
        let options = this.getOptions();
        let x = event.beta;  // In degree in the range [-180,180]
        let y = event.gamma; // In degree in the range [-90,90]

        this.output.innerHTML  = "beta : " + x + "\n";
        this.output.innerHTML += "gamma: " + y + "\n";

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
        this.container.style.top  = (options.maxX*x/180 - 10) + "px";
        this.container.style.left = (options.maxY*y/180 - 10) + "px";
    }
}

var p = new maintainPerspective(['.container', '.stage', '.output']);
window.addEventListener('deviceorientation', () => p.modifyOrientation(event));
