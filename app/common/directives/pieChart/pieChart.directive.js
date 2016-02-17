import './pieChart.directive.scss';
import template from './pieChart.directive.html';

class pieChartDirectiveController {
    constructor($scope, $log, $parse, $window, $element, $document) {
        this.$log = $log;
        this.$parse = $parse;
        this.$window = $window;
        this.$element = $element;


        $scope.$watch('vm.isAnimated', (value) => {
            if (value) {
                console.log('pieChartDATA', this.chartData);
                this.piechart($element, this.chartData);
                //TweenMax.to($element, 1, {rotation:360, transformOrigin:"150px 150px"});

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
            '3': '#666666',
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
            .attr("class", "slices")
            .attr("transform", "translate(" + dimensions.width/2 + "," + dimensions.height/2+")");

        let arc = d3.svg.arc().outerRadius(dimensions.r - 10).innerRadius(80);

        let pie = d3.layout.pie().sort(d3.descending).value(function(d) { return d.data });

        svg.selectAll("li")
           .data(pie(data))
           .enter()
           .append("path")
           .attr("d", arc)
           .style("fill", (d) => { return this.segmentColour(d.data.nb); } )
            .attr('stroke-width', '25px')
            .attr('transform', (d, i) => 'rotate(-180, 0, 0)')
            .style('opacity', 0)
            .transition()
            .delay((d, i) => (i * 150) + 300)
            .duration(6000)
            .ease('elastic')
            .style('opacity', 1)
            .attr('transform', 'rotate(0,0,0)');

        let slice = svg.select('.slices')
            .datum(data)
            .selectAll('path')
            .data(pie);

        slice.transition()
            .delay((d, i) => arcAnimDur + (i * 150))
            .duration(1000)
            .attr('stroke-width', '1px');
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
