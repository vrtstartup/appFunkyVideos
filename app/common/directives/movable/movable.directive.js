class MovableDirectiveController {
    constructor($element, $window) {

        this.$element = $element;
        this.$window = $window;
        this.mouseIsDown = false;

        this.init();
    }

    init() {
        let styles = this.$window.getComputedStyle(this.$element[0], null);

        this.originBgPosX = parseInt(styles.getPropertyValue('background-position-x'), 10);
        this.originBgPosY = parseInt(styles.getPropertyValue('background-position-y'), 10);

        this.$element.on('mousedown', this.onMousedown.bind(this));
        this.$element.on('mouseup', this.onMouseup.bind(this));
        this.$element.on('mousemove', this.onMousemove.bind(this));
    }

    onMousemove(e) {
        if ( !this.mouseIsDown ) return;

        let tg = e.target;
        let x = e.clientX;
        let y = e.clientY;

        tg.style.backgroundPositionX = x - this.originX + this.originBgPosX + 'px';
        tg.style.backgroundPositionY = y - this.originY + this.originBgPosY + 'px';

        //console.log('e.clientX', e.clientX);
        //console.log('tg.style.backgroundPositionX', tg.style.backgroundPositionX);
    }

    onMousedown(e) {
        this.mouseIsDown = true;
        this.originX = e.clientX;
        this.originY = e.clientY;
    }

    onMouseup(e) {
        let tg = e.target;
        let styles = getComputedStyle(tg);

        this.mouseIsDown = false;
        this.originBgPosY = parseInt(styles.getPropertyValue('background-position-x'), 10);
        this.originBgPosY = parseInt(styles.getPropertyValue('background-position-y'), 10);
    }
}

export const movableDirective = function() {
    return {
        restrict: 'A',
        scope: {},
        controller: MovableDirectiveController,
        controllerAs: 'vm',
        bindToController: {},
    };
};

MovableDirectiveController.$inject = ['$element', '$window'];
