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
var utils = require("tns-core-modules/utils/utils");
var dialog = require("tns-core-modules/ui/dialogs");
require( "nativescript-master-technology" );
const platformModule = require("tns-core-modules/platform");
const perm_loc = require("nativescript-advanced-permissions/location");

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
var name_day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var temp_data;
var gps_on = false;
var latitudine;
var longitudine;
let page;
var homeViewModel = new HomeViewModel();
var url_api = "https://api.meteo.uniparthenope.it/";
var preferiti;
var myPref = new ObservableArray();

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
  contatore++;
  console.log("Contatore: " + contatore);

  preferiti = JSON.parse(appSetting.getString("preferiti" , "[]"));

  home = new Observable.fromObject({
    myPref: myPref
  });

  console.log(preferiti.length);
  myPref.splice(0);
  for(var i=0; i<preferiti.length; i++)
    myPref.push({"title": preferiti[i], id: myPref.length});
  home.set("heigt_pref", 50*preferiti.length);

  home.set("current_position", "collapsed");
  home.set("search", "collapsed");
  home.set("no_pref", "visible");
  home.set("pref", "collapsed");

  home.set("layer_vento", "visible");
  home.set("layer_nuvole", "visible");
  home.set("layer_neve", "visible");
  home.set("layer_pioggia", "visible");
  home.set("layer_temp", "collapsed");

  drawer = view.getViewById(page,"sideDrawer");

  console.log("GLOBAL ID: " + global_id);

  if(contatore == 1) {
    data = new Date();
    ora = data.getUTCHours();
    if (ora < 10)
      ora = '0' + ora;
    mese = data.getUTCMonth() + 1;
    if (mese < 10)
      mese = '0' + mese;
    giorno = data.getUTCDate();
    if (giorno < 10)
      giorno = '0' + giorno;
    anno = data.getUTCFullYear();
    home.set("date_pick", data);
    home.set("minDate", new Date(2018, 0, 29));
    home.set("maxDate", new Date(2030, 4, 12));

    if(platformModule.device.language == 'it')
      print_data = nome_giorno[data.getUTCDay()] + " " + giorno + "/" + mese + "/" + anno + " " + ora + ":00";
    else
      print_data = name_day[data.getUTCDay()] + " " + mese + "/" + giorno + "/" + anno + " " + ora + ":00";

    currData = anno + "" + mese + "" + giorno + "Z" + ora + "00";
    console.log(print_data);

    home.set("data", print_data);
  }
  else
  {
    data = new Date(anno, mese-1, giorno);
    home.set("date_pick", data);
    home.set("minDate", new Date(2018, 0, 29));
    home.set("maxDate", new Date(2030, 4, 12));

    if(platformModule.device.language == 'it')
      print_data = nome_giorno[data.getUTCDay()] + " " + giorno + "/" + mese + "/" + anno + " " + ora + ":00";
    else
      print_data = name_day[data.getUTCDay()] + " " + mese + "/" + giorno + "/" + anno + " " + ora + ":00";

    currData = anno + "" + mese + "" + giorno + "Z" + ora + "00";
    console.log(print_data);

    home.set("data", print_data);
  }

  console.log("LOCATION PERMISSION: ", perm_loc.hasLocationPermissions());

    if (global_id == " ") {
      geolocation.enableLocationRequest().then(function () {
        geolocation.isEnabled().then(function (isEnabled) {
          gps_on = isEnabled;
          console.log("GPS: " + gps_on);
          geolocation.getCurrentLocation({
            desiredAccuracy: 3,
            updateDistance: 10,
            maximumAge: 10000,
            timeout: 10000
          }).then(function (loc) {
            if (loc) {
              home.set("search", "collapsed");
              latitudine = loc.latitude;
              longitudine = loc.longitude;
              console.log(latitudine);
              console.log(longitudine);
              var place, id;

              fetch(url_api + "places/search/bycoords/" + latitudine + "/" + longitudine + "?filter=com").then((response) => response.json()).then((data) => {
                place = data[0].long_name.it;

                if (place.includes("Municipalit")) {
                  var tmp = place.split("-");
                  var tmp1 = tmp.pop();
                  home.set("position", tmp1);
                  place_selected = tmp1;
                  console.log("POSTO : " + place_selected);
                } else {
                  home.set("position", place);
                  place_selected = place;
                  console.log("POSTO : " + place_selected);
                }

                id = data[0].id;
                global_id = id;

                var found = false;
                console.log(preferiti);
                for(var i=0; i<preferiti.length; i++) {
                  if(place_selected === preferiti[i])
                  {
                    found = true;
                  }
                }
                console.log(found);
                if(found)
                {
                  home.set("pref", "visible");
                  home.set("no_pref", "collapsed");
                }
                else {
                  home.set("no_pref", "visible");
                  home.set("pref", "collapsed");
                }

                fetch(url_api + "products/wrf5/forecast/" + global_id + "?date=" + currData).then((response) => response.json()).then((data1) => {
                  //console.log(data1);
                  if (data1.result == "ok") {
                    home.set("current_position", "visible");
                    if (appSetting.getNumber("Temperatura", 0) == 0)
                      home.set("temp", data1.forecast.t2c + " °C");
                    else if (appSetting.getNumber("Temperatura", 0) == 1) {
                      home.set("temp", ((data1.forecast.t2c * 1.8) + 32).toFixed(2) + " °F");
                    }
                    if (appSetting.getNumber("Vento", 0) == 0)
                      home.set("wind", data1.forecast.ws10n + " kn");
                    else if (appSetting.getNumber("Vento", 0) == 1) {
                      home.set("wind", (data1.forecast.ws10n * 1.852).toFixed(2) + " km/h");
                    } else if (appSetting.getNumber("Vento", 0) == 2) {
                      home.set("wind", (data1.forecast.ws10n * 0.514444).toFixed(2) + " m/s");
                    } else if (appSetting.getNumber("Vento", 0) == 3) {
                      home.set("wind", (get_beaufort(data1.forecast.ws10n)) + " beaufort");
                    }

                    home.set("wind_direction", data1.forecast.winds);
                    home.set("icon", '~/meteo_icon/' + data1.forecast.icon);
                  } else if (data1.result == "error") {
                    home.set("current_position", "collapsed");
                    dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
                  }

                  setTimeout(function () {
                    oLangWebViewInterface.emit('language', {lingua: platformModule.device.language});
                  }, 900);

                  setTimeout(function () {
                    oLangWebViewInterface.emit('data', {anno: anno, mese: mese, giorno: giorno, ora: ora});
                  }, 900);

                  setTimeout(function () {
                    oLangWebViewInterface.emit('location', {lat: latitudine, lang: longitudine});
                  }, 900);

                  setTimeout(function () {
                    oLangWebViewInterface.emit('settings', {
                      gradi: appSetting.getNumber("Temperatura", 0),
                      vento: appSetting.getNumber("Vento", 0),
                      pressione: appSetting.getNumber("Pressione", 0)
                    });
                  }, 900);
                })
                    .catch(error => console.error("[SEARCH] ERROR DATA ", error));
              });
            }
          }, function (e) {
            dialog.alert({title: "Errore", message: e.message, okButtonText: "OK"});
            home.set("current_position", "collapsed");
            home.set("search", "visible");
            setTimeout(function () {
              oLangWebViewInterface.emit('language', {lingua: platformModule.device.language});
            }, 800);

            setTimeout(function () {
              oLangWebViewInterface.emit('data', {anno: anno, mese: mese, giorno: giorno, ora: ora});
            }, 800);

            setTimeout(function () {
              oLangWebViewInterface.emit('settings', {
                gradi: appSetting.getNumber("Temperatura", 0),
                vento: appSetting.getNumber("Vento", 0),
                pressione: appSetting.getNumber("Pressione", 0)
              });
            }, 800);
          });
        });
      }, function (e) {
        gps_on = false;
        home.set("current_position", "collapsed");
        home.set("search", "visible");

        setTimeout(function () {
          oLangWebViewInterface.emit('language', {lingua: platformModule.device.language});
        }, 800);

        setTimeout(function () {
          oLangWebViewInterface.emit('data', {anno: anno, mese: mese, giorno: giorno, ora: ora});
        }, 800);

        setTimeout(function () {
          oLangWebViewInterface.emit('settings', {
            gradi: appSetting.getNumber("Temperatura", 0),
            vento: appSetting.getNumber("Vento", 0),
            pressione: appSetting.getNumber("Pressione", 0)
          });
        }, 800);
        console.log("Error: " + (e.message || e));
      });
    } else {
      fetch(url_api + "products/wrf5/forecast/" + global_id + "?date=" + currData + "&opt=place").then((response) => response.json()).then((data1) => {
        var place = data1.place.long_name.it;

        if (place.includes("Municipalit")) {
          var tmp = place.split("-");
          var tmp1 = tmp.pop();
          home.set("position", tmp1);
          place_selected = tmp1;
          console.log("POSTO : " + place_selected);
        } else {
          home.set("position", place);
          place_selected = place;
          console.log("POSTO : " + place_selected);
        }

        var found = false;
        console.log(preferiti);
        for(var i=0; i<preferiti.length; i++) {
          console.log(preferiti[i]);
          if(place_selected === preferiti[i])
          {
            found = true;
          }
        }
        console.log(found);
        if(found)
        {
          home.set("pref", "visible");
          home.set("no_pref", "collapsed");
        }
        else {
          home.set("no_pref", "visible");
          home.set("pref", "collapsed");
        }

        if (data1.result == "ok") {
          home.set("current_position", "visible");
          if (appSetting.getNumber("Temperatura", 0) == 0)
            home.set("temp", data1.forecast.t2c + " °C");
          else if (appSetting.getNumber("Temperatura", 0) == 1) {
            home.set("temp", ((data1.forecast.t2c * 1.8) + 32).toFixed(2) + " °F");
          }
          if (appSetting.getNumber("Vento", 0) == 0)
            home.set("wind", data1.forecast.ws10n + " kn");
          else if (appSetting.getNumber("Vento", 0) == 1) {
            home.set("wind", (data1.forecast.ws10n * 1.852).toFixed(2) + " km/h");
          } else if (appSetting.getNumber("Vento", 0) == 2) {
            home.set("wind", (data1.forecast.ws10n * 0.514444).toFixed(2) + " m/s");
          } else if (appSetting.getNumber("Vento", 0) == 3) {
            home.set("wind", (get_beaufort(data1.forecast.ws10n)) + " beaufort");
          }

          home.set("wind_direction", data1.forecast.winds);
          home.set("icon", '~/meteo_icon/' + data1.forecast.icon);
        } else if (data1.result == "error") {
          home.set("current_position", "collapsed");
          dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
        }
      })
          .catch(error => console.error("[SEARCH] ERROR DATA ", error));
    }

  if (args.isBackNavigation) {
      oLangWebViewInterface.destroy();
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
    console.log("Giorno cambiato: " + args.value);
    currData = " ";
    if (args.value < 10)
      giorno = "0"+args.value;
    else
      giorno = args.value;

    currData = anno+""+mese+""+giorno+"Z"+ora+"00";
    temp_data = new Date(anno, mese-1, giorno);
    data = new Date(anno, mese-1, giorno);

    if(platformModule.device.language == 'it')
      home.set("data", nome_giorno[data.getUTCDay()] + " " + giorno + "/" + mese + "/" + anno + " " + ora + ":00");
    else
      home.set("data", name_day[data.getUTCDay()] + " " + mese + "/" + giorno + "/" + anno + " " + ora + ":00");

    oLangWebViewInterface.emit('language', {lingua: platformModule.device.language});

    oLangWebViewInterface.emit('new_data', {data:currData});
    if(gps_on)
      oLangWebViewInterface.emit('location', {lat:latitudine, lang:longitudine});

    oLangWebViewInterface.emit('settings', {gradi:appSetting.getNumber("Temperatura",0), vento:appSetting.getNumber("Vento",0), pressione:appSetting.getNumber("Pressione",0)});

    var position = home.get("position");
    console.log(position);
    if(gps_on) {
      home.set("search", "collapsed");
        fetch(url_api + "products/wrf5/forecast/" + global_id + "?date=" + currData).then((response) => response.json()).then((data1) => {
          if (data1.result == "ok") {
            home.set("current_position", "visible");
            if (appSetting.getNumber("Temperatura", 0) == 0)
              home.set("temp", data1.forecast.t2c + " °C");
            else if (appSetting.getNumber("Temperatura", 0) == 1) {
              home.set("temp", ((data1.forecast.t2c * 1.8) + 32).toFixed(2) + " °F");
            }
            if (appSetting.getNumber("Vento", 0) == 0)
              home.set("wind", data1.forecast.ws10n + " kn");
            else if (appSetting.getNumber("Vento", 0) == 1) {
              home.set("wind", (data1.forecast.ws10n * 1.852).toFixed(2) + " km/h");
            } else if (appSetting.getNumber("Vento", 0) == 2) {
              home.set("wind", (data1.forecast.ws10n * 0.514444).toFixed(2) + " m/s");
            } else if (appSetting.getNumber("Vento", 0) == 3) {
              home.set("wind", (get_beaufort(data1.forecast.ws10n)) + " beaufort");
            }

            home.set("wind_direction", data1.forecast.winds);
            home.set("icon", '~/meteo_icon/' + data1.forecast.icon);
          } else if (data1.result == "error") {
            home.set("current_position", "collapsed");
            dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
          }
        })
            .catch(error => console.error("[SEARCH] ERROR DATA ", error));
    }
  });

  datePicker.on("monthChange", (args) => {
      console.log("Mese cambiato");
    currData = " ";
    if (args.value < 10)
      mese = "0"+args.value;
    else
      mese = args.value;
    currData = anno+""+mese+""+giorno+"Z"+ora+"00";
    temp_data = new Date(anno, mese-1, giorno);
    data = new Date(anno, mese-1, giorno);

    if(platformModule.device.language == 'it')
      home.set("data", nome_giorno[data.getUTCDay()] + " " + giorno + "/" + mese + "/" + anno + " " + ora + ":00");
    else
      home.set("data", name_day[data.getUTCDay()] + " " + mese + "/" + giorno + "/" + anno + " " + ora + ":00");

    oLangWebViewInterface.emit('language', {lingua: platformModule.device.language});
    oLangWebViewInterface.emit('new_data', {data:currData});
    if(gps_on)
      oLangWebViewInterface.emit('location', {lat:latitudine, lang:longitudine});
    oLangWebViewInterface.emit('settings', {gradi:appSetting.getNumber("Temperatura",0), vento:appSetting.getNumber("Vento",0), pressione:appSetting.getNumber("Pressione",0)});

    var position = home.get("position");
    console.log(position);
    if(gps_on) {
      home.set("search", "collapsed");
        fetch(url_api + "products/wrf5/forecast/" + global_id + "?date=" + currData).then((response) => response.json()).then((data1) => {
          if (data1.result == "ok") {
            home.set("current_position", "visible");
            if (appSetting.getNumber("Temperatura", 0) == 0)
              home.set("temp", data1.forecast.t2c + " °C");
            else if (appSetting.getNumber("Temperatura", 0) == 1) {
              home.set("temp", ((data1.forecast.t2c * 1.8) + 32).toFixed(2) + " °F");
            }
            if (appSetting.getNumber("Vento", 0) == 0)
              home.set("wind", data1.forecast.ws10n + " kn");
            else if (appSetting.getNumber("Vento", 0) == 1) {
              home.set("wind", (data1.forecast.ws10n * 1.852).toFixed(2) + " km/h");
            } else if (appSetting.getNumber("Vento", 0) == 2) {
              home.set("wind", (data1.forecast.ws10n * 0.514444).toFixed(2) + " m/s");
            } else if (appSetting.getNumber("Vento", 0) == 3) {
              home.set("wind", (get_beaufort(data1.forecast.ws10n)) + " beaufort");
            }

            home.set("wind_direction", data1.forecast.winds);
            home.set("icon", '~/meteo_icon/' + data1.forecast.icon);
          } else if (data1.result == "error") {
            home.set("current_position", "collapsed");
            dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
          }
        })
            .catch(error => console.error("[SEARCH] ERROR DATA ", error));
    }
  });

  datePicker.on("yearChange", (args) => {
    currData = "";
    anno = args.value;
    currData = anno+""+mese+""+giorno+"Z"+ora+"00";
    temp_data = new Date(anno, mese-1, giorno);
    data = new Date(anno, mese-1, giorno);

    if(platformModule.device.language == 'it')
      home.set("data", nome_giorno[data.getUTCDay()] + " " + giorno + "/" + mese + "/" + anno + " " + ora + ":00");
    else
      home.set("data", name_day[data.getUTCDay()] + " " + mese + "/" + giorno + "/" + anno + " " + ora + ":00");

    oLangWebViewInterface.emit('language', {lingua: platformModule.device.language});

    oLangWebViewInterface.emit('new_data', {data:currData});
    if(gps_on)
      oLangWebViewInterface.emit('location', {lat:latitudine, lang:longitudine});

    oLangWebViewInterface.emit('settings', {gradi:appSetting.getNumber("Temperatura",0), vento:appSetting.getNumber("Vento",0), pressione:appSetting.getNumber("Pressione",0)});

    var position = home.get("position");
    console.log(position);
    if(gps_on) {
      home.set("search", "collapsed");
        fetch(url_api + "products/wrf5/forecast/" + global_id + "?date=" + currData).then((response) => response.json()).then((data1) => {
          if (data1.result == "ok") {
            home.set("current_position", "visible");
            if (appSetting.getNumber("Temperatura", 0) == 0)
              home.set("temp", data1.forecast.t2c + " °C");
            else if (appSetting.getNumber("Temperatura", 0) == 1) {
              home.set("temp", ((data1.forecast.t2c * 1.8) + 32).toFixed(2) + " °F");
            }
            if (appSetting.getNumber("Vento", 0) == 0)
              home.set("wind", data1.forecast.ws10n + " kn");
            else if (appSetting.getNumber("Vento", 0) == 1) {
              home.set("wind", (data1.forecast.ws10n * 1.852).toFixed(2) + " km/h");
            } else if (appSetting.getNumber("Vento", 0) == 2) {
              home.set("wind", (data1.forecast.ws10n * 0.514444).toFixed(2) + " m/s");
            } else if (appSetting.getNumber("Vento", 0) == 3) {
              home.set("wind", (get_beaufort(data1.forecast.ws10n)) + " beaufort");
            }

            home.set("wind_direction", data1.forecast.winds);
            home.set("icon", '~/meteo_icon/' + data1.forecast.icon);
          } else if (data1.result == "error") {
            home.set("current_position", "collapsed");
            dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
          }
        })
            .catch(error => console.error("[SEARCH] ERROR DATA ", error));
    }
  });
}
exports.onDatePickerLoaded = onDatePickerLoaded;

