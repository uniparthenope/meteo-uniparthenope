var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
var Observable = require("data/observable");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
const segmentedBarModule = require("tns-core-modules/ui/segmented-bar");
const appSettings = require("application-settings");
const platformModule = require("tns-core-modules/platform");

function pageLoaded(args)
{
    var page = args.object;
    var setting = new Observable.fromObject({});
    var temp = appSettings.getNumber("Temperatura", 0);
    var wind = appSettings.getNumber("Vento", 0);
    var press = appSettings.getNumber("Pressione", 0);
    var map = appSettings.getNumber("Mappa", 0);

    if(platformModule.device.language.includes("it")){
        setting.set("map", "Mappa");
        setting.set("detail", "Dettagli");
    }
    else{
        setting.set("map", "Map");
        setting.set("detail", "Details");
    }

    setting.set("tempSelection", temp);
    setting.on(observableModule.Observable.propertyChangeEvent, (propertyChangeData) =>
    {
        if (propertyChangeData.propertyName === "tempSelection")
        {
            appSettings.setNumber("Temperatura", propertyChangeData.value);
        }
    });

    setting.set("windSelection", wind);
    setting.on(observableModule.Observable.propertyChangeEvent, (propertyChangeData) =>
    {
        if (propertyChangeData.propertyName === "windSelection")
        {
            appSettings.setNumber("Vento", propertyChangeData.value);
        }
    });

    setting.set("pressureSelection", press);
    setting.on(observableModule.Observable.propertyChangeEvent, (propertyChangeData) =>
    {
        if (propertyChangeData.propertyName === "pressureSelection")
        {
            appSettings.setNumber("Pressione", propertyChangeData.value);
        }
    });

    setting.set("mapSelection", map);
    setting.on(observableModule.Observable.propertyChangeEvent, (propertyChangeData) =>
    {
        if (propertyChangeData.propertyName === "mapSelection")
        {
            appSettings.setNumber("Mappa", propertyChangeData.value);
        }
    });

    if(platformModule.isAndroid){
        if(platformModule.device.sdkVersion <= 19)
            page.getViewById("map").visibility = "collapsed";
        else
            page.getViewById("map").visibility = "visible";
    }
    else{
        page.getViewById("map").visibility = "visible";
    }


    page.bindingContext = setting;
}

exports.pageLoaded = pageLoaded;