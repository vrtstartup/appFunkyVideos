//import template from './draggable.directive.html';

class DraggableDirectiveController {
    constructor($element, $document) {

        this.$document = $document;
        this.$element = $element;

        this.startX = 0;
        this.startY = 0;
        this.x = 380;
        this.y = 150;

        this.$element.css({
            //position: 'relative',
            cursor: 'pointer'
        });

        this.$element.on('mousedown', (event) => {
            console.log('Mouse down', event.pageX, event.pageY);
            // Prevent default dragging of selected content
            event.preventDefault();
            this.startX = event.pageX - this.x;
            this.startY = event.pageY - this.y;
            this.$document.on('mousemove', this.mousemove.bind(this));
            this.$document.on('mouseup', this.mouseup.bind(this));
        });
    }

    mousemove(event) {
        this.y = event.pageY - this.startY;
        this.x = event.pageX - this.startX;
        this.$element.css({
            top: this.y + 'px',
            left:  this.x + 'px'
        });
    }

    mouseup() {
        this.$document.unbind('mousemove');
        this.$document.unbind('mouseup');
    }
}

export const draggableDirective = function() {
    return {
        restrict: 'A',
        scope: {},
        controller: DraggableDirectiveController,
        controllerAs: 'vm',
        bindToController: {},
    };
};

DraggableDirectiveController.$inject = ['$element', '$document'];
