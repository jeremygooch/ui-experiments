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
            anchor: this.container.clientWidth / 2
        };
    }

    update(event) {
        let options = this.getOptions();
        let x = event.beta - 90;  // In degree in the range [-180,180]
        let y = event.gamma - 90; // In degree in the range [-90,90]
        let dx = 0;
        let dy = 0;

        // console.log("beta : " + x + "\n");
        // console.log("gamma: " + y + "\n");

        // To make computation easier we shift the range of 
        // x and y to [0,180]
        x += 90;
        y += 90;
        dx = LayoutHelper.calcPercent(5, x);
        dy = LayoutHelper.calcPercent(5, y);

        // var anchor = options.containerWidth/2;
        var scrRotate = (axis = 'x') => { return axis == 'x' ? options.maxX*x/180 : options.maxY*y/180; };

        function forcePos(val) { return val < 0 ? 0 : val}

        // It center the positioning point to the center of the container
        this.container.style.top  = forcePos((-1 * (scrRotate('x') - options.anchor))) + "px";
        this.container.style.left = forcePos((-1 * (scrRotate('y') - options.anchor))) + "px";

        this.dropshadow.style.top  = forcePos((-1 * (scrRotate('x') + options.maxX*dx/180 - options.anchor))) + "px";

        this.dropshadow.style.left = forcePos(-1 * (scrRotate('y') + (options.maxY*dy/180 > 0 ? options.maxY*dy/180 : options.maxY*dy/180 * -1) - options.anchor)) + "px";



        // Special Effects (simulate depth of field)
        this.dropshadow.style.filter = 'blur(' + (2 + ((dx + dy) / 2)) + 'px)';
        this.dropshadow.style.opacity = 0.75 / ((dx + dy) / 2);
    }
}

var f = new FollowDeviceRotation({container: '.container', stage: '.stage', dropshadow: '.dropshadow'});
window.addEventListener('deviceorientation', () => f.update(event));
