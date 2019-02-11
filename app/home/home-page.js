var frameModule = require("tns-core-modules/ui/frame");
var HomeViewModel = require("./home-view-model");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var geolocation = require("nativescript-geolocation");
var nativescript_webview_interface_1 = require("nativescript-webview-interface");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
const connectivityModule = require("tns-core-modules/connectivity");

var view = require("ui/core/view");
var drawer;
var oLangWebViewInterface;
var anno;
var mese;
var giorno;
var ora;
var currData;
var print_data;
var data;
var home;
var nome_giorno = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
var temp_data;

var homeViewModel = new HomeViewModel();

function navigatedFrom()
{
  oLangWebViewInterface.destroy();
}
exports.navigatedFrom = navigatedFrom;

function backEvent(args)
{
  console.log('Exiting');
  oLangWebViewInterface.destroy();
  geolocation.clearWatch();
}
exports.backEvent=backEvent;

function close(args)
{
  oLangWebViewInterface.destroy();
  geolocation.clearWatch();
  backEvent();
  //alert('Press again to Exit!!','WARNING')
}
exports.close = close;

function setupWebViewInterface(page)
{
  var webView = page.getViewById('webView');
  oLangWebViewInterface = new nativescript_webview_interface_1.WebViewInterface(webView, '~/www/index.html');
}

exports.pageLoaded = function(args)
{
  const page = args.object;
  setupWebViewInterface(page);
  drawer = view.getViewById(page, "sideDrawer");


  home = new Observable.fromObject({});
  home.set("current_position", "collapsed");

  data = new Date();
  ora = data.getUTCHours();
  if(ora < 10)
    ora = '0' + ora;
  mese = data.getUTCMonth() + 1;
  if(mese < 10)
    mese = '0' + mese;
  giorno = data.getUTCDate();
  if(giorno < 10)
    giorno = '0' + giorno;
  anno = data.getUTCFullYear();
  home.set("date_pick", data);
  home.set("minDate", new Date(2018, 0, 29));
  home.set("maxDate", new Date(2030, 4, 12));

  print_data = nome_giorno[data.getUTCDay()] + " " +anno+"/"+mese+"/"+giorno+" "+ora+":00";

  currData = anno+""+mese+""+giorno+"Z"+ora+"00";
  console.log(print_data);

  home.set("data", print_data);

  const myConnectionType = connectivityModule.getConnectionType();
  console.log("Connection: " + myConnectionType);

  geolocation.enableLocationRequest().then(function()
  {
    geolocation.isEnabled().then(function(isEnabled)
    {
      var location = geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000}).then(function(loc) {
        if (loc) {
          var latitudine = loc.latitude;
          var longitudine = loc.longitude;
          var place, id;

          //console.log("Latitude: " + latitudine);
          //console.log("Longitude: " + longitudine);

          if(myConnectionType==1 || myConnectionType==2)
          {
            fetch("http://193.205.230.6/places/search/bycoords/" + latitudine +"/" + longitudine + "?filter=com").then((response) => response.json()).then((data) =>
            {
              place = data[0].name.it;
              id = data[0].id;
              home.set("position", place);
              fetch("http://193.205.230.6/products/wrf5/forecast/" + id + "?date=" + currData).then((response) => response.json()).then((data1) =>
              {
                //console.log(data1);
                if (data1.result == "ok")
                {
                  home.set("current_position", "visible");
                  home.set("temp", data1.forecast.t2c + " °C");
                  home.set("wind", data1.forecast.ws10n + " knt");
                  home.set("icon", '~/meteo_icon/' + data1.forecast.icon);
                }
                else if (data1.result == "error")
                {
                  home.set("current_position", "collapsed");
                  dialog.alert({ title: "Errore", message: data1.details, okButtonText: "OK" });
                }
              })
                  .catch(error => console.error("[SEARCH] ERROR DATA ", error));
            });
          }

          setTimeout(function()
          {
            //console.log(currData);
            console.log("QUI");

            oLangWebViewInterface.emit('data', {anno:anno,mese:mese, giorno:giorno, ora:ora});
          }, 800);
        }
      }, function(e){
        console.log("Error: " + e.message);
      });
    });
  }, function(e)
  {
    home.set("current_position", "collapsed");
    oLangWebViewInterface.emit('data', {anno:anno,mese:mese, giorno:giorno, ora:ora});
    console.log("Error: " + (e.message || e));
  });

  if (args.isBackNavigation) {
    return;
  }

  page.bindingContext = home;
};

exports.toggleDrawer = function() {
  drawer.toggleDrawerState();
};

function onDatePickerLoaded(args)
{
  const datePicker = args.object;
  datePicker.on("dayChange", (args) => {
    currData = "";
    if (giorno < 10)
      giorno = "0"+args.value;
    else
      giorno = args.value;

    currData = anno+""+mese+""+giorno+"Z"+ora+"00";
    temp_data = new Date(anno, mese, giorno);
    home.set("data", nome_giorno[temp_data.getDay()] + " " +anno+"/"+mese+"/"+giorno+" "+ora+":00");
    oLangWebViewInterface.emit('prova', {data:currData});
  });
  datePicker.on("monthChange", (args) => {
    currData = "";
    if (mese < 10)
      mese = "0"+args.value;
    else
      mese = args.value;
    currData = anno+""+mese+""+giorno+"Z"+ora+"00";
    temp_data = new Date(anno, mese, giorno);
    home.set("data", nome_giorno[temp_data.getDay()] + " " +anno+"/"+mese+"/"+giorno+" "+ora+":00");
    oLangWebViewInterface.emit('prova', {data:currData});
  });
  datePicker.on("yearChange", (args) => {
    currData = "";
    anno = args.value;
    currData = anno+""+mese+""+giorno+"Z"+ora+"00";
    temp_data = new Date(anno, mese, giorno);
    home.set("data", nome_giorno[temp_data.getDay()] + " " +anno+"/"+mese+"/"+giorno+" "+ora+":00");
    oLangWebViewInterface.emit('prova', {data:currData});
  });
}
exports.onDatePickerLoaded = onDatePickerLoaded;

function onTapNext(args)
{
  if(ora+1 >23)
    ora = "0";
  else
    ora++;

  if(ora < 10)
    ora = "0" + ora;

  currData = anno+""+mese+""+giorno+"Z"+ora+"00";
  temp_data = new Date(anno, mese, giorno);

  home.set("data", nome_giorno[temp_data.getDay()] + " " +anno+"/"+mese+"/"+giorno+" "+ora+":00");
  oLangWebViewInterface.emit('prova', {data:currData});
}
exports.onTapNext = onTapNext;

function onTapBack(args)
{
  if(ora-1 < 0)
    ora = 23;
  else
    ora--;

  if(ora < 10)
    ora = "0" + ora;

  currData = anno+""+mese+""+giorno+"Z"+ora+"00";
  temp_data = new Date(anno, mese, giorno);

  home.set("data", nome_giorno[temp_data.getDay()] + " " +anno+"/"+mese+"/"+giorno+" "+ora+":00");
  oLangWebViewInterface.emit('prova', {data:currData});
}
exports.onTapBack = onTapBack;
