App.load('home');
App.controller('home', function (page) {
    history.pushState('home', null, '#home');
});

var oWebViewInterface1 = window.nsWebViewInterface;

var url_api = "https://api.meteo.uniparthenope.it/";

var sizeIco = [35, 35];

var position = L.icon({
    iconUrl: '../images/position.png',
    iconSize:[25,25],
    iconAnchor: [9, 21],
    popupAnchor: [20, -17]
});

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
var t2cLayer = null;
var gradi;
var vento;
var pressione;
var temp = 0;
var wind_speed;
var pressure;
var latitudine;
var longitudine;
let info_id = null;
let citta = null;

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: ''
});

var Esri_DarkGreyCanvas = L.tileLayer("http://{s}.sm.mapstack.stamen.com/(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" + "{z}/{x}/{y}.png", {
    attribution: ''
});

var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ''
});

var baseLayers = {
    "Satellite": Esri_WorldImagery,
    "Grey Canvas": Esri_DarkGreyCanvas,
    "Open Street Map": osmLayer
};

function get_beaufort(nodi)
{
    if(nodi < 1)
        return 0;
    if(nodi>= 1 && nodi<=2)
        return 1;
    if(nodi>=3 && nodi <=6)
        return 2;
    if(nodi>=7 && nodi <=10)
        return 3;
    if(nodi>=11 && nodi <=15)
        return 4;
    if(nodi>=16 && nodi <=20)
        return 5;
    if(nodi>=21 && nodi <=26)
        return 6;
    if(nodi>=27 && nodi <=33)
        return 7;
    if(nodi>=34 && nodi <=40)
        return 8;
    if(nodi>=41 && nodi <=47)
        return 9;
    if(nodi>=48 && nodi <=55)
        return 10;
    if(nodi>=56 && nodi <=63)
        return 11;
    if(nodi>=64)
        return 12;
}

function change_domain(bounds)
{
    var new_prefix = "reg";
    if (zoom >= 0 && zoom <= 6)
    {
        new_prefix = 'reg';
    }
    else if (zoom >= 7 && zoom <= 10)
    {
        new_prefix = 'prov';
    }
    else {
        new_prefix = 'com';
    }

    if (new_prefix != prefix)
    {
        prefix = new_prefix;
        addWindLayer();
        addCloudLayer();
        addRainLayer();
        addInfoLayer();
        addSnowLayer();
        addT2CLayer();
    }

    var new_domain = "d01";
    var boundsD01 = L.latLngBounds(L.latLng(27.64, -19.68), L.latLng(63.48, 34.80));
    var boundsD02 = L.latLngBounds(L.latLng(34.40, 3.58), L.latLng(47.83, 22.26));
    var boundsD03 = L.latLngBounds(L.latLng(39.15, 13.56), L.latLng(41.62, 16.31));

    if (boundsD03.contains(bounds))
    {
        new_domain = "d03";
    } else if (boundsD02.contains(bounds))
    {
        new_domain = "d02";
    }
    else {
        new_domain = "d01";
    }

    if (new_domain != domain) {
        domain = new_domain;
        addWindLayer();
        addCloudLayer();
        addRainLayer();
        addInfoLayer();
        addSnowLayer();
        addT2CLayer();
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
                            country = feature.properties.country;
                            city = feature.properties.name;
                            id = feature.properties.id;
                            clouds = parseInt(feature.properties.clf * 100); //clouds
                            dateTime = feature.properties.dateTime;
                            humidity = feature.properties.rh2; //umidity
                            press_sim = null;
                            if(pressione == 0)
                            {
                                pressure = feature.properties.slp; //pressure
                                press_sim = "hPa";
                            }
                            else if(pressione == 1)
                            {
                                pressure = feature.properties.slp;
                                press_sim = "millibar";
                            }
                            else if(pressione == 2)
                            {
                                pressure = (feature.properties.slp * 0.75006).toFixed(2);
                                press_sim = "mmHg";
                            }
                            gradi_sim = null;
                            wind_sim = null;

                            if(gradi == 0)
                            {
                                temp = feature.properties.t2c; //temp
                                gradi_sim = "&#176C";
                            }
                            else if(gradi == 1)
                            {
                                temp = ((feature.properties.t2c * 1.8) + 32).toFixed(2);
                                gradi_sim = "&#176F";
                            }
                            text = feature.properties.text;
                            wind_direction = feature.properties.wd10; // wind_deg
                            if(vento == 0)
                            {
                                wind_speed = feature.properties.ws10n; //wind_speed
                                wind_sim = "kn";
                            }
                            else if(vento == 1)
                            {
                                wind_speed = (feature.properties.ws10n * 1.852).toFixed(2);
                                wind_sim = "km/h";
                            }
                            else if(vento == 2)
                            {
                                wind_speed = (feature.properties.ws10n * 0.514444).toFixed(2);
                                wind_sim = "m/s";
                            }
                            else if(vento == 3)
                            {
                                wind_speed = get_beaufort(feature.properties.ws10n);
                                wind_sim = "beaufort";
                            }
                            if(gradi == 0)
                            {
                                wind_chill = feature.properties.wchill; //temp
                                gradi_sim = "&#176C";
                            }
                            else if(gradi == 1)
                            {
                                wind_chill = ((feature.properties.wchill * 1.8) + 32).toFixed(2);
                                gradi_sim = "&#176F";
                            }
                            winds = feature.properties.winds; //winds

                            popupString = "<div class='popup' onclick='onClick()'>" +
                                "<table class='tg' style='undefined;table-layout: fixed; width: 230px'>" +
                                "<colgroup>" +
                                "<col style='width: 85px'>" +
                                "<col style='width: 60px'>" +
                                "</colgroup>" +
                                "<tr>" +
                                "<th class='tg-baqh' colspan='2' align='center' id='citta'>" + city + "</th>" +
                                "</tr>" +
                                "<tr>" +
                                "<td class='tg-7un6'>ID</td>" +
                                "<td class='tg-7un6' id='info_id'>" + id + "</td>" +
                                "</tr>"
                                "<tr>" +
                                "<td class='tg-7un6'>PAESE</td>" +
                                "<td class='tg-7un6'>" + country + "</td>" +
                                "</tr>";

                            //creazione popup place

                            popupString +=
                                "<tr>" +
                                "<td class='tg-7un6'>TEMPERATURA</td>" +
                                "<td class='tg-7un6'>" + temp + " " + gradi_sim + "</td>" +
                                "</tr>" +
                                "<tr>" +
                                "<td class='tg-7un6'>UMIDIT&Agrave</td>" +
                                "<td class='tg-7un6'>" + humidity + "%</td>" +
                                "</tr>" +
                                "<tr>" +
                                "<td class='tg-j0tj'>PRESSIONE</td>" +
                                "<td class='tg-j0tj'>" + pressure + " " + press_sim + "</td>" +
                                "</tr>" +
                                "<tr>" +
                                "<td class='tg-7un6'>DIREZIONE VENTO</td>" +
                                "<td class='tg-7un6'>" + wind_direction + " N</td>" +
                                "</tr>" +
                                "<td class='tg-j0tj'>VENTO</td>" +
                                "<td class='tg-j0tj'>" + winds + "</td>" +
                                "</tr>" +
                                "</table>" +
                                "</div>";

                            popupString += "</table>" + "</div>";

                            layer.bindPopup(popupString);

                            layer.on("click", function () {
                                citta = L.DomUtil.get('citta').innerHTML;
                                info_id = L.DomUtil.get('info_id').innerHTML;
                                console.log(info_id);
                                console.log(citta);
                            })
                        }
                    }
                }).addTo(map);
        });
    }).on("tileunload", function (event) {
            if (event.tile.geojson && map)
                map.removeLayer(event.tile.geojson);
    });

    map.addLayer(infoLayer);
    controlLayers.addOverlay(infoLayer, "Info");
}

