const ObservableArray = require("data/observable-array").ObservableArray;
const Observable = require("data/observable");
const CopyInfoViewModel = require("./copyrights-view-model");
const copyViewModel = new CopyInfoViewModel;
var frameModule = require("tns-core-modules/ui/frame");
const html_view = require("tns-core-modules/ui/html-view").HtmlView;

function pageLoaded(args)
{
    const page = args.object;
    const copy = new Observable.fromObject({});

    page.bindingContext = copy;
}

exports.pageLoaded = pageLoaded;