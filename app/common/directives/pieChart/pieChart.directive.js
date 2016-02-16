import './pieChart.directive.scss';
import template from './pieChart.directive.html';

class pieChartDirectiveController {
    constructor($scope, $log, $parse, $window, $element, $document) {
        this.$log = $log;
        this.$parse = $parse;
        this.$window = $window;
        this.$element = $element;

        //var data = [
        //    {"title": "1", "data": 33},
        //    {"title": "2", "data": 17},
        //    //{"title": "3", "data": 20},
        //    //{"title": "4", "data": 30}
        //];

        //this.piechart($element, data);


        //let paths = $document.find('path');

        $scope.$watch('vm.isAnimated', (value) => {
            if (value) {
                console.log('pieChartDATA', this.chartData);
                this.piechart($element, this.chartData);
                TweenMax.to($element, 1, {rotation:360, transformOrigin:"150px 150px"});

                console.log('value changed', value);
            } else {
                console.log('value changed', value);
                TweenMax.to($element, 1, {rotation:0, transformOrigin:"150px 150px"});
            }
        }, true);
    }


    segmentColour(i) {
        return {
            '1': '#36a25c',
            '2': '#345f5f',
            //'3': '#a9e536',
            //'4': '#0594cf'
        }[i];
    }

    piechart(element, data) {

        const dimensions = { width: 300, height: 300 };
        dimensions.r = Math.min(dimensions.width, dimensions.height)/2;

        let svg = d3.select(element[0])
            .append("svg")
            .attr("class", "pieChart")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
            .append("g")
            .attr("transform", "translate(" + dimensions.width/2 + "," + dimensions.height/2+")");

        let arc = d3.svg.arc().outerRadius(dimensions.r - 10).innerRadius(30);

        let pie = d3.layout.pie().sort(null).value(function(d) { return d.data });

        svg.selectAll("li")
           .data(pie(data))
           .enter()
           .append("path").attr("d", arc).attr("fill-rule", "evenodd")
           .style("fill", (d) => { return this.segmentColour(d.data.nb); } );
    }

}

export const pieChartDirective = function() {
    return {
        restrict: 'EA',
        template: template,
        scope: {},
        controller: pieChartDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            chartData: '=',
            isAnimated: '=',
        },
    };

};

pieChartDirectiveController.$inject = ['$scope', '$log', '$parse', '$window', '$element', '$document'];