function onTapNext()
{
  if((parseInt(ora)+1) >23)
  {
    ora = "00";
    console.log("DATA: " + data);
    var endDate = data.setDate(data.getDate() + 1);
    data = new Date(endDate);
    console.log("DATA: " + data);

    anno = data.getFullYear();
    mese = data.getMonth() + 1;
    if(mese < 10)
      mese = "0" + mese;
    giorno = data.getDate();
    if(giorno < 10)
      giorno = "0" + giorno;
    currData = anno+""+mese+""+giorno+"Z"+ora+"00";
    temp_data = new Date(anno, mese-1, giorno);
    console.log("Temp Data: " + temp_data);
    console.log("Data: " + currData);
  }
  else
  {
    ora++;

    if(ora < 10)
      ora = "0" + ora;

    currData = anno+""+mese+""+giorno+"Z"+ora+"00";
    temp_data = new Date(anno, mese-1, giorno);
    console.log("Temp Data: " + temp_data);
    console.log("Data: " + currData);
  }

  if(platformModule.device.language == 'it')
    home.set("data", nome_giorno[data.getUTCDay()] + " " + giorno + "/" + mese + "/" + anno + " " + ora + ":00");
  else
    home.set("data", name_day[data.getUTCDay()] + " " + mese + "/" + giorno + "/" + anno + " " + ora + ":00");

  oLangWebViewInterface.emit('language', {lingua: platformModule.device.language});

  oLangWebViewInterface.emit('new_data', {data:currData});

  if(gps_on)
    oLangWebViewInterface.emit('location', {lat:latitudine, lang:longitudine});

  oLangWebViewInterface.emit('settings', {gradi:appSetting.getNumber("Temperatura",0), vento:appSetting.getNumber("Vento",0), pressione:appSetting.getNumber("Pressione",0)});

  var position = home.get("position");
  console.log(position);
  if(gps_on) {
    home.set("search", "collapsed");
      fetch(url_api + "products/wrf5/forecast/" + global_id + "?date=" + currData).then((response) => response.json()).then((data1) => {
        if (data1.result == "ok") {
          home.set("current_position", "visible");
          if (appSetting.getNumber("Temperatura", 0) == 0)
            home.set("temp", data1.forecast.t2c + " °C");
          else if (appSetting.getNumber("Temperatura", 0) == 1) {
            home.set("temp", ((data1.forecast.t2c * 1.8) + 32).toFixed(2) + " °F");
          }
          if (appSetting.getNumber("Vento", 0) == 0)
            home.set("wind", data1.forecast.ws10n + " kn");
          else if (appSetting.getNumber("Vento", 0) == 1) {
            home.set("wind", (data1.forecast.ws10n * 1.852).toFixed(2) + " km/h");
          } else if (appSetting.getNumber("Vento", 0) == 2) {
            home.set("wind", (data1.forecast.ws10n * 0.514444).toFixed(2) + " m/s");
          } else if (appSetting.getNumber("Vento", 0) == 3) {
            home.set("wind", (get_beaufort(data1.forecast.ws10n)) + " beaufort");
          }

          home.set("wind_direction", data1.forecast.winds);
          home.set("icon", '~/meteo_icon/' + data1.forecast.icon);
        } else if (data1.result == "error") {
          home.set("current_position", "collapsed");
          dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
        }
      })
          .catch(error => console.error("[SEARCH] ERROR DATA ", error));
  }
}
exports.onTapNext = onTapNext;

