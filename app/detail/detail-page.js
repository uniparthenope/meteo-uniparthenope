const ObservableArray = require("data/observable-array").ObservableArray;
const Observable = require("data/observable");
var frameModule = require("tns-core-modules/ui/frame");
const PageDatilViewModel = require("./detail-view-model");
const detailViewModel = new PageDatilViewModel;

function pageLoaded(args)
{
    const page = args.object;
    const detail = new Observable.fromObject({});

    page.bindingContext = detail;
}

exports.pageLoaded = pageLoaded;

