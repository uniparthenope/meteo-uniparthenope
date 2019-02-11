
    App.load('home');
    App.controller('home', function (page) {
        history.pushState('home', null, '#home');
    });

    var oWebViewInterface1 = window.nsWebViewInterface;

    var url_api = "https://api.meteo.uniparthenope.it/";

    var sizeIco = [50, 50];

    var sunny_night_png = L.icon({
        iconUrl: 'meteo_icon/sunny_night.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var shower1_night = L.icon({
        iconUrl: 'meteo_icon/shower1_night.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var shower2_night = L.icon({
        iconUrl: 'meteo_icon/shower2_night.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var shower3_night = L.icon({
        iconUrl: 'meteo_icon/shower3_night.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var cloudy1_night = L.icon({
        iconUrl: 'meteo_icon/cloudy1_night.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var cloudy2_night = L.icon({
        iconUrl: 'meteo_icon/cloudy2_night.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var cloudy3_night = L.icon({
        iconUrl: 'meteo_icon/cloudy3_night.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var cloudy4_night = L.icon({
        iconUrl: 'meteo_icon/cloudy4_night.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var cloudy5_night = L.icon({
        iconUrl: 'meteo_icon/cloudy5_night.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var sunny = L.icon({
        iconUrl: 'meteo_icon/sunny.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var cloudy1 = L.icon({
        iconUrl: 'meteo_icon/cloudy2.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var cloudy2 = L.icon({
        iconUrl: 'meteo_icon/cloudy1.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var cloudy3 = L.icon({
        iconUrl: 'meteo_icon/cloudy3.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var cloudy4 = L.icon({
        iconUrl: 'meteo_icon/cloudy4.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var cloudy5 = L.icon({
        iconUrl: 'meteo_icon/cloudy5.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var shower1 = L.icon({
        iconUrl: 'meteo_icon/shower1.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var shower2 = L.icon({
        iconUrl: 'meteo_icon/shower2.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var shower3 = L.icon({
        iconUrl: 'meteo_icon/shower3.png',
        iconSize: sizeIco,
        iconAnchor: [9, 21],
        popupAnchor: [20, -17]
    });

    var img_array = {
        'sunny_night.png': sunny_night_png,
        'shower1_night.png': shower1_night,
        'shower2_night.png': shower2_night,
        'shower3_night.png': shower3_night,
        'cloudy1_night.png': cloudy1_night,
        'cloudy2_night.png': cloudy2_night,
        'cloudy3_night.png': cloudy3_night,
        'cloudy4_night.png': cloudy4_night,
        'cloudy5_night.png': cloudy5_night,
        'cloudy1.png': cloudy1,
        'cloudy2.png': cloudy2,
        'cloudy3.png': cloudy3,
        'cloudy4.png': cloudy4,
        'cloudy5.png': cloudy5,
        'sunny.png': sunny,
        'shower1.png': shower1,
        'shower2.png': shower2,
        'shower3.png': shower3
    };

    var domain = "d01";
    var prefix = "reg";
    var map = null;
    var zoom = 5;
    var center = new L.LatLng(40.85, 14.28);
    var controlLayers = null;
    var overlayMaps = {};
    var windLayer = null;
    var cloudLayer = null;
    var rainLayer = null;
    var snowLayer = null;
    var infoLayer = null;
    var currData = null;

    var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: ''
    });

    var Esri_DarkGreyCanvas = L.tileLayer("https://{s}.sm.mapstack.stamen.com/" + "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" + "{z}/{x}/{y}.png", {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, ' + 'NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    });

    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    var baseLayers = {
        "Satellite": Esri_WorldImagery,
        "Grey Canvas": Esri_DarkGreyCanvas,
        "Open Street Map": osmLayer
    };

    function change_domain(bounds) {
        var new_prefix = "reg";
        if (zoom >= 0 && zoom <= 6) {
            new_prefix = 'reg';
        } else if (zoom >= 7 && zoom <= 10) {
            new_prefix = 'prov';
        } else {
            new_prefix = 'com';
        }
        //console.log("new_prefix:"+new_prefix);

        if (new_prefix != prefix) {
            prefix = new_prefix;
            addInfoLayer();
        }

        //console.log("domain:"+domain);
        var new_domain = "d01";
        var boundsD01 = L.latLngBounds(L.latLng(27.64, -19.68), L.latLng(63.48, 34.80));
        var boundsD02 = L.latLngBounds(L.latLng(34.40, 3.58), L.latLng(47.83, 22.26));
        var boundsD03 = L.latLngBounds(L.latLng(39.15, 13.56), L.latLng(41.62, 16.31));

        if (boundsD03.contains(bounds)) {
            new_domain = "d03";
        } else if (boundsD02.contains(bounds)) {
            new_domain = "d02";
        } else {
            new_domain = "d01";
        }
        //console.log("new_domain:"+new_domain);

        if (new_domain != domain) {
            domain = new_domain;
            addWindLayer();
            addCloudLayer();
            addRainLayer();
            addInfoLayer();
        }
    }

    function addInfoLayer() {
        var geojsonURL = url_api + 'apps/owm/wrf5/' + prefix + '/{z}/{x}/{y}.geojson?date=' + currData;

        if (infoLayer != null) {
            controlLayers.removeLayer(infoLayer);
            map.removeLayer(infoLayer);
        }

        infoLayer = L.tileLayer("", {}).on("tileload", function (event) {
            fetch(L.Util.template(geojsonURL, event.coords)).then(a => a.ok ? a.json() : null).then(geojson => {
                if (!geojson || !this._map) return;

                event.tile.geojson = L.geoJSON(geojson,
                    {
                        style: function (geojson) {
                            return {
                                "clickable": true,
                                "color": "#00D",
                                "fillColor": "#00D",
                                "weight": 1.0,
                                "opacity": 0.3,
                                "fillOpacity": 0.2
                            };
                        },
                        pointToLayer: function (features, latlng) {
                            var file = features.properties.icon;
                            //console.log(file);
                            return L.marker(latlng, {icon: img_array[file]});
                        },
                        onEachFeature: function (feature, layer) {
                            if (feature.properties) {
                                //console.log(feature.properties.wd10);
                                country = feature.properties.country;
                                city = feature.properties.name;
                                id = feature.properties.id;
                                clouds = parseInt(feature.properties.clf * 100); //clouds
                                dateTime = feature.properties.dateTime;
                                humidity = feature.properties.rh2; //umidity
                                pressure = feature.properties.slp; //pressure
                                temp = feature.properties.t2c; //temp
                                text = feature.properties.text;
                                wind_direction = feature.properties.wd10; // wind_deg
                                wind_speed = feature.properties.ws10n; //wind_speed
                                wind_chill = feature.properties.wchill; //wind_chill
                                winds = feature.properties.winds; //winds

                                popupString = "<div class='popup'>" +
                                    "<table class='tg' style='undefined;table-layout: fixed; width: 230px'>" +
                                    "<colgroup>" +
                                    "<col style='width: 85px'>" +
                                    "<col style='width: 60px'>" +
                                    "</colgroup>" +
                                    "<tr>" +
                                    "<th class='tg-baqh' colspan='2'>" + city + "</th>" +
                                    "</tr>" +
                                    "<tr>" +
                                    "<td class='tg-7un6'>COUNTRY</td>" +
                                    "<td class='tg-7un6'>" + country + "</td>" +
                                    "</tr>";

                                //creazione popup place

                                popupString +=
                                    "<tr>" +
                                    "<td class='tg-j0tj'>TEMP</td>" +
                                    "<td class='tg-j0tj'>" + temp + " C</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                    "<td class='tg-7un6'>METEO</td>" +
                                    "<td class='tg-7un6'>" + text + "</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                    "<td class='tg-j0tj'>CLOUDS</td>" +
                                    "<td class='tg-j0tj'>" + clouds + "%</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                    "<td class='tg-7un6'>HUMIDITY</td>" +
                                    "<td class='tg-7un6'>" + humidity + "%</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                    "<td class='tg-j0tj'>PRESSURE</td>" +
                                    "<td class='tg-j0tj'>" + pressure + " HPa</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                    "<td class='tg-7un6'>WIND DIRECTION</td>" +
                                    "<td class='tg-7un6'>" + wind_direction + " N</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                    "<td class='tg-j0tj'>WIND SPEED</td>" +
                                    "<td class='tg-j0tj'>" + wind_speed + " knt</td>" +
                                    "</tr>" +
                                    "<td class='tg-7un6'>WIND CHILL</td>" +
                                    "<td class='tg-7un6'>" + wind_chill + " *C</td>" +
                                    "</tr>" +
                                    "<td class='tg-j0tj'>WIND</td>" +
                                    "<td class='tg-j0tj'>" + winds + "</td>" +
                                    "</tr>" +
                                    "</table>" +
                                    "</div>";

                                popupString += "</table>" + "</div>";

                                layer.bindPopup(popupString);
                            }
                        }

                    }).addTo(map);
            });
        })
            .on("tileunload", function (event) {
                if (event.tile.geojson && map)
                    map.removeLayer(event.tile.geojson);
            });

        map.addLayer(infoLayer);
        controlLayers.addOverlay(infoLayer, "Info");
    }

    function addWindLayer() {
        if (windLayer != null) {
            controlLayers.removeLayer(windLayer);
            map.removeLayer(windLayer);
        }

        $.getJSON(url_api + 'products/wrf5/forecast/' + domain + '/grib/json?date=' + currData, function (data) {
            windLayer = L.velocityLayer({
                displayValues: true,
                displayOptions: {
                    velocityType: 'Wind 10m',
                    position: 'bottomleft',
                    displayPosition: 'bottomleft',
                    displayEmptyString: 'No wind data',
                    angleConvention: 'meteoCW',
                    speedUnit: 'kt'
                },
                data: data,
                maxVelocity: 25.72,
                minVelocity: 0,
                velocityScale: 0.005,
                colorScale: ["#000033", "#0117BA", "#011FF3", "#0533FC", "#1957FF", "#3B8BF4",
                    "#4FC6F8", "#68F5E7", "#77FEC6", "#92FB9E", "#A8FE7D", "#CAFE5A",
                    "#EDFD4D", "#F5D03A", "#EFA939", "#FA732E", "#E75326", "#EE3021",
                    "#BB2018", "#7A1610", "#641610"]
            });

            map.addLayer(windLayer);
            controlLayers.addOverlay(windLayer, 'Wind');
        });
    }

    function addCloudLayer() {
        var anno = currData.substring(0, 4);
        var mese = currData.substring(4, 6);
        var giorno = currData.substring(6, 8);

        if (cloudLayer != null) {
            controlLayers.removeLayer(cloudLayer);
            map.removeLayer(cloudLayer);
        }

        cloudLayer = L.tileLayer.wms('http://data.meteo.uniparthenope.it/ncWMS2/wms/lds/opendap/wrf5/' + domain + '/archive/' + anno + '/' + mese + '/' + giorno + '/wrf5_' + domain + '_' + currData + '.nc', {
                layers: 'CLDFRA_TOTAL',
                styles: 'raster/tcldBars',
                format: 'image/png',
                transparent: true,
                opacity: 0.8,
                COLORSCALERANGE: "0.125,1",
                NUMCOLORBANDS: "250",
                ABOVEMAXCOLOR: "extend",
                BELOWMINCOLOR: "transparent",
                BGCOLOR: "extend",
                LOGSCALE: "false"
            }
        );

        map.addLayer(cloudLayer);
        controlLayers.addOverlay(cloudLayer, "Cloud");
    }

    function addT2CLayer() {
        var anno = currData.substring(0, 4);
        var mese = currData.substring(4, 6);
        var giorno = currData.substring(6, 8);

        if (t2cLayer != null) {
            controlLayers.removeLayer(t2cLayer);
            map.removeLayer(t2cLayer);
        }

        var t2cLayer = L.tileLayer.wms('http://data.meteo.uniparthenope.it/ncWMS2/wms/lds/opendap/wrf5/' + domain + '/archive/' + anno + '/' + mese + '/' + giorno + '/wrf5_' + domain + '_' + currData + '.nc', {
                layers: 'T2C',
                styles: 'default-scalar/tspBars',
                format: 'image/png',
                transparent: true,
                opacity: 0.8,
                COLORSCALERANGE: "-40,50",
                NUMCOLORBANDS: "19",
                ABOVEMAXCOLOR: "extend",
                BELOWMINCOLOR: "extend",
                BGCOLOR: "extend",
                LOGSCALE: "false"
            }
        );

        controlLayers.addOverlay(t2cLayer, "Temperature");
    }

    function addRainLayer() {
        var anno = currData.substring(0, 4);
        var mese = currData.substring(4, 6);
        var giorno = currData.substring(6, 8);

        if (rainLayer != null) {
            controlLayers.removeLayer(rainLayer);
            map.removeLayer(rainLayer);
        }

        rainLayer = L.tileLayer.wms('http://data.meteo.uniparthenope.it/ncWMS2/wms/lds/opendap/wrf5/' + domain + '/archive/' + anno + '/' + mese + '/' + giorno + '/wrf5_' + domain + '_' + currData + '.nc', {
                layers: 'DELTA_RAIN',
                styles: 'raster/crhBars',
                format: 'image/png',
                transparent: true,
                opacity: 0.8,
                COLORSCALERANGE: ".2,60",
                NUMCOLORBANDS: "15",
                ABOVEMAXCOLOR: "extend",
                BELOWMINCOLOR: "transparent",
                BGCOLOR: "extend",
                LOGSCALE: "false"
            }
        );
        controlLayers.addOverlay(rainLayer, "Rain");
    }

    function addSnowLayer() {
        var anno = currData.substring(0, 4);
        var mese = currData.substring(4, 6);
        var giorno = currData.substring(6, 8);

        if (snowLayer != null) {
            controlLayers.removeLayer(snowLayer);
            map.removeLayer(snowLayer);
        }

        snowLayer = L.tileLayer.wms('http://data.meteo.uniparthenope.it/ncWMS2/wms/lds/opendap/wrf5/' + domain + '/archive/' + anno + '/' + mese + '/' + giorno + '/wrf5_' + domain + '_' + currData + '.nc', {
                layers: 'HOURLY_SWE',
                styles: 'raster/sweBars',
                format: 'image/png',
                transparent: true,
                opacity: 0.8,
                COLORSCALERANGE: ".5,15.5",
                NUMCOLORBANDS: "6",
                ABOVEMAXCOLOR: "extend",
                BELOWMINCOLOR: "transparent",
                BGCOLOR: "extend",
                LOGSCALE: "false"
            }
        );
        controlLayers.addOverlay(snowLayer, "Snow");
    }

    oWebViewInterface1.on('data', function (cor) {
        //console.log("Anno: " + cor.anno);
        var anno = cor.anno;
        //console.log("Mese: " + cor.mese);
        var mese = cor.mese;
        //console.log("Giorno: " + cor.giorno);
        var giorno = cor.giorno;
        //console.log("Ora: " + cor.ora);
        var ora = cor.ora;

        currData = anno + "" + mese + "" + giorno + "Z" + ora + "00";
        console.log("Data: " + currData);

        if (map == null) {
            map = new L.Map('map', {zoomControl: false});


            map.setView(center, zoom);

            var layerInstance = Esri_WorldImagery;
            layerInstance.addTo(map);

            map.on('zoomend', function () {
                zoom = map.getZoom();
                change_domain(map.getBounds());
                //console.log(zoom);
            });

            map.on('moveend', function (e) {
                center = map.getBounds().getCenter();
                change_domain(map.getBounds());
                //console.log(center);
            });

            controlLayers = L.control.layers(baseLayers, overlayMaps, {
                    collapsed: true, position: "topright"
                }
            ).addTo(map);
        }

        addInfoLayer();
        addRainLayer();
        addCloudLayer();
        addT2CLayer();
        addSnowLayer();
        addWindLayer();
    });


    oWebViewInterface1.on('prova', function (cor) {
        console.log(cor.data);
        currData = cor.data;
        map.remove();
        controlLayers.remove();


        map = new L.Map('map', {zoomControl: false});

        map.setView(new L.LatLng(40.85, 14.28), 5);

        var layerInstance = Esri_WorldImagery;
        layerInstance.addTo(map);

        map.on('zoomend', function () {
            zoom = map.getZoom();
            change_domain(map.getBounds());
            //console.log(zoom);
        });

        map.on('moveend', function (e) {
            center = map.getBounds().getCenter();
            change_domain(map.getBounds());
            //console.log(center);
        });

        controlLayers = L.control.layers(baseLayers, overlayMaps, {
                collapsed: true, position: "topright"
            }
        ).addTo(map);

        addInfoLayer();
        addRainLayer();
        addCloudLayer();
        addT2CLayer();
        addSnowLayer();
        addWindLayer();
    });