function onTapBack()
{
  if((parseInt(ora)-1) < 0)
  {
    ora = "23";
    var endDate = data.setDate(data.getDate() - 1);
    data = new Date(endDate);
    console.log(data);

    anno = data.getFullYear();
    mese = data.getMonth() + 1;
    if(mese < 10)
      mese = "0" + mese;
    giorno = data.getDate();
    if(giorno < 10)
      giorno = "0" + giorno;
    currData = anno+""+mese+""+giorno+"Z"+ora+"00";
    temp_data = new Date(anno, mese-1, giorno);
    console.log("Temp Data: " + temp_data);
    console.log("Data: " + currData);
  }
  else
  {
    ora--;

    if(ora < 10)
      ora = "0" + ora;

    currData = anno+""+mese+""+giorno+"Z"+ora+"00";
    temp_data = new Date(anno, mese-1, giorno);
    console.log("Temp Data: " + temp_data);
    console.log("Data: " + currData);
  }

  if(platformModule.device.language == 'it')
    home.set("data", nome_giorno[data.getUTCDay()] + " " + giorno + "/" + mese + "/" + anno + " " + ora + ":00");
  else
    home.set("data", name_day[data.getUTCDay()] + " " + mese + "/" + giorno + "/" + anno + " " + ora + ":00");

  oLangWebViewInterface.emit('language', {lingua: platformModule.device.language});

  oLangWebViewInterface.emit('new_data', {data:currData});

  if(gps_on)
    oLangWebViewInterface.emit('location', {lat:latitudine, lang:longitudine});

  oLangWebViewInterface.emit('settings', {gradi:appSetting.getNumber("Temperatura",0), vento:appSetting.getNumber("Vento",0), pressione:appSetting.getNumber("Pressione",0)});

  var position = home.get("position");
  console.log(position);
  if(gps_on) {
    home.set("search", "collapsed");
      fetch(url_api + "products/wrf5/forecast/" + global_id + "?date=" + currData).then((response) => response.json()).then((data1) => {
        if (data1.result == "ok") {
          home.set("current_position", "visible");
          if (appSetting.getNumber("Temperatura", 0) == 0)
            home.set("temp", data1.forecast.t2c + " °C");
          else if (appSetting.getNumber("Temperatura", 0) == 1) {
            home.set("temp", ((data1.forecast.t2c * 1.8) + 32).toFixed(2) + " °F");
          }
          if (appSetting.getNumber("Vento", 0) == 0)
            home.set("wind", data1.forecast.ws10n + " kn");
          else if (appSetting.getNumber("Vento", 0) == 1) {
            home.set("wind", (data1.forecast.ws10n * 1.852).toFixed(2) + " km/h");
          } else if (appSetting.getNumber("Vento", 0) == 2) {
            home.set("wind", (data1.forecast.ws10n * 0.514444).toFixed(2) + " m/s");
          } else if (appSetting.getNumber("Vento", 0) == 3) {
            home.set("wind", (get_beaufort(data1.forecast.ws10n)) + " beaufort");
          }

          home.set("wind_direction", data1.forecast.winds);
          home.set("icon", '~/meteo_icon/' + data1.forecast.icon);
        } else if (data1.result == "error") {
          home.set("current_position", "collapsed");
          dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
        }
      })
          .catch(error => console.error("[SEARCH] ERROR DATA ", error));
  }
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
  oLangWebViewInterface.emit('centro', {id:global_id});
}
exports.onTapCenter = onTapCenter;

