var chart = require("nativescript-ui-chart");
var frameModule = require("tns-core-modules/ui/frame");
var DetailViewModel = require("./detail-view-model");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
var detailViewModel = new DetailViewModel();
const view = require("tns-core-modules/ui/core/view");
var getViewById = require("tns-core-modules/ui/core/view").getViewById;
const appSetting = require("application-settings");
var dialog = require("tns-core-modules/ui/dialogs");
var imageSource = require("image-source");


var press;
var temp;
var pageData;
var place;
var id;
var data;
var array;
var map;
var products;
var outputs;
var prod = "wrf5";
var output = "gen";
var products_map = new Map();
let outputs_map = new Map();

function pageLoaded(args) {
    var page = args.object;
    temp = new ObservableArray();
    press = new ObservableArray();
    array = new ObservableArray();
    products = new ObservableArray();
    outputs = new ObservableArray();

    pageData = new Observable.fromObject({
        temp: temp,
        press: press,
        statistic: array,
        map:map,
        products: products,
        outputs: outputs
    });
    pageData.set("isBusy", true);//Load animation
    pageData.set("isHeigh", "25");
    pageData.set("isBusy_graphic", true);//Load animation
    pageData.set("isHeigh_graphic", "25");
    pageData.set("isBusy_meteo", true);//Load animation
    pageData.set("isHeigh_meteo", "25");
    pageData.set("isBusy_map", true);//Load animation
    pageData.set("isHeigh_map", "25");
    pageData.set("table", "collapsed");
    pageData.set("graphic", "collapsed");
    pageData.set("meteo", "collapsed");
    pageData.set("_map", "collapsed");

    place = page.navigationContext.place;
    id = page.navigationContext.id;
    data = page.navigationContext.data;
    console.log("[DATA DETTAGLI]" + data);
    pageData.set("titolo", place);

    fetch("https://api.meteo.uniparthenope.it/products/wrf5/timeseries/"+ id +"?step=24")
        .then((response) => response.json())
        .then((data) => {
            var timeSeries=data['timeseries'];
            for (var i = 0; i < timeSeries.length; i++) {
                let date=timeSeries[i].dateTime;
                let year = date.substring(0, 4);
                let month = date.substring(4, 6);
                let day = date.substring(6, 8);
                let ora = date.substring(9,11);
                let sDateTime=year + "-" + month + "-" + day;

                temp.push({key: sDateTime, val: timeSeries[i].t2c});
                press.push({key: sDateTime, val: timeSeries[i].slp});
            }
        })
        .then(function () {
            pageData.set("isBusy_graphic", false);
            pageData.set("isHeigh_graphic", "0");
            pageData.set("graphic", "visible");
        }).catch(error => console.error("[GRAFICO] ERROR DATA ", error));

    fetch("https://api.meteo.uniparthenope.it/products/wrf5/forecast/" + id + "?date=" + data)
        .then((response) => response.json())
        .then((data) => {
            if (data.result == "ok")
            {
                if (appSetting.getNumber("Temperatura", 0) == 0)
                    pageData.set("temperatura", data.forecast.t2c + " °C");
                else if (appSetting.getNumber("Temperatura", 0) == 1) {
                    pageData.set("temperatura", ((data.forecast.t2c * 1.8) + 32).toFixed(2) + " °F");
                }

                pageData.set("_meteo", data.forecast.text);
                pageData.set("cloud", (data.forecast.clf * 100).toFixed(2) + " %");
                pageData.set("humidity", (data.forecast.rh2).toFixed(2) + " %");

                if(appSetting.getNumber("Pressione", 0) == 0)
                    pageData.set("pressione", data.forecast.slp + " hPa");
                else if(appSetting.getNumber("Pressione", 0) == 1)
                    pageData.set("pressione", data.forecast.slp + " millibar");
                else if(appSetting.getNumber("Pressione", 0) == 2)
                    pageData.set("pressione", (data.forecast.slp * 0.75006).toFixed(2) + " mmHg");

                pageData.set("wind_direction", data.forecast.wd10 + " N");

                if (appSetting.getNumber("Vento", 0) == 0)
                    pageData.set("wind_speed", data.forecast.ws10n + " kn");
                else if (appSetting.getNumber("Vento", 0) == 1) {
                    pageData.set("wind_speed", (data.forecast.ws10n * 1.852).toFixed(2) + " km/h");
                } else if (appSetting.getNumber("Vento", 0) == 2) {
                    pageData.set("wind_speed", (data.forecast.ws10n * 0.514444).toFixed(2) + " m/s");
                } else if (appSetting.getNumber("Vento", 0) == 3) {
                    pageData.set("wind_speed", (get_beaufort(data.forecast.ws10n)) + " beaufort");
                }

                if (appSetting.getNumber("Temperatura", 0) == 0)
                    pageData.set("wind_chill", data.forecast.wchill + " °C");
                else if (appSetting.getNumber("Temperatura", 0) == 1) {
                    pageData.set("wind_chill", ((data.forecast.wchill * 1.8) + 32).toFixed(2) + " °F");
                }

                pageData.set("wind", data.forecast.winds);
            }
            else if (data.result == "error")
            {
                dialog.alert({title: "Errore", message: data.details, okButtonText: "OK"});
            }
        })
        .then(function () {
        pageData.set("isBusy_meteo", false);
        pageData.set("isHeigh_meteo", "0");
        pageData.set("meteo", "visible");
    })
        .catch(error => console.error("ERROR DATA ", error));


    fetch("https://api.meteo.uniparthenope.it/products/wrf5/timeseries/" + id +"?hours=0&step=24")
        .then((response) => response.json())
        .then((data) =>
        {
            for(let i=0; i<data.timeseries.length; i++)
            {
                let weekDayLabel=dayOfWeek(data.timeseries[i]['dateTime']) + " - " + data.timeseries[i]['dateTime'].substring(6,8) + " " + monthOfYear(data.timeseries[i]['dateTime']);
                array.push({"forecast":weekDayLabel, "image": "~/meteo_icon/" + data.timeseries[i].icon, "TMin": data.timeseries[i]['t2c-min'], "TMax": data.timeseries[i]['t2c-max'], "Wind":data.timeseries[i].ws10n + " " + data.timeseries[i].winds, "Rain": data.timeseries[i].crh});
            }
        })
        .then(function () {
            pageData.set("isBusy", false);
            pageData.set("isHeigh", "0");
            pageData.set("table", "visible");
        }).catch(error => console.error("[LABEL] ERROR DATA", error));

    var url_map = "https://api.meteo.uniparthenope.it/products/" + prod + "/forecast/" + id + "/plot/image?date=" + data + "&output=" + output;

    console.log(url_map);

    imageSource.fromUrl(url_map)
        .then(function () {
            pageData.map = url_map;
        }).then(function () {
            pageData.set("isBusy_map", false);
            pageData.set("isHeigh_map", "0");
            pageData.set("_map", "visible");
        })
        .catch(err => {
            console.log("Somthing went wrong!");
        });


    fetch("https://api.meteo.uniparthenope.it/products").then((response) => response.json()).then((data) =>
    {
        let product = data['products'];

        var keys = Object.keys(product);
        var key;
        for(var i=0; i<keys.length; i++){
            var val = keys[i];
            key = product[val]['desc']['it'];
            products_map.set(key, val);
            products.push(key);
        }

        let _prod = [...products_map.entries()]
            .filter(({ 1: v }) => v === prod)
            .map(([k]) => k);

        console.log(_prod);
        pageData.set("hint_prod", _prod);
    });

    fetch("https://api.meteo.uniparthenope.it/products/" + prod).then((response) => response.json()).then((data) =>
    {
        let product = data['outputs']['outputs'];

        var keys = Object.keys(product);
        var key;
        for(var i=0; i<keys.length; i++){
            var val = keys[i];
            key = product[val]['it'];
            outputs_map.set(key, val);
            outputs.push(key);
        }

        let _out = [...outputs_map.entries()]
            .filter(({ 1: v }) => v === output)
            .map(([k]) => k);

        console.log(_out);
        pageData.set("hint_output", _out);
    });

    pageData.set("products", products);
    pageData.set("outputs", outputs);

    page.bindingContext = pageData;
}
exports.pageLoaded = pageLoaded;

