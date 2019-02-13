const ObservableArray = require("data/observable-array").ObservableArray;
const Observable = require("data/observable");
const DisclaimerViewModel = require("./disclaimer-view-model");
const discViewModel = new DisclaimerViewModel;
var frameModule = require("tns-core-modules/ui/frame");

function pageLoaded(args)
{
    const page = args.object;
    const disc = new Observable.fromObject({});
    var url_policy = "https://api.meteo.uniparthenope.it/legal/disclaimer";

    fetch(url_policy)
        .then((response) => response.json())
        .then((data1) => {
            disc.set("policy", data1.disclaimer.it);
        })
        .catch(error => console.error("[DISC] ERROR DATA ", error));

    page.bindingContext = disc;
}

exports.pageLoaded = pageLoaded;