function get_beaufort(nodi)
{
  if(nodi < 1)
    return 0;
  if(nodi>= 1 && nodi<=2)
    return 1;
  if(nodi>2 && nodi <=6)
    return 2;
  if(nodi>6 && nodi <=10)
    return 3;
  if(nodi>10 && nodi <=15)
    return 4;
  if(nodi>15 && nodi <=20)
    return 5;
  if(nodi>20 && nodi <=26)
    return 6;
  if(nodi>26 && nodi <=33)
    return 7;
  if(nodi>33 && nodi <=40)
    return 8;
  if(nodi>40 && nodi <=47)
    return 9;
  if(nodi>47 && nodi <=55)
    return 10;
  if(nodi>55 && nodi <=63)
    return 11;
  if(nodi>63)
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
}

if(platformModule.isIOS)
{
  var items = new ObservableArray([]);
  function onTextChanged(args)
  {
    fetch("https://api.meteo.uniparthenope.it/places/search/byname/autocomplete?term=" + args.text).then((response) => response.json()).then((data) =>
    {
      items.splice(0);
      for(let i=0; i<data.length; i++) {
        items.push(new autocompleteModule.TokenModel(data[i].label));
      }
    });

    home.set("posti", items);
  }
  exports.onTextChanged = onTextChanged;
}

