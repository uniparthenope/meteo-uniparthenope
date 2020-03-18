var nativescript_webview_interface_1 = require("nativescript-webview-interface");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
const appSetting = require("application-settings");

var oLangWebViewInterface;
let page;

function setupWebViewInterface(page){
  var webView = page.getViewById('webView');
  oLangWebViewInterface = new nativescript_webview_interface_1.WebViewInterface(webView, '~/www/index1.html');
  listenLangWebViewEvents();
}

exports.pageLoaded = function(args) {
  page = args.object;
  setupWebViewInterface(page);
};

function listenLangWebViewEvents(){
  oLangWebViewInterface.on('onload', () => {
    oLangWebViewInterface.emit('add_layers', {
      anno: "2020",
      mese: "03",
      giorno: "18",
      ora: "17",
      zoom: appSetting.getNumber("zoom", 5),
      map: appSetting.getString("map", "Satellite"),
      lat:appSetting.getNumber("lat_center", "40.85"),
      lang:appSetting.getNumber("lang_center", "14.28")
    });
  });

  /*
  oLangWebViewInterface.on('detail', function(eventData)
  {
    console.log(eventData);
    const nav =
        {
          moduleName: "detail/detail-page",
          context: {
            id: eventData.info_id,
            data: currData
          }
        };

    page.frame.navigate(nav);
  });

  oLangWebViewInterface.on('layer_nuvole', function (data) {
    if(data.flag)
      home.set("layer_nuvole", "visible");
    else
      home.set("layer_nuvole", "collapsed");
  });

  oLangWebViewInterface.on('layer_vento', function (data) {
    if(data.flag)
      home.set("layer_vento", "visible");
    else
      home.set("layer_vento", "collapsed");
  });

  oLangWebViewInterface.on('layer_neve', function (data) {
    if(data.flag)
      home.set("layer_neve", "visible");
    else
      home.set("layer_neve", "collapsed");
  });

  oLangWebViewInterface.on('layer_pioggia', function (data) {
    if(data.flag)
      home.set("layer_pioggia", "visible");
    else
      home.set("layer_pioggia", "collapsed");
  });

  oLangWebViewInterface.on('layer_temp', function (data) {
    if(data.flag)
      home.set("layer_temp", "visible");
    else
      home.set("layer_temp", "collapsed");
  });

  oLangWebViewInterface.on('zoom', function (data) {
    console.log("Zoom: " + data.zoom);
    appSetting.setNumber("zoom", data.zoom);
  });

  oLangWebViewInterface.on('layer_map', function (data) {
    console.log("Mappa: " + data.map);
    appSetting.setString("map", data.map);
  });

  oLangWebViewInterface.on('center_map', function (data) {
    appSetting.setNumber("lat_center", data.center.lat);
    appSetting.setNumber("lang_center", data.center.lng);
  });
   */
}
