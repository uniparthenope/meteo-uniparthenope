const ObservableArray = require("data/observable-array").ObservableArray;
const Observable = require("data/observable");
const PageInfoViewModel = require("./info-view-model");
const infoViewModel = new PageInfoViewModel;

function pageLoaded(args)
{
    const page = args.object;
    const info = new Observable.fromObject({});

    page.bindingContext = info;
}

exports.pageLoaded = pageLoaded;