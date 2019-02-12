const ObservableArray = require("data/observable-array").ObservableArray;
const Observable = require("data/observable");
const PageInfoViewModel = require("./info-view-model");
const infoViewModel = new PageInfoViewModel;
var utilityModule = require("utils/utils");

function pageLoaded(args)
{
    const page = args.object;
    const info = new Observable.fromObject({});

    page.bindingContext = info;
}

exports.pageLoaded = pageLoaded;

function meteo_web(args)
{
    utilityModule.openUrl("https://meteo.uniparthenope.it");
}
exports.meteo_web = meteo_web;