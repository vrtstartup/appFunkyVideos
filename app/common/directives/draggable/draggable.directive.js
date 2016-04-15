//import template from './draggable.directive.html';

class DraggableDirectiveController {
    constructor($element, $document) {

        this.$document = $document;
        this.$element = $element;

        console.log('Draggable', $element);

        this.startX = 0;
        this.startY = 0;
        this.x = 640;
        this.y = 580;

        this.$element.css({
            //position: 'relative',
            cursor: 'pointer'
        });

        this.$element.on('mousedown', (event) => {
            console.log('Mouse down', event.pageX);
            // Prevent default dragging of selected content
            event.preventDefault();
            this.startX = event.pageX - this.x;
            this.startY = event.pageY - this.y;
            this.$document.on('mousemove', this.mousemove.bind(this));
            this.$document.on('mouseup', this.mouseup.bind(this));
        });
    }

    mousemove(event) {
        //console.log('MouseMove');
        this.y = event.pageY - this.startY;
        this.x = event.pageX - this.startX;
        this.$element.css({
            top: this.y + 'px',
            left:  this.x + 'px'
        });
    }

    mouseup() {
        console.log('Mouse up');
        this.$document.unbind('mousemove');
        this.$document.unbind('mouseup');
    }
}

export const draggableDirective = function() {
    return {
        restrict: 'A',
        //template: template,
        scope: {},
        controller: DraggableDirectiveController,
        controllerAs: 'vm',
        bindToController: {},
        //link: function(scope, element, attr) {
        //
        //    console.log('Draggable', scope);

            //var startX = 0, startY = 0, x = 300 || 0, y = 300 || 0;
            //
            //element.css({
            //    //position: 'relative',
            //    cursor: 'pointer'
            //});
            //
            //element.on('mousedown', (event) => {
            //
            //    console.log(event.pageX);
            //    // Prevent default dragging of selected content
            //    event.preventDefault();
            //    startX = event.pageX - x;
            //    startY = event.pageY - y;
            //    this.$document.on('mousemove', mousemove);
            //    this.$document.on('mouseup', mouseup);
            //});

            //function mousemove(event) {
            //    console.log(event.pageX);
            //
            //    y = event.pageY - startY;
            //    x = event.pageX - startX;
            //    element.css({
            //        top: y + 'px',
            //        left:  x + 'px'
            //    });
            //}
            //
            //function mouseup() {
            //    $document.unbind('mousemove', mousemove);
            //    $document.unbind('mouseup', mouseup);
            //}
        //}
    };
};

DraggableDirectiveController.$inject = ['$element', '$document'];
