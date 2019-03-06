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
var single_item;
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
var step = "1";
var hour = "0";
let products_map = new Map();
let outputs_map = new Map();
var hours;

let mesi = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

function pageLoaded(args) {
    var page = args.object;
    temp = new ObservableArray();
    press = new ObservableArray();
    single_item = new ObservableArray();
    array = new ObservableArray();
    products = new ObservableArray();
    outputs = new ObservableArray();
    hours = new ObservableArray();

    pageData = new Observable.fromObject({
        temp: temp,
        press: press,
        single_item: single_item,
        statistic: array,
        map:map,
        products: products,
        outputs: outputs,
        hours: hours
    });
    pageData.set("isBusy", true);//Load animation
    pageData.set("isHeigh", "25");
    pageData.set("isBusy_graphic", true);//Load animation
    pageData.set("isHeigh_graphic", "25");
    pageData.set("isBusy1", true);//Load animation
    pageData.set("isHeigh1", "25");
    pageData.set("isBusy_graphic1", true);//Load animation
    pageData.set("isHeigh_graphic1", "25");
    pageData.set("isBusy_meteo", true);//Load animation
    pageData.set("isHeigh_meteo", "25");
    pageData.set("isBusy_map", true);//Load animation
    pageData.set("isHeigh_map", "25");
    pageData.set("table", "collapsed");
    pageData.set("graphic", "collapsed");
    pageData.set("graphic1", "collapsed");
    pageData.set("meteo", "collapsed");
    pageData.set("_map", "collapsed");

    place = page.navigationContext.place;
    id = page.navigationContext.id;
    data = page.navigationContext.data;
    console.log("[DATA DETTAGLI]" + data);
    pageData.set("titolo", place);

    print_chart(id, prod, output, hour, step);

    print_meteo(id, data);

    print_series(id);

    print_map(id, prod, output, data);

    print_prod();

    print_output(prod);

    print_hours();

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
    print_output(prod);
    pageData.set("outputs", outputs);
    print_map(id, prod, output, data);

    single_item.splice(0);
    temp.splice(0);
    press.splice(0);
    print_chart(id, prod, output, hours, step);

    console.log(prod + " " + output);
};

exports.dropDownSelectedIndexChanged1 = function (args) {
    var out = outputs.getItem(args.object.selectedIndex);
    output = outputs_map.get(out);

    print_map(id, prod, output, data);
    single_item.splice(0);
    temp.splice(0);
    press.splice(0);
    print_chart(id, prod, output, hours, step);

    console.log(prod + " " + output);
};

exports.dropDownSelectedIndexChanged2 = function (args) {
    var h = hours.getItem(args.object.selectedIndex);
    step = h;

    single_item.splice(0);
    temp.splice(0);
    press.splice(0);
    print_chart(id, prod, output, hours, step);
};