function onClick()
{
    oWebViewInterface1.emit('detail', {info_id:info_id, citta:citta});
}


function addWindLayer()
{
    fetch(url_api + 'products/wrf5/forecast/' + domain + '/grib/json?date=' + currData).then((response) => response.json()).then((data) =>
    {
        if (windLayer != null)
        {
            controlLayers.removeLayer(windLayer);
            map.removeLayer(windLayer);
        }


        windLayer = L.velocityLayer({
            displayValues: false,
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
        controlLayers.addOverlay(windLayer, 'Vento');
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
    controlLayers.addOverlay(cloudLayer, "Nuvolosit&agrave");
}

function addT2CLayer() {
    var anno = currData.substring(0, 4);
    var mese = currData.substring(4, 6);
    var giorno = currData.substring(6, 8);

    if (t2cLayer != null) {
        controlLayers.removeLayer(t2cLayer);
        map.removeLayer(t2cLayer);
    }

    t2cLayer = L.tileLayer.wms('http://data.meteo.uniparthenope.it/ncWMS2/wms/lds/opendap/wrf5/' + domain + '/archive/' + anno + '/' + mese + '/' + giorno + '/wrf5_' + domain + '_' + currData + '.nc', {
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

    controlLayers.addOverlay(t2cLayer, "Temperatura");
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
    controlLayers.addOverlay(rainLayer, "Pioggia");
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
    controlLayers.addOverlay(snowLayer, "Neve");
}

oWebViewInterface1.on('data', function (cor)
{
    var anno = cor.anno;
    var mese = cor.mese;
    var giorno = cor.giorno;
    var ora = cor.ora;

    currData = anno + "" + mese + "" + giorno + "Z" + ora + "00";
    console.log("Data: " + currData);

    if (map == null)
    {
        map = new L.Map('map', {zoomControl: false, attributionControl:true});
        map.setView(center, zoom);

        var credit = L.controlCredits({
            image: "icon.png",
            link: "http://meteo.uniparthenope.it",
            text: "  ",
            width: "39",
            height: "39"
        }).addTo(map);

        var layerInstance = Esri_WorldImagery;
        layerInstance.addTo(map);

        map.on('zoomend', function () {
            zoom = map.getZoom();
            change_domain(map.getBounds());
        });

        map.on('moveend', function (e) {
            center = map.getBounds().getCenter();
            change_domain(map.getBounds());
        });

        controlLayers = L.control.layers(baseLayers, overlayMaps, {
                collapsed: true, position: "topright"
            }
        ).addTo(map);
    }

    addInfoLayer();
    addWindLayer();
    addT2CLayer();
    addCloudLayer();
    addRainLayer();
    addSnowLayer();
});


oWebViewInterface1.on('new_data', function (cor)
{
    console.log(cor.data);
    currData = cor.data;

    domain = "d01";
    prefix = "reg";


    map.removeLayer(windLayer);
    map.removeLayer(snowLayer);
    map.removeLayer(t2cLayer);
    map.removeLayer(infoLayer);
    map.removeLayer(cloudLayer);
    map.removeLayer(rainLayer);
    map.remove();
    controlLayers.remove();

    map = new L.Map('map', {zoomControl: false, attributionControl:true});

    map.setView(new L.LatLng(40.85, 14.28), 5, { animation: true });

    var credit = L.controlCredits({
        image: "icon.png",
        link: "http://meteo.uniparthenope.it",
        text: "  ",
        width: "39",
        height: "39"
    }).addTo(map);


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
    addWindLayer();
    addT2CLayer();
    addCloudLayer();
    addRainLayer();
    addSnowLayer();
});

oWebViewInterface1.on('location', function (cor) {
    latitudine = cor.lat;
    longitudine = cor.lang;
    var DynaMarker = L.marker([cor.lat,cor.lang], {icon: position});
    DynaMarker.setLatLng([cor.lat, cor.lang]) .addTo(map);
});

oWebViewInterface1.on('settings', function (cor)
{
    gradi = cor.gradi;
    vento = cor.vento;
    pressione = cor.pressione;
});

oWebViewInterface1.on('centro', function(cor)
{
    fetch("https://api.meteo.uniparthenope.it/places/search/byname/" + cor.position).then((response) => response.json()).then((data) =>
    {
        var id;
        console.log(data.length);
        for(let i=0; i<data.length; i++)
        {
            let name = data[i].long_name.it;
            console.log(name);
            let name_new;
            let _name;
            if(name.includes("Municipalità"))
            {
                console.log("MUN");
                var tmp = name.split("-");
                name_new = tmp.pop();
                _name = name_new;

                if(_name === cor.position)
                    id = i;
            }
            else
            {
                console.log("NO MUN");
                _name = cor.position;
                if(_name === cor.position)
                    id = i;
            }
        }
        console.log(id);
        center = new L.LatLng(data[id].pos.coordinates[1], data[id].pos.coordinates[0]);

        map.setView(center, zoom);
        map.fitBounds([
            [data[id].bbox.coordinates[0][1], data[id].bbox.coordinates[0][0]],
            [data[id].bbox.coordinates[1][1], data[id].bbox.coordinates[1][0]],
            [data[id].bbox.coordinates[2][1], data[id].bbox.coordinates[2][0]],
            [data[id].bbox.coordinates[3][1], data[id].bbox.coordinates[3][0]],
            [data[id].bbox.coordinates[4][1], data[id].bbox.coordinates[4][0]]
        ]);
        zoom = map.getZoom();
        center = map.getBounds().getCenter();

        addInfoLayer();
        addWindLayer();
        addT2CLayer();
        addCloudLayer();
        addRainLayer();
        addSnowLayer();
    });
});


oWebViewInterface1.on('place_searched', function (cor)
{
    fetch("https://api.meteo.uniparthenope.it/places/search/byname/" + cor.name).then((response) => response.json()).then((data) =>
    {
        console.log("SEARCH: " + cor.name);
        var id;
        console.log(data.length);
        for(let i=0; i<data.length; i++)
        {
            if(data[i].long_name.it === cor.name)
                id = i;
        }

        center = new L.LatLng(data[id].pos.coordinates[1], data[id].pos.coordinates[0]);

        map.setView(center, zoom);
        map.fitBounds([
            [data[id].bbox.coordinates[0][1], data[id].bbox.coordinates[0][0]],
            [data[id].bbox.coordinates[1][1], data[id].bbox.coordinates[1][0]],
            [data[id].bbox.coordinates[2][1], data[id].bbox.coordinates[2][0]],
            [data[id].bbox.coordinates[3][1], data[id].bbox.coordinates[3][0]],
            [data[id].bbox.coordinates[4][1], data[id].bbox.coordinates[4][0]]
        ]);
        zoom = map.getZoom();
        center = map.getBounds().getCenter();

        addInfoLayer();
        addWindLayer();
        addT2CLayer();
        addCloudLayer();
        addRainLayer();
        addSnowLayer();
    });
});

addInfoLayer();
addWindLayer();
addT2CLayer();
addCloudLayer();
addRainLayer();
addSnowLayer();