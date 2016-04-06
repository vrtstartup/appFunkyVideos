import { reject, find, filter, startsWith } from 'lodash';
import './mapsSimple.directive.scss';

import template from './mapsSimple.directive.html';

L.mapbox.accessToken = 'pk.eyJ1IjoidnJ0c3RhcnR1cCIsImEiOiJjaWV2MzY0NzcwMDg2dHBrc2M4cTV0eWYzIn0.jEUwUMy1fZtFEHgVQZ2P8A';
mapboxgl.accessToken = 'pk.eyJ1IjoidnJ0c3RhcnR1cCIsImEiOiJjaWV2MzY0NzcwMDg2dHBrc2M4cTV0eWYzIn0.jEUwUMy1fZtFEHgVQZ2P8A';

class mapsSimpleDirectiveController {
    constructor($scope, $log, $element, FileSaver, videoGeneration, $http) {
        this.$scope = $scope;
        this.$log = $log;
        this.$element = $element;
        this.map = '';
        this.number = 0;
        this.id = "markers-" + this.number;
        this.videoGeneration = videoGeneration;
        this.$http = $http;
        this.geocoder = new mapboxgl.Geocoder();



        this.$http.get('../../../assets/countries.geojson').success((data) => {
            console.log('Great success!', data);
            this.data  = data.features;
        });

        // Make an image out of it
        $scope.$watch('vm.isReady', (value) => {
            if (!value) return;
            if (this.isReady) {

                let data = this.map.getCanvas().toDataURL('image/png', 1.0);
                let blob = this.videoGeneration._dataURItoBlob(data);

                FileSaver.saveAs(blob, 'template.png');
                this.isReady = !this.isReady;
            }
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

            //var features = this.map.queryRenderedFeatures(e.point, { layers: ['markers1'] });
            //this.map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

            // get data of the country
            this.features = this.map.queryRenderedFeatures(e.point);
            //console.log('Features', this.features[0].properties.name_en);
        });
    }

    getMatches(searchText) {
        //console.log('getMatches(searchText)', searchText);
        this.filteredResult = filter(this.data, (o) => {
            return startsWith(o.properties.ADMIN, searchText);;
        });
        //console.log('I find this:', this.filteredResult);
        return this.filteredResult;
    }

    colourCountry(selected) {
        console.log('Selected country', selected);
        let newObj = {
            'type': 'geojson',
            'data': selected
        };

        let id = selected.properties.ISO_A3;

        JSON.stringify(newObj);

        this.map.addSource(id, newObj);

        //console.log('Great success!', this.result);

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
                "line-color": "#ff69b4",
                "line-width": 1
            }

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

        console.log('Geocoder data', data);

        //if (data.lbounds) {
        //    this.map.fitBounds(data.lbounds);
        //} else if (data.latlng) {
        //    this.loadMap(data.latlng[0], data.latlng[1]);
        //}
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

    //removeMarker(mrkr) {
    //
    //    this.map.removeLayer(mrkr);
    //
    //    this.markers = reject(this.markers, (marker) => {
    //        return marker._leaflet_id === mrkr._leaflet_id;
    //    });
    //}
    //
    //updateIcon(options, icontoupdate){
    //    console.log('Options', options);
    //    icontoupdate.options.icon.options.iconUrl = options;
    //}
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

mapsSimpleDirectiveController.$inject = ['$scope', '$log', '$element', 'FileSaver', 'videoGeneration', '$http'];