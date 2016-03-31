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
            //this.map.setView([this.lat, this.lng], this.zoomLevel);
            this.loadMap(this.lat, this.lng);
        });

        $scope.$watch('vm.lng', (value) => {
            if (!value) return;
            //this.map.setView([this.lat, this.lng], this.zoomLevel);
            this.loadMap(this.lat, this.lng);
        });

        // init map
        this.map = L.mapbox.map(this.$element[0].children.map, 'mapbox.streets')
            .addControl(L.mapbox.geocoderControl('mapbox.places', {
                autocomplete: true
            }))
            .addControl(L.mapbox.shareControl());

        geocoder.query('Chester, NJ', this.showMap.bind(this));

        this.map.on('click', (e) => {
            console.log('e.point & e.lngLat', e.latlng.lat, e.latlng.lng);
            this.MarkerLat = e.latlng.lat;
            this.MarkerLng = e.latlng.lng;
        });

    }

    loadMap(lat, lng) {

        this.map.setView([this.lat, this.lng], 13);

        L.marker([lat, lng], {
            icon: L.mapbox.marker.icon({
                'marker-size': 'large',
                'marker-symbol': 'bus',
                'marker-color': '#fa0'
            }),
            draggable: true
        }).addTo(this.map);

        console.log('MARKERS are here: ', this.map._layers);

    }

    showMap(err, data) {
       console.log('showMap', this.map);
        // The geocoder can return an area, like a city, or a
        // point, like an address. Here we handle both cases,
        // by fitting the map bounds to an area or zooming to a point.

        if (data.lbounds) {
            console.log('data.lbounds', data.lbounds._northEast.lat);
            this.map.fitBounds(data.lbounds);
            //this.loadMap(data.lbounds._northEast.lat, data.lbounds._northEast.lng);
        } else if (data.latlng) {
            console.log('data.latlng', data.latlng);

            //this.map.setView([data.latlng[0], data.latlng[1]], 13);
            this.loadMap(data.latlng[0], data.latlng[1]);
        }
    }

    setMarker(lat, lng) {
        console.log('setting marker');
        L.marker([lat, lng], {
            icon: L.mapbox.marker.icon({
                'marker-size': 'large',
                'marker-symbol': 'bus',
                'marker-color': '#fa0'
            }),
            draggable: true
        }).addTo(this.map);
    }

    //removeMarker(marker) {
    //    console.log('removing',  L.marker);
    //    this.map.removeLayer(marker);
    //}
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
            //markers: '=',
            isReady: '=',
        },
    };
};

mapsSimpleDirectiveController.$inject = ['$scope', '$log', '$element', 'FileSaver', 'videoGeneration'];