'use strict';

require('./main.scss');

class LayoutHelper {
    static calcPercent(per, num) { return num * (per / 100); }

    static createDiv(className) {
        const d = document.createElement("div");
        d.classList.add(className.replace(/\./, ''));
        return d;
    }
}

class FollowDeviceRotation extends LayoutHelper {
    constructor({container, stage, dropshadow} = {}) {
        super();

        var createShadow = (x) => {
            this.stage.appendChild(x);
            return x;
        };

        this.container  = document.querySelector(container);
        this.stage      = document.querySelector(stage);
        this.dropshadow = document.querySelector(dropshadow);

        if (!this.dropshadow) this.dropshadow = createShadow(LayoutHelper.createDiv(dropshadow));
    }

    getOptions() {
        return {
            maxX: this.stage.clientWidth  - this.container.clientWidth,
            maxY: this.stage.clientHeight - this.container.clientHeight,
            containerWidth: this.container.clientWidth
        };
    }

    calcDropshadowDrift(area, gamma, perDrift, containerWidth) {
        // return area*gamma/177 + (area*perDrift/177 > 0 ? area*perDrift/177 : area*perDrift/177 * -1) - (containerWidth/2);
    }

    update(event) {
        let options = this.getOptions();
        let x = event.beta - 61;  // In degree in the range [-180,180]
        let y = event.gamma; // In degree in the range [-90,90]
        let dx = 0;
        let dy = 0;

        // console.log("beta : " + x + "\n");
        // console.log("gamma: " + y + "\n");

        // Because we don't want to have the device upside down
        // We constrain the x value to the range [-90,90]
        if (x >  90) { x =  90};
        if (x < -90) { x = -90};

        // To make computation easier we shift the range of 
        // x and y to [0,180]
        x += 90;
        y += 90;
        dx = LayoutHelper.calcPercent(5, x);
        dy = LayoutHelper.calcPercent(5, y);

        console.log(dx);

        // 10 is half the size of the container
        // It center the positioning point to the center of the container
        this.container.style.top  = (options.maxX*x/180 - (options.containerWidth/2)) + "px";
        this.container.style.left = (options.maxY*y/180 - (options.containerWidth/2)) + "px";

        this.dropshadow.style.top  = (options.maxX*x/177 + options.maxX*dx/177 - (options.containerWidth/2)) + "px";

        this.dropshadow.style.left = (options.maxY*y/177 + (options.maxY*dy/177 > 0 ? options.maxY*dy/177 : options.maxY*dy/177 * -1) - (options.containerWidth/2)) + "px";


        
        // Special Effects
        this.dropshadow.style.filter = 'blur(' + (2 + ((dx + dy) / 2)) + 'px)';
        this.dropshadow.style.opacity = 0.75 / ((dx + dy) / 2);
    }
}

// var p = new maintainPerspective(['.container', '.stage']);
var f = new FollowDeviceRotation({container: '.container', stage: '.stage', dropshadow: '.dropshadow'});
window.addEventListener('deviceorientation', () => f.update(event));
