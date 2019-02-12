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

    const html = new html_view();
    html.html = "<span><h1><font color=\"blue\">NativeScript HtmlView</font></h1></br><h3>This component accept simple HTML strings</h3></span>";
    copy.set("htmlString", html.html);

    page.bindingContext = copy;
}

exports.pageLoaded = pageLoaded;