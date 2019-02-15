var frameModule = require("tns-core-modules/ui/frame");
var DetailViewModel = require("./detail-view-model");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
var detailViewModel = new DetailViewModel();

var press;
var temp;
var pageData;

function pageLoaded(args) {
    var page = args.object;
    temp = new ObservableArray();
    press = new ObservableArray();

    pageData = new Observable.fromObject({
        temp: temp,
        press: press
    });


    fetch("https://api.meteo.uniparthenope.it/products/wrf5/timeseries/com63049?step=24")
        .then((response) => response.json())
        .then((data) => {
            var timeSeries=data['timeseries'];
            for (var i = 0; i < timeSeries.length; i++) {
                let date=timeSeries[i].dateTime;
                let year = date.substring(0, 4);
                let month = date.substring(4, 6);
                let day = date.substring(6, 8);
                let sDateTime=year + "-" + month + "-" + day;

                temp.push({key: sDateTime, val: timeSeries[i].t2c});
                press.push({key: sDateTime, val: timeSeries[i].slp});
            }
        })
        .catch(error => console.error("ERROR DATA ", error));

    page.bindingContext = pageData;
}
exports.pageLoaded = pageLoaded;
