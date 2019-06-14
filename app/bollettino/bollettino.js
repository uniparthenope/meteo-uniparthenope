const ObservableArray = require("data/observable-array").ObservableArray;
const Observable = require("data/observable");
let xml2js = require('nativescript-xml2js');
let fs = require("tns-core-modules/file-system");
const httpModule = require("tns-core-modules/http");

let page;
let viewModel;
let items;

function onNavigatingTo(args) {
    page = args.object;
    items = new ObservableArray();
    viewModel = Observable.fromObject({
        items:items
    });


    let dest = fs.path.join(fs.knownFolders.currentApp().path, "/rss.xml");
    let url = "https://meteo.uniparthenope.it/rss/weatherreports";
    httpModule.getFile(url, dest).then(function (r) {
        let parser = new xml2js.Parser();
        r.readText().then(function  (data){
            parser.parseString(data, function (err, result) {
                for(let i=0; i<result.rss.channel[0].item.length; i++)
                {
                    const myHtmlString = result.rss.channel[0].item[i].description.toString();
                    const title = result.rss.channel[0].item[i].title.toString();
                    const date = result.rss.channel[0].item[i].pubDate.toString();
                    let data = extractData(date);

                    items.push({
                        title: title,
                        date:data,
                        date_text: data.getDate() + "/" +(data.getMonth()+1) + "/" +data.getFullYear() + " " + data.getHours() + ":" +data.getMinutes(),
                        items: [
                            {
                                desc: myHtmlString
                            }
                        ]
                    });
                    items.sort(function (orderA, orderB) {
                        let nameA = orderA.date;
                        let nameB = orderB.date;
                        return (nameA > nameB) ? -1 : (nameA < nameB) ? 1 : 0;
                    });
                }
            });
        });
    },function (e) {
        console.log(e);
    });


    page.bindingContext = viewModel;
}


function extractData(data) {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    let day = data.substr(5,2);
    let month = data.substr(8,3);
    let year = data.substr(12,4);
    let hour = data.substr(17,2);
    let min = data.substr(20,2);

    let index_month = months.indexOf(month);
    let d = new Date(year, index_month, day, hour, min);

    return d;
}

exports.onNavigatingTo = onNavigatingTo;
