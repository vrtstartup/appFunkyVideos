import template from './mapsSimple.directive.html';

L.mapbox.accessToken = 'pk.eyJ1IjoidnJ0c3RhcnR1cCIsImEiOiJjaWV2MzY0NzcwMDg2dHBrc2M4cTV0eWYzIn0.jEUwUMy1fZtFEHgVQZ2P8A';

class mapsSimpleDirectiveController {
    constructor($scope, $log, $element) {
        console.log($element);
        this.$scope = $scope;
        this.$log = $log;
        this.$element = $element;
        this.map = '';


        // Make an image out of it
        $scope.$watch('vm.isReady', (value) => {
            if (!value) return;
            if (this.isReady) {
                leafletImage(this.map, (err, canvas) => {
                    var img = document.createElement('img');
                    var dimensions = this.map.getSize();
                    img.width = dimensions.x;
                    img.height = dimensions.y;
                    img.src = canvas.toDataURL();

                    $element[0].children.image.innerHTML = '';
                    $element[0].children.image.appendChild(img);
                });

                this.isReady = !this.isReady;
            }
        });

        $scope.$watch('vm.lat', (value) => {
            this.map.setView([this.lat, this.lng], this.zoomLevel);
        });

        $scope.$watch('vm.long', (value) => {
            this.map.setView([this.lat, this.lng], this.zoomLevel);
        });

        this.loadMap();

    }

    loadMap() {
        let map = L.mapbox.map(this.$element[0].children.map, 'mapbox.streets')
            .addControl(L.mapbox.shareControl());

        this.map = map;

        if (!this.markers) {
            this.markers.forEach(function(marker) {
                L.marker(marker, {
                    icon: L.mapbox.marker.icon({
                        'marker-size': 'large',
                        'marker-symbol': 'town-hall',
                        'marker-color': '#fa0'
                    })
                }).addTo(map);
            });
        }

    }
}

export const mapsSimpleDirective = function() {
    return {
        restrict: 'AE',
        template: template,
        scope: {},
        controller: mapsSimpleDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            lat: '=',
            lng: '=',
            mapId: '=',
            zoomLevel: '=',
            markers: '=',
            isReady: '=',
        },
    };
};

mapsSimpleDirectiveController.$inject = ['$scope', '$log', '$element'];