exports.dropDownSelectedIndexChanged = function (args) {
    var out = products.getItem(args.object.selectedIndex);
    prod = products_map.get(out);
    output = "gen";
    outputs_map.clear();
    outputs.splice(0);

    pageData.set("outputs", null);

    fetch("https://api.meteo.uniparthenope.it/products/" + prod).then((response) => response.json()).then((data) =>
    {
        let product = data['outputs']['outputs'];

        var keys = Object.keys(product);
        var key;
        for(var i=0; i<keys.length; i++){
            var val = keys[i];
            key = product[val]['it'];
            outputs_map.set(key, val);
            outputs.push(key);
        }

        let _out = [...outputs_map.entries()]
            .filter(({ 1: v }) => v === output)
            .map(([k]) => k);

        console.log(_out);
        pageData.set("hint_output", _out);
    });
    pageData.set("outputs", outputs);

    var url_map = "https://api.meteo.uniparthenope.it/products/" + prod + "/forecast/" + id + "/plot/image?date=" + data + "&output=" + output;
    console.log(url_map);

    imageSource.fromUrl(url_map)
        .then(function () {
            pageData.map = url_map;
        })
        .then(function () {
        })
        .catch(err => {
            console.log("Somthing went wrong!");
        });
};

exports.dropDownSelectedIndexChanged1 = function (args) {
    var out = outputs.getItem(args.object.selectedIndex);
    output = outputs_map.get(out);
    console.log(output);

    var url_map = "https://api.meteo.uniparthenope.it/products/" + prod + "/forecast/" + id + "/plot/image?date=" + data + "&output=" + output;
    console.log(url_map);

    imageSource.fromUrl(url_map)
        .then(function () {
            pageData.map = url_map;
        })
        .then(function () {
        })
        .catch(err => {
            console.log("Somthing went wrong!");
        });
};

