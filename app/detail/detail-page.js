var chart = require("nativescript-ui-chart");
var frameModule = require("tns-core-modules/ui/frame");
var DetailViewModel = require("./detail-view-model");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
var detailViewModel = new DetailViewModel();
var Color = require("tns-core-modules/color");
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
var prod = "wrf5";
var output = "gen";

var tempColors = [
    "#2400d8",
    "#181cf7",
    "#2857ff",
    "#3d87ff",
    "#56b0ff",
    "#75d3ff",
    "#99eaff",
    "#bcf8ff",
    "#eaffff",
    "#ffffea",
    "#fff1bc",
    "#ffd699",
    "#ffff75",
    "#ff7856",
    "#ff3d3d",
    "#f72735",
    "#d8152f",
    "#a50021"
];

function pageLoaded(args) {
    var page = args.object;
    temp = new ObservableArray();
    press = new ObservableArray();
    array = new ObservableArray();

    pageData = new Observable.fromObject({
        temp: temp,
        press: press,
        statistic: array,
        map:map
    });

    place = page.navigationContext.place;
    id = page.navigationContext.id;
    data = page.navigationContext.data;
    console.log(data);
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
        .catch(error => console.error("ERROR DATA ", error));

    fetch("https://api.meteo.uniparthenope.it/products/wrf5/forecast/" + id)
        .then((response) => response.json())
        .then((data) => {
            if (data.result == "ok")
            {
                if (appSetting.getNumber("Temperatura", 0) == 0)
                    pageData.set("temperatura", data.forecast.t2c + " °C");
                else if (appSetting.getNumber("Temperatura", 0) == 1) {
                    pageData.set("temperatura", ((data.forecast.t2c * 1.8) + 32).toFixed(2) + " °F");
                }

                pageData.set("meteo", data.forecast.text);
                pageData.set("cloud", (data.forecast.clf * 100) + " %");
                pageData.set("humidity", data.forecast.rh2 + " %");

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
        .catch(error => console.error("ERROR DATA ", error));


    fetch("https://api.meteo.uniparthenope.it/products/wrf5/timeseries/" + id +"?hours=0&step=24")
        .then((response) => response.json())
        .then((data) =>
        {
            for(let i=0; i<data.timeseries.length; i++)
            {
                let weekDayLabel=dayOfWeek(data.timeseries[i]['dateTime']) + " - " + data.timeseries[i]['dateTime'].substring(6,8) + " " + monthOfYear(data.timeseries[i]['dateTime']);
                array.push({"forecast":weekDayLabel, "image": "~/meteo_icon/" + data.timeseries[i].icon, "TMin": data.timeseries[i]['t2c-min'], "TMax": data.timeseries[i]['t2c-max'], "Wind":data.timeseries[i].winds, "Rain": data.timeseries[i].crh});
            }
        })
        .catch(error => console.error("ERROR DATA", error));

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

    page.bindingContext = pageData;
}
exports.pageLoaded = pageLoaded;


function temp2color(temp) {
    var index=0;

    if (temp>=-40 && temp<-30) {
        index=0;
    } else if (temp>=-30 && temp<-20) {
        index=1;
    } else if (temp>=-20 && temp<-15) {
        index=2;
    } else if (temp>=-15 && temp<-10) {
        index=3;
    } else if (temp>=-10 && temp<-5) {
        index=4;
    } else if (temp>=-5 && temp<0) {
        index=5;
    } else if (temp>=0 && temp<3) {
        index=6;
    } else if (temp>=3 && temp<6) {
        index=7;
    } else if (temp>=6 && temp<9) {
        index=8;
    } else if (temp>=9 && temp<12) {
        index=9;
    } else if (temp>=12 && temp<15) {
        index=10;
    } else if (temp>=15 && temp<18) {
        index=11;
    } else if (temp>=18 && temp<21) {
        index=12;
    } else if (temp>=21 && temp<25) {
        index=13;
    } else if (temp>=25 && temp<30) {
        index=14;
    } else if (temp>=30 && temp<40) {
        index=15;
    } else if (temp>=40 && temp<50) {
        index=16;
    } else if (temp>=50 ) {
        index=17;
    }

    return tempColors[index];
}

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
    return isNaN(dayOfWeek) ? null : ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'][dayOfWeek];
};

function monthOfYear(date) {
    let month = parseInt(date.substring(4, 6)) - 1;
    return isNaN(month) ? null : ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"][month];
};