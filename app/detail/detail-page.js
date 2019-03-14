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
require("nativescript-accordion");

var press;
var temp;
var single_item;
var pageData;
var id;
var data;
var map;
var products;
var outputs;
var prod;
var output;
var step;
var hour;
let products_map = new Map();
let outputs_map = new Map();
var steps;
var hours;
let anno;
let mese;
let giorno;
let ora;
let print_data;
let mesi = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
var items;
let altezza;

function pageLoaded(args) {
    var page = args.object;
    temp = new ObservableArray();
    press = new ObservableArray();
    single_item = new ObservableArray();
    products = new ObservableArray();
    outputs = new ObservableArray();
    steps = new ObservableArray();
    hours = new ObservableArray();
    items = new ObservableArray();

    pageData = new Observable.fromObject({
        temp: temp,
        press: press,
        single_item: single_item,
        map:map,
        products: products,
        outputs: outputs,
        steps: steps,
        hours: hours,
        items: items
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
    pageData.set("hours_visibility", "visible");

    id = page.navigationContext.id;
    data = page.navigationContext.data;
    console.log("[DATA DETTAGLI]" + data);

    prod = "wrf5";
    output = "gen";
    step = "1";
    hour = "24";

    print_data = get_print_data(data);

    pageData.set("data", print_data);

    print_chart(id, prod, output, hour, step);

    print_meteo(id, data);

    print_series(id);

    print_map(id, prod, output, data);

    print_prod();

    print_output(prod);

    print_steps();

    print_hours();

    page.bindingContext = pageData;
}
exports.pageLoaded = pageLoaded;

function get_print_data(data)
{
    let data_final;
    anno = data.substring(0,4);
    mese = data.substring(4, 6);
    giorno = data.substring(6,8);
    ora = data.substring(9,11);

    data_final = anno + "/" + mese + "/" + giorno + " " + ora + ":00";
    return data_final;
}

exports.childTapped = function(args)
{
    console.log("Prova");
};

exports.dropDownSelectedIndexChanged = function (args) {
    var out = products.getItem(args.object.selectedIndex);
    prod = products_map.get(out);

    if(prod == "rms3" || prod == "wcm3")
    {
        step = 1;
        pageData.set("hint_steps", "1");
    }
    else if(prod == "wrf5")
    {
        step = 6;
        pageData.set("hint_steps", "6");
    }

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
    print_chart(id, prod, output, hour, step);

    console.log(prod + " " + output);
};

exports.dropDownSelectedIndexChanged1 = function (args) {
    var out = outputs.getItem(args.object.selectedIndex);
    output = outputs_map.get(out);

    print_map(id, prod, output, data);
    single_item.splice(0);
    temp.splice(0);
    press.splice(0);
    print_chart(id, prod, output, hour, step);

    console.log(prod + " " + output);
};

exports.dropDownSelectedIndexChanged2 = function (args) {
    var s = steps.getItem(args.object.selectedIndex);
    step = s;

    if(step == '1') {
        pageData.set("hours_visibility", "visible");
        hour = "24";
        pageData.set("hint_hours", "24");
    }
    else {
        pageData.set("hours_visibility", "collapsed");
        hour = "0";
    }

    single_item.splice(0);
    temp.splice(0);
    press.splice(0);
    print_chart(id, prod, output, hour, step);
};

exports.dropDownSelectedIndexChanged3 = function (args) {
    var h = hours.getItem(args.object.selectedIndex);
    hour = h;

    single_item.splice(0);
    temp.splice(0);
    press.splice(0);
    print_chart(id, prod, output, hour, step);
};

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

function print_chart(place, product, output, hour, step)
{
    let url = "https://api.meteo.uniparthenope.it/products/" + product + "/timeseries/" + place + "?hours=" + hour +"&step=" + step;
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
    fetch("https://api.meteo.uniparthenope.it/products/wrf5/forecast/" + id + "?date=" + data +"&opt=place")
        .then((response) => response.json())
        .then((data) => {
            if (data.result == "ok")
            {
                let place = data.place.long_name.it;

                if (place.includes("Municipalit")) {
                    var tmp = place.split("-");
                    var tmp1 = tmp.pop();
                    pageData.set("titolo", tmp1);
                } else {
                    pageData.set("titolo", place);
                }

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
        .then(async (data) => {
            pageData.set("altezza", data.timeseries.length * 45);
            altezza = data.timeseries.length * 45;
            for (let i = 0; i < data.timeseries.length; i++) {
                let url = "https://api.meteo.uniparthenope.it/products/wrf5/timeseries/" + id + "?date=" + data.timeseries[i]['dateTime'] + "&hours=24";
                console.log(url);

                const response = await fetch(url);
                const data1 = await response.json();

                let weekDayLabel = dayOfWeek(data.timeseries[i]['dateTime']) + " - " + data.timeseries[i]['dateTime'].substring(6, 8) + " " + monthOfYear(data.timeseries[i]['dateTime']);
                items.push({
                    forecast: weekDayLabel,
                    image: "~/meteo_icon/" + data.timeseries[i].icon,
                    TMin: data.timeseries[i]['t2c-min'],
                    TMax: data.timeseries[i]['t2c-max'],
                    Wind: data.timeseries[i].winds + " " + data.timeseries[i].ws10n,
                    Rain: data.timeseries[i].crh,
                    items: [
                        {
                            forecast: "00:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[0].icon,
                            Temperatura: data1.timeseries[0]['t2c'],
                            Wind: data1.timeseries[0].winds + " " + data1.timeseries[0].ws10n,
                            Rain: data1.timeseries[0].crh
                        },
                        {
                            forecast: "01:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[1].icon,
                            Temperatura: data1.timeseries[1]['t2c'],
                            Wind: data1.timeseries[1].winds + " " + data1.timeseries[1].ws10n,
                            Rain: data1.timeseries[1].crh
                        },
                        {
                            forecast: "02:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[2].icon,
                            Temperatura: data1.timeseries[2]['t2c'],
                            Wind: data1.timeseries[2].winds + " " + data1.timeseries[2].ws10n,
                            Rain: data1.timeseries[2].crh
                        },
                        {
                            forecast: "03:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[3].icon,
                            Temperatura: data1.timeseries[3]['t2c'],
                            Wind: data1.timeseries[3].winds + " " + data1.timeseries[3].ws10n,
                            Rain: data1.timeseries[3].crh
                        },
                        {
                            forecast: "04:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[4].icon,
                            Temperatura: data1.timeseries[4]['t2c'],
                            Wind: data1.timeseries[4].winds + " " + data1.timeseries[4].ws10n,
                            Rain: data1.timeseries[4].crh
                        },
                        {
                            forecast: "05:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[5].icon,
                            Temperatura: data1.timeseries[5]['t2c'],
                            Wind: data1.timeseries[5].winds + " " + data1.timeseries[5].ws10n,
                            Rain: data1.timeseries[5].crh
                        },
                        {
                            forecast: "06:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[6].icon,
                            Temperatura: data1.timeseries[6]['t2c'],
                            Wind: data1.timeseries[6].winds + " " + data1.timeseries[6].ws10n,
                            Rain: data1.timeseries[6].crh
                        },
                        {
                            forecast: "07:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[7].icon,
                            Temperatura: data1.timeseries[7]['t2c'],
                            Wind: data1.timeseries[7].winds + " " + data1.timeseries[7].ws10n,
                            Rain: data1.timeseries[7].crh
                        },
                        {
                            forecast: "08:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[8].icon,
                            Temperatura: data1.timeseries[8]['t2c'],
                            Wind: data1.timeseries[8].winds + " " + data1.timeseries[8].ws10n,
                            Rain: data1.timeseries[8].crh
                        },
                        {
                            forecast: "09:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[9].icon,
                            Temperatura: data1.timeseries[9]['t2c'],
                            Wind: data1.timeseries[9].winds + " " + data1.timeseries[9].ws10n,
                            Rain: data1.timeseries[9].crh
                        },
                        {
                            forecast: "10:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[10].icon,
                            Temperatura: data1.timeseries[10]['t2c'],
                            Wind: data1.timeseries[10].winds + " " + data1.timeseries[10].ws10n,
                            Rain: data1.timeseries[10].crh
                        },
                        {
                            forecast: "11:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[11].icon,
                            Temperatura: data1.timeseries[11]['t2c'],
                            Wind: data1.timeseries[11].winds + " " + data1.timeseries[11].ws10n,
                            Rain: data1.timeseries[11].crh
                        },
                        {
                            forecast: "12:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[12].icon,
                            Temperatura: data1.timeseries[12]['t2c'],
                            Wind: data1.timeseries[12].winds + " " + data1.timeseries[12].ws10n,
                            Rain: data1.timeseries[12].crh
                        },
                        {
                            forecast: "13:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[13].icon,
                            Temperatura: data1.timeseries[13]['t2c'],
                            Wind: data1.timeseries[13].winds + " " + data1.timeseries[13].ws10n,
                            Rain: data1.timeseries[13].crh
                        },
                        {
                            forecast: "14:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[14].icon,
                            Temperatura: data1.timeseries[14]['t2c'],
                            Wind: data1.timeseries[14].winds + " " + data1.timeseries[14].ws10n,
                            Rain: data1.timeseries[14].crh
                        },
                        {
                            forecast: "15:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[15].icon,
                            Temperatura: data1.timeseries[15]['t2c'],
                            Wind: data1.timeseries[15].winds + " " + data1.timeseries[15].ws10n,
                            Rain: data1.timeseries[15].crh
                        },
                        {
                            forecast: "16:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[16].icon,
                            Temperatura: data1.timeseries[16]['t2c'],
                            Wind: data1.timeseries[16].winds + " " + data1.timeseries[16].ws10n,
                            Rain: data1.timeseries[16].crh
                        },
                        {
                            forecast: "17:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[17].icon,
                            Temperatura: data1.timeseries[17]['t2c'],
                            Wind: data1.timeseries[17].winds + " " + data1.timeseries[17].ws10n,
                            Rain: data1.timeseries[17].crh
                        },
                        {
                            forecast: "18:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[18].icon,
                            Temperatura: data1.timeseries[18]['t2c'],
                            Wind: data1.timeseries[18].winds + " " + data1.timeseries[18].ws10n,
                            Rain: data1.timeseries[18].crh
                        },
                        {
                            forecast: "19:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[19].icon,
                            Temperatura: data1.timeseries[19]['t2c'],
                            Wind: data1.timeseries[19].winds + " " + data1.timeseries[19].ws10n,
                            Rain: data1.timeseries[19].crh
                        },
                        {
                            forecast: "20:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[20].icon,
                            Temperatura: data1.timeseries[20]['t2c'],
                            Wind: data1.timeseries[20].winds + " " + data1.timeseries[20].ws10n,
                            Rain: data1.timeseries[20].crh
                        },
                        {
                            forecast: "21:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[21].icon,
                            Temperatura: data1.timeseries[21]['t2c'],
                            Wind: data1.timeseries[21].winds + " " + data1.timeseries[21].ws10n,
                            Rain: data1.timeseries[21].crh
                        },
                        {
                            forecast: "22:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[22].icon,
                            Temperatura: data1.timeseries[22]['t2c'],
                            Wind: data1.timeseries[22].winds + " " + data1.timeseries[22].ws10n,
                            Rain: data1.timeseries[22].crh
                        },
                        {
                            forecast: "23:00 UTC",
                            image: "~/meteo_icon/" + data1.timeseries[23].icon,
                            Temperatura: data1.timeseries[23]['t2c'],
                            Wind: data1.timeseries[23].winds + " " + data1.timeseries[23].ws10n,
                            Rain: data1.timeseries[23].crh
                        },
                    ]
                });
            }
            pageData.set("items", items);
        })
        .then(function () {
            pageData.set("isBusy", false);
            pageData.set("isHeigh", "0");
            pageData.set("table", "visible");
        }).catch(error => console.error("[LABEL] ERROR DATA", error));


    return;
}

exports.tap = function (args)
{
    console.log(args.object.selectedIndexes[0]);
    console.log(pageData.get("altezza"));

    if(pageData.get("altezza") >= 0 && pageData.get("altezza") <= 270 && args.object.selectedIndexes[0] == undefined)
        pageData.set("altezza", 1350);
    else if(pageData.get("altezza") == 1350 && args.object.selectedIndexes[0] == undefined)
    {
        pageData.set("altezza", 1350);
    }
    else if(pageData.get("altezza") == 1350 && args.object.selectedIndexes[0] != undefined)
    {
        pageData.set("altezza", altezza);
    }
};

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

        pageData.set("products", products);
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

        pageData.set("outputs", outputs);
    });
}

function print_steps()
{
    var s = ['1', '3', '6', '12', '24'];
    for(let i=0; i<s.length; i++)
    {
        steps.push(s[i]);
    }
    pageData.set("hint_steps", "1");
}


function print_hours()
{
    var h = ['24', '48', '72', '96'];
    for(let i=0; i<h.length; i++)
    {
        hours.push(h[i]);
    }
    pageData.set("hint_hours", "24");
};

function onTapNext()
{
    if((parseInt(ora)+1) >23)
    {
        ora =0;
    }
    else
        ora++;

    if(ora < 10)
        ora = "0" + ora;

    data = anno+""+mese+""+giorno+"Z"+ora+"00";

    pageData.set("data", anno+"/"+mese+"/"+giorno+" "+ora+":00");

    print_map(id, prod, output, data);
}
exports.onTapNext = onTapNext;

function onTapBack()
{
    if((parseInt(ora)-1) < 0)
    {
        ora = 23;
    }
    else
        ora--;

    if(ora < 10)
        ora = "0" + ora;

    data = anno+""+mese+""+giorno+"Z"+ora+"00";

    pageData.set("data", anno+"/"+mese+"/"+giorno+" "+ora+":00");

    print_map(id, prod, output, data);
}
exports.onTapBack = onTapBack;