function onTap(args) {
    const index = args.index;
    const button = args.object;
    const page = button.page;

    var name = array.getItem(index).forecast;

    var tmp = name.split("- ");
    var name_new = tmp.pop();
    var day = name_new.substring(0,2);
    var month = name_new.substring(3, 7);

    var data = new Date();

    let _month = mesi.indexOf(month) +1;
    if(_month < 10)
        _month = "0" + _month;

    var selected_data = data.getUTCFullYear() + "" + _month + "" + day + "Z0000";

    let url = "https://api.meteo.uniparthenope.it/products/wrf5/timeseries/" + id + "?date=" + selected_data + "&hours=24";
    console.log(url);
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

function print_chart(place, product, output, hours, step)
{
    let url = "https://api.meteo.uniparthenope.it/products/" + product + "/timeseries/" + place + "?step=" + step;
    console.log(url);

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            var timeSeries=data['timeseries'];
            for (var i = 0; i < timeSeries.length; i++) {
                let date=timeSeries[i].dateTime;
                let month = date.substring(4, 6);
                let day = date.substring(6, 8);
                let ora = date.substring(9,11);
                let sDateTime=month + "-" + day + "H" + ora;

                if(product == 'wrf5')
                {
                    if(output == 'gen' || output == 'tsp')
                    {
                        pageData.set("title_1", "Temperatura (°C)");
                        pageData.set("title_2", "Pressione (hPa)");
                        temp.push({key: sDateTime, val: (timeSeries[i].t2c)});
                        press.push({key: sDateTime, val: (timeSeries[i].slp)});
                        pageData.set("isBusy_graphic", false);
                        pageData.set("isHeigh_graphic", "0");
                        pageData.set("graphic", "visible");
                        pageData.set("isBusy_graphic1", false);
                        pageData.set("isHeigh_graphic1", "0");
                        pageData.set("graphic1", "collapsed");
                    }
                    else if(output == 'wn1')
                    {
                        pageData.set("title_1", "Velocità vento 10m (knt)");
                        pageData.set("title_2", "Velocità vento 10m (°N)");
                        temp.push({key: sDateTime, val: (timeSeries[i].ws10n)});
                        press.push({key: sDateTime, val: (timeSeries[i].wd10)});
                        pageData.set("isBusy_graphic", false);
                        pageData.set("isHeigh_graphic", "0");
                        pageData.set("graphic", "visible");
                        pageData.set("isBusy_graphic1", false);
                        pageData.set("isHeigh_graphic1", "0");
                        pageData.set("graphic1", "collapsed");
                    }
                    else if(output == 'crh')
                    {
                        pageData.set("title_1", "Pioggia (mm)");
                        pageData.set("title_2", "Nuvolosità (%)");
                        temp.push({key: sDateTime, val: (timeSeries[i].crh)});
                        press.push({key: sDateTime, val: (timeSeries[i].clf * 100).toFixed(2)});
                        pageData.set("isBusy_graphic", false);
                        pageData.set("isHeigh_graphic", "0");
                        pageData.set("graphic", "visible");
                        pageData.set("isBusy_graphic1", false);
                        pageData.set("isHeigh_graphic1", "0");
                        pageData.set("graphic1", "collapsed");
                    }
                }
                else if(product == 'rms3')
                {
                    if(output == 'gen' || output == 'scu')
                    {
                        pageData.set("title_1", "Corrente superficiale (m/s)");
                        pageData.set("title_2", "Direzione corrente superficiale (°N)");
                        temp.push({key: sDateTime, val: (timeSeries[i].scm)});
                        press.push({key: sDateTime, val: (timeSeries[i].scd)});
                        pageData.set("isBusy_graphic", false);
                        pageData.set("isHeigh_graphic", "0");
                        pageData.set("graphic", "visible");
                        pageData.set("isBusy_graphic1", false);
                        pageData.set("isHeigh_graphic1", "0");
                        pageData.set("graphic1", "collapsed");
                    }
                    else if(output == 'sts')
                    {
                        pageData.set("title_1", "Temperatura superficiale (°C)");
                        pageData.set("title_2", "Salinità superficiale (1/1000)");
                        temp.push({key: sDateTime, val: (timeSeries[i].sst)});
                        press.push({key: sDateTime, val: (timeSeries[i].sss)});
                        pageData.set("isBusy_graphic", false);
                        pageData.set("isHeigh_graphic", "0");
                        pageData.set("graphic", "visible");
                        pageData.set("isBusy_graphic1", false);
                        pageData.set("isHeigh_graphic1", "0");
                        pageData.set("graphic1", "collapsed");
                    }
                    else if(output == 'sss')
                    {
                        pageData.set("graphic", "collapsed");
                        pageData.set("title_s", "Salinità superficiale");
                        single_item.push({key: sDateTime, val: (timeSeries[i].sss)});
                        pageData.set("isBusy_graphic1", false);
                        pageData.set("isHeigh_graphic1", "0");
                        pageData.set("graphic1", "visible");
                        pageData.set("isBusy_graphic", false);
                        pageData.set("isHeigh_graphic", "0");
                        pageData.set("graphic", "collapsed");
                    }
                    else if(output == "sst")
                    {
                        pageData.set("title_s", "Temperatura superficiale");
                        single_item.push({key: sDateTime, val: (timeSeries[i].sst)});
                        pageData.set("isBusy_graphic1", false);
                        pageData.set("isHeigh_graphic1", "0");
                        pageData.set("graphic1", "visible");
                        pageData.set("isBusy_graphic", false);
                        pageData.set("isHeigh_graphic", "0");
                        pageData.set("graphic", "collapsed");
                    }
                }
                else if(product == 'wcm3')
                {
                    if(output == 'gen' || output == 'con')
                    {
                        pageData.set("title_s", "Concentrazione particelle");
                        single_item.push({key: sDateTime, val: timeSeries[i].con});
                        pageData.set("isBusy_graphic1", false);
                        pageData.set("isHeigh_graphic1", "0");
                        pageData.set("graphic1", "visible");
                        pageData.set("isBusy_graphic", false);
                        pageData.set("isHeigh_graphic", "0");
                        pageData.set("graphic", "collapsed");
                    }
                }
            }
        }).catch(error => console.error("[GRAFICO] ERROR DATA ", error));

    return;
}


function print_meteo(id, data)
{
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
        }).catch(error => console.error("ERROR DATA ", error));

    return;
}

function print_series(id)
{
    fetch("https://api.meteo.uniparthenope.it/products/wrf5/timeseries/" + id +"?hours=0&step=24")
        .then((response) => response.json())
        .then((data) =>
        {
            pageData.set("altezza", data.timeseries.length * 45);
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

    return;
}

function print_map(id, prod, output, data)
{
    var url_map = "https://api.meteo.uniparthenope.it/products/" + prod + "/forecast/" + id + "/plot/image?date=" + data + "&output=" + output;

    imageSource.fromUrl(url_map)
        .then(function () {
            pageData.map = url_map;
        }).then(function () {
        pageData.set("isBusy_map", false);
        pageData.set("isHeigh_map", "0");
        pageData.set("_map", "visible");
    }).catch(err => {console.log("Somthing went wrong!");});
}

function print_prod()
{
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
}

function print_output(prod)
{
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
}

function print_hours()
{
    var h = ['1', '3', '6', '9', '12', '24'];
    for(let i=0; i<h.length; i++)
    {
        hours.push(h[i]);
    }
    pageData.set("hint_hours", "1");
}