import { reject } from 'lodash';
import './mapsSimple.directive.scss';

import template from './mapsSimple.directive.html';

L.mapbox.accessToken = 'pk.eyJ1IjoidnJ0c3RhcnR1cCIsImEiOiJjaWV2MzY0NzcwMDg2dHBrc2M4cTV0eWYzIn0.jEUwUMy1fZtFEHgVQZ2P8A';
mapboxgl.accessToken = 'pk.eyJ1IjoidnJ0c3RhcnR1cCIsImEiOiJjaWV2MzY0NzcwMDg2dHBrc2M4cTV0eWYzIn0.jEUwUMy1fZtFEHgVQZ2P8A';

class mapsSimpleDirectiveController {
    constructor($scope, $log, $element, FileSaver, videoGeneration) {
        this.$scope = $scope;
        this.$log = $log;
        this.$element = $element;
        this.map = '';
        let geocoder = L.mapbox.geocoder('mapbox.places');
        this.number = 0;
        this.markers = [];
        this.videoGeneration = videoGeneration;

        // Make an image out of it
        $scope.$watch('vm.isReady', (value) => {
            if (!value) return;
            if (this.isReady) {
                //leafletImage(this.map, (err, canvas) => {
                    // get blob and save it directly to user's computer
                    //let data = this.videoGeneration._dataURItoBlob(canvas.toDataURL('image/png', 1.0));
                let data = this.map.getCanvas().toDataURL('image/png', 1.0);
                let blob = this.videoGeneration._dataURItoBlob(data);

                console.log('DATA', data);
                FileSaver.saveAs(blob, 'template.png');
                //});
                this.isReady = !this.isReady;
            }
        });

        //$scope.$watch('vm.lat', (value) => {
        //    if (!value) return;
        //    this.loadMap();
        //});
        //
        //$scope.$watch('vm.lng', (value) => {
        //    if (!value) return;
        //    this.loadMap();
        //});

        $scope.$watch('vm.place', (value) => {
            if(!value) return;
            console.log('vm.place', this.place);
            geocoder.query(this.place, this.showMap.bind(this));
        });

        // init map
        //this.map = L.mapbox.map(this.$element[0].children.map, '')
        //    .addControl(L.mapbox.geocoderControl('mapbox.places', {
        //        autocomplete: true
        //    }))
        //    .addControl(L.mapbox.shareControl());
        this.map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/vrtstartup/cilcbtvj2003ubekq19m2azeb', //hosted style id
            center: [4, 51], // starting position
            zoom: 6, // starting zoom
            preserveDrawingBuffer: true,
        });

        // set view to this place
        geocoder.query(this.place, this.showMap.bind(this));
        this.map.doubleClickZoom.disable();

        //var featureLayer = L.mapbox.featureLayer()
        //    .loadURL('../../../assets/countries.geojson')
        //    .addTo(this.map);


        // set marker on click
        this.map.on('mousemove', (e) => {
            this.MarkerLat = JSON.stringify(e.lngLat.lat);
            this.MarkerLng =  JSON.stringify(e.lngLat.lng);
            //console.log('Latitude',  JSON.stringify(e.lngLat.lat));
        });

        //this.iconOptions = [{
        //    iconName: 'pin',
        //    iconUrl: "http://a.tiles.mapbox.com/v4/marker/pin-l-1+fa0@2x.png?access_token=pk.eyJ1IjoidnJ0c3RhcnR1cCIsImEiOiJjaWV2MzY0NzcwMDg2dHBrc2M4cTV0eWYzIn0.jEUwUMy1fZtFEHgVQZ2P8A",
        //},
        //    {
        //        iconName: 'cafe',
        //        iconUrl: "http://a.tiles.mapbox.com/v4/marker/pin-l-cafe+fa0@2x.png?access_token=pk.eyJ1IjoidnJ0c3RhcnR1cCIsImEiOiJjaWV2MzY0NzcwMDg2dHBrc2M4cTV0eWYzIn0.jEUwUMy1fZtFEHgVQZ2P8A",
        //    }
        //];
        //this.popup = new L.Popup({ autoPan: false });

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
        console.log('Marker');
        this.number = this.number + 1;
        //this.markers.push(L.marker([lat, lng], {
        //    icon: L.mapbox.marker.icon({
        //        'marker-size': 'large',
        //        'marker-symbol': this.number,
        //        'marker-color': '#fa0'
        //    }),
        //    draggable: true,
        //    title: "this is icon #" + this.number,
        //    description: 'This marker has a description',
        //}).addTo(this.map));

        //
        //let geojsonFeature = {
        //    "type": "Feature",
        //    "properties": {
        //        "name": "Coors Field",
        //        "amenity": "Baseball Stadium",
        //        "popupContent": "This is where the Rockies play!"
        //    },
        //    "geometry": {
        //        "type": "Point",
        //        "coordinates": [lat, lng],
        //        "point-transform":"translate(20,-40)"
        //    }
        //};
        //L.geoJson(geojsonFeature).addTo(this.map);
        //
        //
        //
        //geojsonFeature.features[0].geometry.coordinates.push([lat, lng]);

        this.map.addSource("markers", {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [4, 50]
                    },
                    "properties": {
                        "title": "Mapbox DC",
                        "marker-symbol": "monument"
                    }
                }, {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lng, lat]
                    },
                    "properties": {
                        "title": "Mapbox SF",
                        "marker-symbol": "harbor"
                    }
                }]
            }
        });

        this.map.addLayer({
            "id": "markers",
            "type": "symbol",
            "source": "markers",
            "layout": {
                "icon-image": "{marker-symbol}-15",
                "text-field": "{title}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            }
        });

    }

    removeMarker(mrkr) {

        this.map.removeLayer(mrkr);

        this.markers = reject(this.markers, (marker) => {
            return marker._leaflet_id === mrkr._leaflet_id;
        });
    }

    updateIcon(options, icontoupdate){
        console.log('Options', options);
        icontoupdate.options.icon.options.iconUrl = options;
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