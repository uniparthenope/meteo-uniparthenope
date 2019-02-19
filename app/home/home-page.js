var frameModule = require("tns-core-modules/ui/frame");
var HomeViewModel = require("./home-view-model");
var geolocation = require("nativescript-geolocation");
var nativescript_webview_interface_1 = require("nativescript-webview-interface");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
const connectivityModule = require("tns-core-modules/connectivity");
const appSetting = require("application-settings");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var autocompleteModule = require("nativescript-ui-autocomplete");

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
var gps_on = false;
var latitudine;
var longitudine;
let page;
var homeViewModel = new HomeViewModel();

function navigatedFrom()
{
  oLangWebViewInterface.destroy();
}
exports.navigatedFrom = navigatedFrom;

function setupWebViewInterface(page)
{
  var webView = page.getViewById('webView');
  oLangWebViewInterface = new nativescript_webview_interface_1.WebViewInterface(webView, '~/www/index.html');
  listenLangWebViewEvents();
}

exports.pageLoaded = function(args)
{
  page = args.object;
  setupWebViewInterface(page);
  drawer = view.getViewById(page, "sideDrawer");

  home = new Observable.fromObject({});
  home.set("current_position", "collapsed");
  home.set("search", "collapsed");

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
      gps_on = isEnabled;
      console.log("GPS: " + gps_on);

      var location = geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000}).then(function(loc) {
        if (loc) {
          latitudine = loc.latitude;
          longitudine = loc.longitude;
          var place, id;

          //console.log("Latitude: " + latitudine);
          //console.log("Longitude: " + longitudine);

          if(myConnectionType==1 || myConnectionType==2)
          {
            fetch("https://api.meteo.uniparthenope.it/places/search/bycoords/" + latitudine +"/" + longitudine + "?filter=com").then((response) => response.json()).then((data) =>
            {
              place = data[0].name.it;
              id = data[0].id;
              home.set("position", place);
              fetch("https://api.meteo.uniparthenope.it/products/wrf5/forecast/" + id + "?date=" + currData).then((response) => response.json()).then((data1) =>
              {
                //console.log(data1);
                if (data1.result == "ok")
                {
                  home.set("current_position", "visible");
                  if(appSetting.getNumber("Temperatura", 0) == 0)
                    home.set("temp", data1.forecast.t2c + " °C");
                  else if(appSetting.getNumber("Temperatura",0) == 1) {
                    home.set("temp", ((data1.forecast.t2c * 1.8) + 32).toFixed(2) + " °F");
                  }
                  if(appSetting.getNumber("Vento", 0) == 0)
                    home.set("wind", data1.forecast.ws10n + " kn");
                  else if(appSetting.getNumber("Vento", 0) == 1)
                  {
                    home.set("wind", (data1.forecast.ws10n * 1.852).toFixed(2) + " km/h");
                  }
                  else if(appSetting.getNumber("Vento", 0) == 2) {
                    home.set("wind", (data1.forecast.ws10n * 0.514444).toFixed(2) + " m/s");
                  }
                  else if(appSetting.getNumber("Vento",0) == 3)
                  {
                    home.set("wind", (get_beaufort(data1.forecast.ws10n)) + " beaufort");
                  }

                  home.set("wind_direction", data1.forecast.winds);
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
            oLangWebViewInterface.emit('data', {anno:anno,mese:mese, giorno:giorno, ora:ora});
          }, 800);

          setTimeout(function()
          {
            oLangWebViewInterface.emit('location', {lat:latitudine,lang:longitudine});
          }, 800);

          setTimeout(function()
          {
            oLangWebViewInterface.emit('settings', {gradi:appSetting.getNumber("Temperatura",0), vento:appSetting.getNumber("Vento",0), pressione:appSetting.getNumber("Pressione",0)});
          }, 800);
        }
      }, function(e){
        console.log("Error: " + e.message);
      });
    });
  }, function(e)
  {
    home.set("current_position", "collapsed");
    home.set("search", "visible");
    oLangWebViewInterface.emit('data', {anno:anno,mese:mese, giorno:giorno, ora:ora});
    oLangWebViewInterface.emit('settings', {gradi:appSetting.getNumber("Temperatura",0), vento:appSetting.getNumber("Vento",0), pressione:appSetting.getNumber("Pressione",0)});
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
    oLangWebViewInterface.emit('new_data', {data:currData});
    if(gps_on)
      oLangWebViewInterface.emit('location', {lat:latitudine, lang:longitudine});

    oLangWebViewInterface.emit('settings', {gradi:appSetting.getNumber("Temperatura",0), vento:appSetting.getNumber("Vento",0), pressione:appSetting.getNumber("Pressione",0)});
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
    oLangWebViewInterface.emit('new_data', {data:currData});
    if(gps_on)
      oLangWebViewInterface.emit('location', {lat:latitudine, lang:longitudine});
    oLangWebViewInterface.emit('settings', {gradi:appSetting.getNumber("Temperatura",0), vento:appSetting.getNumber("Vento",0), pressione:appSetting.getNumber("Pressione",0)});
  });
  datePicker.on("yearChange", (args) => {
    currData = "";
    anno = args.value;
    currData = anno+""+mese+""+giorno+"Z"+ora+"00";
    temp_data = new Date(anno, mese, giorno);
    home.set("data", nome_giorno[temp_data.getDay()] + " " +anno+"/"+mese+"/"+giorno+" "+ora+":00");
    oLangWebViewInterface.emit('new_data', {data:currData});
    if(gps_on)
      oLangWebViewInterface.emit('location', {lat:latitudine, lang:longitudine});

    oLangWebViewInterface.emit('settings', {gradi:appSetting.getNumber("Temperatura",0), vento:appSetting.getNumber("Vento",0), pressione:appSetting.getNumber("Pressione",0)});
  });
}
exports.onDatePickerLoaded = onDatePickerLoaded;

