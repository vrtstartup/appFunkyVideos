import { reject, find, filter, startsWith } from 'lodash';
import './mapsSimple.directive.scss';

import template from './mapsSimple.directive.html';

L.mapbox.accessToken = 'pk.eyJ1IjoidnJ0c3RhcnR1cCIsImEiOiJjaWV2MzY0NzcwMDg2dHBrc2M4cTV0eWYzIn0.jEUwUMy1fZtFEHgVQZ2P8A';
mapboxgl.accessToken = 'pk.eyJ1IjoidnJ0c3RhcnR1cCIsImEiOiJjaWV2MzY0NzcwMDg2dHBrc2M4cTV0eWYzIn0.jEUwUMy1fZtFEHgVQZ2P8A';

class mapsSimpleDirectiveController {
    constructor($scope, $log, $element, FileSaver, videoGeneration, $http, $document) {
        this.$scope = $scope;
        this.$log = $log;
        this.$element = $element;
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

                let data = this.map.getCanvas().toDataURL('image/png', 1.0);
                let blob = this.videoGeneration._dataURItoBlob(data);

                this.blob = data;

                //FileSaver.saveAs(blob, 'template.png');

                let target = angular.element(this.$document[0].querySelector('#map-img'));

                console.log('Target', target);
                this.videoGeneration.takeScreenshot(target, true);

                this.isReady = !this.isReady;
            }
            //if (this.isReady) {
            //    let target = angular.element(this.$document[0].querySelector('#map'));
            //    console.log('Element', target);
            //
            //    this.videoGeneration.takeScreenshot(target, true);
            //
            //    this.isReady = !this.isReady;
            //}
        });


        $scope.$watch('vm.place', (value) => {
            if(!value) return;
            console.log('vm.place', this.place);
            this.geocoder.query(this.place, this.showMap.bind(this));
        });


        this.map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/vrtstartup/cilcbtvj2003ubekq19m2azeb', //hosted style id
            center: [4, 51], // starting position
            zoom: 6, // starting zoom
            preserveDrawingBuffer: true,
        });

        this.map.addControl(this.geocoder);

        // set view to this place
        this.map.doubleClickZoom.disable();


        // set marker on click
        this.map.on('mousemove', (e) => {
            this.MarkerLat = JSON.stringify(e.lngLat.lat);
            this.MarkerLng =  JSON.stringify(e.lngLat.lng);

            // get data of the country
            this.features = this.map.queryRenderedFeatures(e.point);
        });
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


    addLabel(title) {
        console.log('AddLabel', title);
        let el = angular.element('<div class="map-label">'+title+'</div>');
        let target = angular.element(this.$document[0].querySelector('#map-img'));

        target.append(el);
    }

    setMarker(lat, lng) {
        this.number = this.number + 1;

        this.id = 'markers'+this.number;
        console.log('Marker', this.id);


        this.map.addSource(this.id , {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [ {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lng, lat]
                    },
                    "properties": {
                        "title": "Mapbox SF",
                        //"description": '<div class="marker-title">Make it Mount Pleasant</div><p> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
                        //"marker-symbol": "harbor"
                    }
                }]
            }
        });

        this.map.addLayer({
            "id": "cluster-" + this.id,
            "type": "circle",
            "source": this.id,
            "paint": {
                "circle-color": '#FFE83E',
                "circle-radius": 8
            }
        });

        this.map.addLayer({
            "id": "cluster-count",
            "type": "symbol",
            "source": this.id,
            "layout": {
                "text-font": [
                    "DIN Offc Pro Medium",
                    "Arial Unicode MS Bold"
                ],
                "text-size": 12,
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
            lat: '=',
            lng: '=',
            mapId: '=',
            zoomLevel: '=',
            place: '=',
            isReady: '=',
        },
    };
};

mapsSimpleDirectiveController.$inject = ['$scope', '$log', '$element', 'FileSaver', 'videoGeneration', '$http', '$document'];