function onTap(args) {
    const index = args.index;
    const button = args.object;
    const page = button.page;

    console.log(array.getItem(index).forecast);
}
exports.onTap = onTap;

function get_beaufort(nodi)
{
    if(nodi < 1)
        return 0;
    if(nodi>= 1 && nodi<=2)
        return 1;
    if(nodi>2 && nodi <=6)
        return 2;
    if(nodi>6 && nodi <=10)
        return 3;
    if(nodi>10 && nodi <=15)
        return 4;
    if(nodi>15 && nodi <=20)
        return 5;
    if(nodi>20 && nodi <=26)
        return 6;
    if(nodi>26 && nodi <=33)
        return 7;
    if(nodi>33 && nodi <=40)
        return 8;
    if(nodi>40 && nodi <=47)
        return 9;
    if(nodi>47 && nodi <=55)
        return 10;
    if(nodi>55 && nodi <=63)
        return 11;
    if(nodi>63)
        return 12;
}

function dayOfWeek(date) {
    let year = date.substring(0, 4);
    let month = date.substring(4, 6);
    let day = date.substring(6, 8);

    let dayOfWeek = new Date(year + "-" + month + "-" + day).getDay();
    return isNaN(dayOfWeek) ? null : ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'][dayOfWeek];
};

function monthOfYear(date) {
    let month = parseInt(date.substring(4, 6)) - 1;
    return isNaN(month) ? null : ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"][month];
};