if(platformModule.isAndroid)
{
  var items;
  function onTextChanged(args)
  {
    fetch(url_api + "places/search/byname/autocomplete?term=" + args.text).then((response) => response.json()).then((data) =>
    {
      items = new ObservableArray([]);
      for(let i=0; i<data.length; i++) {
        items.push(new autocompleteModule.TokenModel(data[i].label));
      }
    });

    home.set("posti", items);
  }
  exports.onTextChanged = onTextChanged;
}

function didAutoComplete  (args) {
  let name = (args.text);
  console.log(name);
  var name_new;
  var _name;
  if (name.includes("Municipalit")) {
    var tmp = name.split("-");
    name_new = tmp.pop();
    home.set("position", name_new);
    _name = name_new;
    oLangWebViewInterface.emit('place_searched', {name:_name});
  } else {
    home.set("position", name);
    _name = name;
    oLangWebViewInterface.emit('place_searched', {name:_name});
  }
  place_selected = _name;
  console.log("POSTO : " + place_selected);

  if(gps_on) {
    home.set("search", "collapsed");

    let url = url_api + "places/search/byname/" + _name;
    url = url.replace(/ /g, "%20");
    console.log(url);

    fetch(url).then((response) => response.json()).then((data) => {
      var id;
      console.log(data.length);
      for(let i=0; i<data.length; i++)
      {
        let name1 = data[i].long_name.it;
        console.log(name1);
        let name_new;
        let __name;
        if (name1.includes("Municipalit"))
        {
          console.log("MUN");
          var tmp = name1.split("-");
          name_new = tmp.pop();
          __name = name_new;

          if(__name === _name)
            id = data[i].id;
        }
        else
        {
          console.log("NO MUN");
          if(name1 === _name)
            id = data[i].id;
        }
      }
      console.log(id);
      global_id = id;

      var found = false;
      console.log(preferiti);
      for(var i=0; i<preferiti.length; i++) {
        console.log(preferiti[i]);
        if(place_selected == preferiti[i])
        {
          found = true;
        }
      }
      console.log(found);
      if(found)
      {
        home.set("pref", "visible");
        home.set("no_pref", "collapsed");
      }
      else {
        home.set("no_pref", "visible");
        home.set("pref", "collapsed");
      }

      fetch(url_api + "products/wrf5/forecast/" + global_id + "?date=" + currData).then((response) => response.json()).then((data1) => {
        //console.log(data1);
        if (data1.result == "ok") {
          home.set("current_position", "visible");
          if (appSetting.getNumber("Temperatura", 0) == 0)
            home.set("temp", data1.forecast.t2c + " °C");
          else if (appSetting.getNumber("Temperatura", 0) == 1) {
            home.set("temp", ((data1.forecast.t2c * 1.8) + 32).toFixed(2) + " °F");
          }
          if (appSetting.getNumber("Vento", 0) == 0)
            home.set("wind", data1.forecast.ws10n + " kn");
          else if (appSetting.getNumber("Vento", 0) == 1) {
            home.set("wind", (data1.forecast.ws10n * 1.852).toFixed(2) + " km/h");
          } else if (appSetting.getNumber("Vento", 0) == 2) {
            home.set("wind", (data1.forecast.ws10n * 0.514444).toFixed(2) + " m/s");
          } else if (appSetting.getNumber("Vento", 0) == 3) {
            home.set("wind", (get_beaufort(data1.forecast.ws10n)) + " beaufort");
          }

          home.set("wind_direction", data1.forecast.winds);
          home.set("icon", '~/meteo_icon/' + data1.forecast.icon);
        } else if (data1.result == "error") {
          home.set("current_position", "collapsed");
          dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
        }
      })
          .catch(error => console.error("[AUTOCOMPLETE PLACE] ERROR DATA ", error));
    });
  }

  if(platformModule.isAndroid) {
    var autocompletetxt = page.getViewById("autocomplete");
    autocompletetxt.focus();
    utils.ad.showSoftInput(autocompletetxt.nativeView);
    utils.ad.dismissSoftInput();
  }
}
exports.didAutoComplete = didAutoComplete;

