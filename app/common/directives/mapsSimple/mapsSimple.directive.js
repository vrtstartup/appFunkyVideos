import { reject } from 'lodash';

import template from './mapsSimple.directive.html';

L.mapbox.accessToken = 'pk.eyJ1IjoidnJ0c3RhcnR1cCIsImEiOiJjaWV2MzY0NzcwMDg2dHBrc2M4cTV0eWYzIn0.jEUwUMy1fZtFEHgVQZ2P8A';

class mapsSimpleDirectiveController {
    constructor($scope, $log, $element, FileSaver, videoGeneration) {
        this.$scope = $scope;
        this.$log = $log;
        this.$element = $element;
        this.map = '';
        this.videoGeneration = videoGeneration;
        let geocoder = L.mapbox.geocoder('mapbox.places');
        this.number = 0;
        this.markers = [];

        // Make an image out of it
        $scope.$watch('vm.isReady', (value) => {
            if (!value) return;
            if (this.isReady) {
                leafletImage(this.map, (err, canvas) => {
                    // get blob and save it directly to user's computer
                    let data = this.videoGeneration._dataURItoBlob(canvas.toDataURL('image/png', 1.0));
                    FileSaver.saveAs(data, 'template.png');
                });
                this.isReady = !this.isReady;
            }
        });

        $scope.$watch('vm.lat', (value) => {
            if (!value) return;
            this.loadMap();
        });

        $scope.$watch('vm.lng', (value) => {
            if (!value) return;
            this.loadMap();
        });

        $scope.$watch('vm.place', (value) => {
            if(!value) return;
            console.log('vm.place', this.place);
            geocoder.query(this.place, this.showMap.bind(this));
        })

        // init map
        this.map = L.mapbox.map(this.$element[0].children.map, 'mapbox.streets')
            .addControl(L.mapbox.geocoderControl('mapbox.places', {
                autocomplete: true
            }))
            .addControl(L.mapbox.shareControl());

        // set view to this place
        geocoder.query(this.place, this.showMap.bind(this));

        // set marker on click
        this.map.on('mousemove', (e) => {
            this.MarkerLat = e.latlng.lat;
            this.MarkerLng = e.latlng.lng;
        });

    }

    loadMap() {

        this.map.setView([this.lat, this.lng], 13);

        console.log('MARKERS are here: ', this.map._layers);

    }

    showMap(err, data) {
        if (err) {
            console.log('Error is occured:', err);
            return;
        }
        // The geocoder can return an area, like a city, or a
        // point, like an address. Here we handle both cases,
        // by fitting the map bounds to an area or zooming to a point.
        if (data.lbounds) {
            this.map.fitBounds(data.lbounds);
        } else if (data.latlng) {
            this.loadMap(data.latlng[0], data.latlng[1]);
        }
    }

    setMarker(lat, lng) {
        this.number = this.number + 1;
        this.markers.push(L.marker([lat, lng], {
            icon: L.mapbox.marker.icon({
                'marker-size': 'large',
                'marker-symbol': this.number,
                'marker-color': '#fa0'
            }),
            draggable: true,
            title: "this is icon #" + this.number
        }).addTo(this.map));
    }

    removeMarker(mrkr) {
        this.map.removeLayer(mrkr);

        this.markers = reject(this.markers, (marker) => {
            return marker._leaflet_id === mrkr._leaflet_id;
        });
    }
}

export const mapsSimpleDirective = function() {
    return {
        restrict: 'AE',
        template: template,
        scope: {},
        controller: mapsSimpleDirectiveController,
        controllerAs: 'vm',
        replace: true,
        bindToController: {
            lat: '=',
            lng: '=',
            mapId: '=',
            zoomLevel: '=',
            place: '=',
            isReady: '=',
        },
    };
};

mapsSimpleDirectiveController.$inject = ['$scope', '$log', '$element', 'FileSaver', 'videoGeneration'];