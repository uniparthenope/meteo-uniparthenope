const ObservableArray = require("data/observable-array").ObservableArray;
const Observable = require("data/observable");
const PageInfoViewModel = require("./info-view-model");
const infoViewModel = new PageInfoViewModel;
var utilityModule = require("utils/utils");
var frameModule = require("tns-core-modules/ui/frame");

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

const Button = require("tns-core-modules/ui/button").Button;
const Page = require("tns-core-modules/ui/page").Page;

function onTapCopy(args)
{
    var button = args.object;
    const page = button.page;

    page.frame.navigate("copyrights/copyrights-page");
}
exports.onTapCopy = onTapCopy;

function onTapDisclaimer(args)
{
    var button = args.object;
    const page = button.page;

    page.frame.navigate("disclaimer/disclaimer-page");
}
exports.onTapDisclaimer = onTapDisclaimer;