exports.toggleDrawer = function() {
  drawer.toggleDrawerState();
};

exports.onTapDetail = function (args)
{
  const button = args.object;
  const  page = button.page;

    const nav =
        {
          moduleName: "detail/detail-page",
          context: {
            id: global_id,
            data: currData
          }
        };

    page.frame.navigate(nav);
};

exports.onTapStar = function()
{
  if(home.get("no_pref") == "visible")
  {
    home.set("no_pref", "collapsed");
    home.set("pref", "visible");
    preferiti.push(place_selected);
    console.log(preferiti);
    appSetting.setString("preferiti", JSON.stringify(preferiti));
    myPref.splice(0);
    for(var i=0; i<preferiti.length; i++)
      myPref.push({"title": preferiti[i], id: myPref.length});
    home.set("heigt_pref", 50*preferiti.length);
  }
  else if(home.get("no_pref") == "collapsed")
  {
    var index = preferiti.indexOf(place_selected);
    if (index > -1) {
      preferiti.splice(index, 1);
    }
    console.log(preferiti);

    appSetting.setString("preferiti", JSON.stringify(preferiti));

    home.set("no_pref", "visible");
    home.set("pref", "collapsed");
    myPref.splice(0);
    for(var i=0; i<preferiti.length; i++)
      myPref.push({"title": preferiti[i], id: myPref.length});
  }
  home.set("heigt_pref", 50*preferiti.length);
};


