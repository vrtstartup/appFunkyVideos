import './pieChart.directive.scss';
import template from './pieChart.directive.html';

class pieChartDirectiveController {
    constructor($scope, $log, $parse, $window, $element) {
        this.$log = $log;
        this.$parse = $parse;
        this.$window = $window;
        this.$element = $element;

        var data = [
            {"title": "Segment One", "data": 33, "color" : '#36a25c'},
            {"title": "Segment Two", "data": 67, "color" : '#345f5f'},
            {"title": "Segment Three", "data": 25},
            {"title": "Segment Four", "data": 78}
        ];

        this.piechart($element, data);

        $log.info('ctrl pieChartDirectiveController', this.chartData);
    }


    segmentColour(i) {
        return {
            'Segment One': '#36a25c',
            'Segment Two': '#345f5f',
            'Segment Three': '#a9e536'
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

        let arc = d3.svg.arc().outerRadius(dimensions.r - 10).innerRadius(0);

        let pie = d3.layout.pie().sort(null).value(function(d) { return d.data });

        svg.selectAll("li")
           .data(pie(data))
           .enter()
           .append("path").attr("d", arc)
           .style("fill", (d) => { return this.segmentColour(d.data.title); } );
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
        },
    };

};

pieChartDirectiveController.$inject = ['$scope', '$log', '$parse', '$window', '$element'];
