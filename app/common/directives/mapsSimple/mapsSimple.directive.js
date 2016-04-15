import { reject, find, filter, startsWith } from 'lodash';
import './mapsSimple.directive.scss';

import template from './mapsSimple.directive.html';


class mapsSimpleDirectiveController {
    constructor($scope, $element, videoGeneration, $http, $document, $q) {
        this.$scope = $scope;
        this.$element = $element;
        this.$q = $q;
        this.map = '';
        this.number = 0;
        this.id = "markers-" + this.number;
        this.videoGeneration = videoGeneration;
        this.$http = $http;
        this.$document = $document;
        this.geocoder = new mapboxgl.Geocoder();
        this.blob = '';

        this.$http.get('../../../assets/countries.geojson').success((data) => {
            this.data  = data.features;
        });

        // Make an image out of it
        $scope.$watch('vm.isReady', (value) => {
            if (!value) return;
            if (this.isReady) {

                this.isReady = !this.isReady;

                this.takeMapScreenshot().then((target) => {
                    this.videoGeneration.takeScreenshot(target, true);
                });
            }
        });

        this.instantiateToken().then((token)=> {
            this.instantiateMap(token.data.token);
        });

    }

    instantiateToken() {
        let token = this.$http.get('api/env');
        var deferred = this.$q.defer();
        deferred.resolve(token);
        return deferred.promise;
    }

    instantiateMap(token) {
        mapboxgl.accessToken = token;

        this.map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/vrtstartup/cilcbtvj2003ubekq19m2azeb', //hosted style id
            center: [4, 51], // starting position
            zoom: 6, // starting zoom
            preserveDrawingBuffer: true,
        });

        //this.map.addControl(this.geocoder);

        // set view to this place
        this.map.doubleClickZoom.disable();

        this.map.on('mousemove', (e) => {
            this.MarkerLat = JSON.stringify(e.lngLat.lat);
            this.MarkerLng = JSON.stringify(e.lngLat.lng);
            // get data of the country
            this.features = this.map.queryRenderedFeatures(e.point);
        });

        this.instantiateGeocoder();

    }

    instantiateGeocoder() {
        console.log('instantiateGeocoder');
        var geocoder = new mapboxgl.Geocoder();

        this.map.addControl(geocoder);

        geocoder.on('result', (ev) => {

            let lng = ev.result.geometry.coordinates[0];
            let lat = ev.result.geometry.coordinates[1];

            this.setMarker(lat, lng);
        });
    }

    takeMapScreenshot() {
        let data = this.map.getCanvas().toDataURL('image/png', 1.0);

        this.blob = data;

        let map = angular.element( document.querySelector( '#map' ) );
        map.remove();

        let target = angular.element(this.$document[0].querySelector('#map-img'));

        var deferred = this.$q.defer();
        deferred.resolve(target);
        return deferred.promise;
    }

    getMatches(searchText) {
        this.filteredResult = filter(this.data, (o) => {
            return startsWith(o.properties.ADMIN, searchText);;
        });
        return this.filteredResult;
    }

    colourCountry(selected) {
        let newObj = {
            'type': 'geojson',
            'data': selected
        };

        let id = selected.properties.ISO_A3;

        JSON.stringify(newObj);

        this.map.addSource(id, newObj);

        this.map.addLayer({
            "id": id,
            "type": "line",
            "source": id,
            "source-layer": "contour",
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#FFE83E",
                "line-width": 1
            }

        });
    }

    setMarker(lat, lng) {
        this.number = this.number + 1;

        this.id = 'markers'+this.number;
        console.log('Marker', this.id);


        this.map.addSource(this.id, {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lng, lat]
                    },
                    "properties": {
                        "marker-symbol": "icon"
                    }
                }]
            }
        });

        this.map.addLayer({
            "id": "cluster-" + this.id,
            "type": "symbol",
            "source": this.id,
            "layout": {
                "icon-image": "{marker-symbol}",
                "text-field": "{title}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            }
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
            mapId: '=',
            zoomLevel: '=',
            place: '=',
            isReady: '=',
        },
    };
};

mapsSimpleDirectiveController.$inject = ['$scope', '$element', 'videoGeneration', '$http', '$document', '$q'];