function onItemTap(args) {
  const index = args.index;
  console.log(myPref.getItem(index).title);
  oLangWebViewInterface.emit('place_searched', {name:myPref.getItem(index).title});

  place_selected = (myPref.getItem(index).title);
  console.log("POSTO : " + place_selected);

  if(gps_on) {
    home.set("search", "collapsed");

    let url = url_api + "places/search/byname/" + place_selected;
    url = url.replace(/ /g, "%20");
    console.log(url);

    fetch(url).then((response) => response.json()).then((data) => {
      var id;
      console.log(data.length);
      for(let i=0; i<data.length; i++)
      {
        let name1 = data[i].long_name.it;
        console.log(name1);
        let name_new;
        let __name;
        if (name1.includes("Municipalit"))
        {
          console.log("MUN");
          var tmp = name1.split("-");
          name_new = tmp.pop();
          __name = name_new;

          if(__name === place_selected)
            id = data[i].id;
        }
        else
        {
          console.log("NO MUN");
          if(name1 === place_selected)
            id = data[i].id;
        }
      }
      console.log(id);
      global_id = id;

      var found = false;
      console.log(preferiti);
      for(var i=0; i<preferiti.length; i++) {
        console.log(preferiti[i]);
        if(place_selected === preferiti[i])
        {
          found = true;
        }
      }
      console.log("Trovato: " + found);
      if(found)
      {
        home.set("pref", "visible");
        home.set("no_pref", "collapsed");
      }
      else {
        home.set("no_pref", "visible");
        home.set("pref", "collapsed");
      }

      fetch(url_api + "products/wrf5/forecast/" + global_id + "?date=" + currData).then((response) => response.json()).then((data1) => {
        //console.log(data1);
        if (data1.result == "ok") {
          home.set("current_position", "visible");

          home.set("position", place_selected);
          if (appSetting.getNumber("Temperatura", 0) == 0)
            home.set("temp", data1.forecast.t2c + " °C");
          else if (appSetting.getNumber("Temperatura", 0) == 1) {
            home.set("temp", ((data1.forecast.t2c * 1.8) + 32).toFixed(2) + " °F");
          }
          if (appSetting.getNumber("Vento", 0) == 0)
            home.set("wind", data1.forecast.ws10n + " kn");
          else if (appSetting.getNumber("Vento", 0) == 1) {
            home.set("wind", (data1.forecast.ws10n * 1.852).toFixed(2) + " km/h");
          } else if (appSetting.getNumber("Vento", 0) == 2) {
            home.set("wind", (data1.forecast.ws10n * 0.514444).toFixed(2) + " m/s");
          } else if (appSetting.getNumber("Vento", 0) == 3) {
            home.set("wind", (get_beaufort(data1.forecast.ws10n)) + " beaufort");
          }

          home.set("wind_direction", data1.forecast.winds);
          home.set("icon", '~/meteo_icon/' + data1.forecast.icon);
        } else if (data1.result == "error") {
          home.set("current_position", "collapsed");
          dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
        }
      })
          .catch(error => console.error("[AUTOCOMPLETE PLACE] ERROR DATA ", error));
    });
  }
  drawer.closeDrawer();
}
exports.onItemTap = onItemTap;

exports.remove = function (args) {
  var btn = args.object;
  var tappedItemData = btn.bindingContext;

  myPref.some(function (item, index) {
    if(item.id === tappedItemData.id) {
      var place = myPref.getItem(index).title;

      var index = preferiti.indexOf(place);
      if (index > -1) {
        preferiti.splice(index, 1);
      }
      console.log(preferiti);

      appSetting.setString("preferiti", JSON.stringify(preferiti));
      myPref.splice(0);
      for(var i=0; i<preferiti.length; i++)
        myPref.push({"title": preferiti[i], id: myPref.length});

      if(place === place_selected && home.get("pref") === "visible") {
        home.set("pref", "collapsed");
        home.set("no_pref", "visible");
      }

      return false;
    }
  });
};