function onTapNext(args)
{
  if((parseInt(ora)+1) >23)
  {
    ora =0;
    giorno++;
  }
  else
    ora++;

  if(ora < 10)
    ora = "0" + ora;
  if(giorno < 10)
    giorno = "0" + giorno;

  currData = anno+""+mese+""+giorno+"Z"+ora+"00";
  temp_data = new Date(anno, mese, giorno);

  home.set("data", nome_giorno[temp_data.getDay()] + " " +anno+"/"+mese+"/"+giorno+" "+ora+":00");
  oLangWebViewInterface.emit('new_data', {data:currData});

  if(gps_on)
    oLangWebViewInterface.emit('location', {lat:latitudine, lang:longitudine});

  oLangWebViewInterface.emit('settings', {gradi:appSetting.getNumber("Temperatura",0), vento:appSetting.getNumber("Vento",0), pressione:appSetting.getNumber("Pressione",0)});
}
exports.onTapNext = onTapNext;

function onTapBack(args)
{
  if((parseInt(ora)-1) < 0)
  {
    ora = 23;
    giorno--;
  }
  else
    ora--;

  if(ora < 10)
    ora = "0" + ora;

  currData = anno+""+mese+""+giorno+"Z"+ora+"00";
  temp_data = new Date(anno, mese, giorno);

  home.set("data", nome_giorno[temp_data.getDay()] + " " +anno+"/"+mese+"/"+giorno+" "+ora+":00");
  oLangWebViewInterface.emit('new_data', {data:currData});

  if(gps_on)
    oLangWebViewInterface.emit('location', {lat:latitudine, lang:longitudine});

  oLangWebViewInterface.emit('settings', {gradi:appSetting.getNumber("Temperatura",0), vento:appSetting.getNumber("Vento",0), pressione:appSetting.getNumber("Pressione",0)});
}
exports.onTapBack = onTapBack;

function onTapSettings(args)
{
  var button = args.object;
  const page = button.page;

  page.frame.navigate("settings/setting-page");
}
exports.onTapSettings = onTapSettings;

function onTapInfo(args)
{
    const button = args.object;
    const  page = button.page;

    page.frame.navigate("info/info-page");
}
exports.onTapInfo = onTapInfo;

function onTapCenter()
{
  var position = home.get("position");
  oLangWebViewInterface.emit('centro', {position:position });
}
exports.onTapCenter = onTapCenter;

function get_beaufort(nodi)
{
  if(nodi < 1)
    return 0;
  if(nodi>= 1 && nodi<=2)
    return 1;
  if(nodi>=3 && nodi <=6)
    return 2;
  if(nodi>=7 && nodi <=10)
    return 3;
  if(nodi>=11 && nodi <=15)
    return 4;
  if(nodi>=16 && nodi <=20)
    return 5;
  if(nodi>=21 && nodi <=26)
    return 6;
  if(nodi>=27 && nodi <=33)
    return 7;
  if(nodi>=34 && nodi <=40)
    return 8;
  if(nodi>=41 && nodi <=47)
    return 9;
  if(nodi>=48 && nodi <=55)
    return 10;
  if(nodi>=56 && nodi <=63)
    return 11;
  if(nodi>=64)
    return 12;
}

function listenLangWebViewEvents()
{
  oLangWebViewInterface.on('detail', function(eventData)
  {
    console.log(eventData);

    const nav =
        {
          moduleName: "detail/detail-page",
          context: {
            id: eventData.info_id,
            place: eventData.citta
          }
        };

    page.frame.navigate(nav);
  });
}

var items = new ObservableArray([]);
function onTextChanged(args)
{
  fetch("https://api.meteo.uniparthenope.it/places/search/byname/autocomplete?term=" + args.text).then((response) => response.json()).then((data) =>
  {
    items.splice(0);
    for(let i=0; i<data.length; i++) {
      //console.log(data[i].label);
      items.push(new autocompleteModule.TokenModel(data[i].label));
    }
  });

  home.set("posti", items);
  //items.splice(0);
}
exports.onTextChanged = onTextChanged;


function didAutoComplete  (args) {
  let name = (args.text);
  console.log(name);
  oLangWebViewInterface.emit('place_searched', {name:name});
}
exports.didAutoComplete   = didAutoComplete;