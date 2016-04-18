import { reject, find, filter, startsWith, hasIn } from 'lodash';
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
        //this.geocoder = new mapboxgl.Geocoder();
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
            style: 'mapbox://styles/vrtstartup/cimqdw4q400ttd2npni07vcwu', //hosted style id
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
        let searchBar = angular.element( document.querySelector( '#searchbar' ) );
        searchBar.addClass('invisible');
        map.remove();

        let target = angular.element(this.$document[0].querySelector('#map-img'));
        target.addClass('map-img');

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

    colorCountry(selected) {

        if(!selected) return;

        let newObj = {
            'type': 'geojson',
            'data': selected
        };

        let id = selected.properties.ISO_A3;
        JSON.stringify(newObj);

        if ( !hasIn(this.map.style._layers, id)) {

            this.map.addSource(id, newObj);

            this.map.addLayer({
                "id": id,
                "type": "fill",
                "source": id,
                "source-layer": "contour",
                "paint": {
                    'fill-color': '#fff',
                },
            });
        } else {
            this.map.removeLayer(id);
        }

    }

    setMarker(lat, lng) {
        this.number = this.number + 1;

        this.id = 'markers'+this.number;
        console.log('Marker', lat, lng);


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
                }]
            }
        });

        this.map.addLayer({
            "id": "cluster-" + this.id,
            "type": "circle",
            "source": this.id,
            "paint": {
                "circle-color": '#FEFD3A',
                "circle-radius": 3
            },
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