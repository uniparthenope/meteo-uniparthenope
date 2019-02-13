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
    /*html.html = "<h6>Meteo Uniparthenope</h6></br>" +
        "<h6>Copyright 2019 UniParthenope </h6></br>" +
        "<h6>Licensed under the Apache License, Version 2.0 (the \"License\")" +
        "you may not use this file except in compliance with the License." +
        "You may obtain a copy of the License at</h6></br>" +
        "<h6>http://www.apache.org/licenses/LICENSE-2.0</h6></br>" +
        "<h6>Unless required by applicable law or agreed to in writing, software" +
        "distributed under the License is distributed on an \"AS IS\" BASIS" +
        "WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied." +
        "See the License for the specific language governing permissions and" +
        "limitations under the License.</h6>" +
        "<h6>---------------------------------</h6></br>" +
        "<h6>Leaflet</h6></br>" +
        "<h6>Copyright (c) 2010-2018, Vladimir Agafonkin</h6></br>"+
        "<h6>Copyright (c) 2010-2011, CloudMade</h6></br>";
    copy.set("htmlString", html.html);
*/
    page.bindingContext = copy;
}

exports.pageLoaded = pageLoaded;