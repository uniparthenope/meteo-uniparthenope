const ObservableArray = require("data/observable-array").ObservableArray;
const Observable = require("data/observable");
const PageInfoViewModel = require("./info-view-model");
const infoViewModel = new PageInfoViewModel;
var utilityModule = require("utils/utils");
var frameModule = require("tns-core-modules/ui/frame");
var appversion = require("nativescript-appversion");

function pageLoaded(args) {
    const page = args.object;
    const info = new Observable.fromObject({});
    appversion.getVersionName().then(function(v) {
        page.getViewById("version").text = "Versione " + v;
    });

    page.bindingContext = info;
}

exports.pageLoaded = pageLoaded;

function onTapCopy(args) {
    var button = args.object;
    const page = button.page;

    page.frame.navigate("copyrights/copyrights-page");
}
exports.onTapCopy = onTapCopy;

function onTapDisclaimer(args) {
    var button = args.object;
    const page = button.page;

    page.frame.navigate("disclaimer/disclaimer-page");
}
exports.onTapDisclaimer = onTapDisclaimer;

function onTapPrivacy(args) {
    var button = args.object;
    const page = button.page;

    page.frame.navigate("privacy/privacy-page");
}
exports.onTapPrivacy = onTapPrivacy;
