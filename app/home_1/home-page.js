var geolocation = require("nativescript-geolocation");
var nativescript_webview_interface_1 = require("nativescript-webview-interface");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
const appSetting = require("application-settings");
var autocompleteModule = require("nativescript-ui-autocomplete");
var view = require("ui/core/view");
var utils = require("tns-core-modules/utils/utils");
var dialog = require("tns-core-modules/ui/dialogs");
const platformModule = require("tns-core-modules/platform");
const perm_loc = require("nativescript-advanced-permissions/location");
const Color = require("tns-core-modules/color").Color;
let BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;
let barcodescanner = new BarcodeScanner();
let messaging = require("nativescript-plugin-firebase/messaging");
let Ratings = require("nativescript-ratings").Ratings;

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
var box_place = false;
var latitudine;
var longitudine;
let page;
var preferiti;
var myPref = new ObservableArray();
let lingua;

function get_beaufort(nodi) {
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

function set_preferiti(){
  var found = false;
  for(var i=0; i<preferiti.length; i++) {
    if(place_selected === preferiti[i])
    {
      found = true;
    }
  }
  if(found)
  {
    home.set("pref", "visible");
    home.set("no_pref", "collapsed");
  }
  else {
    home.set("no_pref", "visible");
    home.set("pref", "collapsed");
  }
}

function setupWebViewInterface(page){
  var webView = page.getViewById('webView');
  oLangWebViewInterface = new nativescript_webview_interface_1.WebViewInterface(webView, '~/www/index1.html');
  listenLangWebViewEvents();
}

exports.pageLoaded = function(args) {
  page = args.object;

  if(platformModule.device.language.includes("it"))
    lingua="it";
  else
    lingua="en";

  setupWebViewInterface(page);

  contatore++;
  //console.log("Contatore: " + contatore);
  contatore_detail = 0;

  preferiti = JSON.parse(appSetting.getString("preferiti" , "[]"));

  home = new Observable.fromObject({
    myPref: myPref
  });

  if(contatore == 1) {
    data = new Date();
    global_date = data;
    max_data = new Date(global_date.getFullYear(), global_date.getMonth(), global_date.getDate() + 5);

    ora = data.getHours();
    if (ora < 10)
      ora = '0' + ora;
    mese = data.getMonth() + 1;
    if (mese < 10)
      mese = '0' + mese;
    giorno = data.getDate();
    if (giorno < 10)
      giorno = '0' + giorno;
    anno = data.getFullYear();

    if(lingua == "it")
      print_data = nome_giorno[data.getDay()] + " " + giorno + "/" + mese + "/" + anno + " " + ora + ":00";
    else
      print_data = name_day[data.getDay()] + " " + mese + "/" + giorno + "/" + anno + " " + ora + ":00";

    currData = anno + "" + mese + "" + giorno + "Z" + ora + "00";
    console.log("Data: " + print_data);

    home.set("data", print_data);
  }
  else {
    data = new Date(anno, mese-1, giorno);
    max_data = new Date(global_date.getFullYear(), global_date.getMonth(), global_date.getDate() + 5);

    if(platformModule.device.language.includes('it'))
      print_data = nome_giorno[data.getDay()] + " " + giorno + "/" + mese + "/" + anno + " " + ora + ":00";
    else
      print_data = name_day[data.getDay()] + " " + mese + "/" + giorno + "/" + anno + " " + ora + ":00";

    currData = anno + "" + mese + "" + giorno + "Z" + ora + "00";
    console.log(print_data);

    home.set("data", print_data);
  }

  let ratings;
  if(lingua == "it"){
    ratings = new Ratings(
        {
          id: "0",
          showOnCount: 5,
          title: "Cosa ne pensi?",
          text: "Se ti piace quest'app, trova un momento per lasciare una recensione positiva. La tua opinione conta per noi.",
          agreeButtonText: "Vota ora",
          remindButtonText: "Ricordamelo dopo",
          declineButtonText: "No, grazie",
          androidPackageId: "it.uniparthenope.meteo"
        }
    );
  }
  else{
    ratings = new Ratings(
        {
          id: "0",
          showOnCount: 5,
          title: "What do you think?",
          text: "If you like this app, please take a moment to leave a positive rating.",
          agreeButtonText: "Rate Now",
          remindButtonText: "Remind Me Later",
          declineButtonText: "No Thanks",
          androidPackageId: "it.uniparthenope.meteo"
        }
    );
  }

  ratings.init();
  ratings.prompt();

  console.log("Notifications enabled? " +  messaging.messaging.areNotificationsEnabled());
  messaging.messaging.registerForPushNotifications({
    onPushTokenReceivedCallback(token) {
      console.log("Firebase plugin received a push token: " + token);
    },

    onMessageReceivedCallback (message) {
      console.log("Push message received: " + message.title);
      console.log("Foreground: " + message.foreground);

      let route;
      if (message.foreground){
        dialog.confirm({
          title: message.title,
          message: message.body,
          okButtonText: "open",
          neutralButtonText: "cancel"
        }).then(function (result) {
          // result argument is boolean
          if(result){
            if (message.data.contentType) {
              let contentType = message.data.contentType;
              if (contentType === 'bollettino') {
                if(platformModule.isAndroid)
                  route = "bollettino/bollettino";
                else
                  route = "bollettino_ios/bollettino_ios";
              }
              page.frame.navigate(route);
            }
          }
          console.log("Dialog result: " + result);
        });
      }
      else{
        console.log("message", message);

        if (message.data.contentType) {
          let contentType = message.data.contentType;
          if (contentType === 'bollettino') {
            if(platformModule.isAndroid)
              route = "bollettino/bollettino";
            else
              route = "bollettino_ios/bollettino_ios";
          }
          page.frame.navigate(route);
        }
      }
    },
    // Whether you want this plugin to automatically display the notifications or just notify the callback. Currently used on iOS only. Default true.
    showNotifications: true,

    // Whether you want this plugin to always handle the notifications when the app is in foreground. Currently used on iOS only. Default false.
    showNotificationsWhenInForeground: true
  }).then(() => console.log("Registered for push"));

  messaging.messaging.subscribeToTopic("weather").then(() => console.log("Subscribed to topic"));

  console.log(preferiti.length);
  myPref.splice(0);
  for(var i=0; i<preferiti.length; i++)
    myPref.push({"title": preferiti[i], id: myPref.length});

  home.set("heigt_pref", 50*preferiti.length);
  home.set("current_position", "collapsed");
  home.set("no_pref", "visible");
  home.set("pref", "collapsed");
  home.set("layer_vento", "visible");
  home.set("layer_nuvole", "visible");
  home.set("layer_neve", "visible");
  home.set("layer_pioggia", "visible");
  home.set("layer_temp", "collapsed");

  drawer = view.getViewById(page,"sideDrawer");

  //console.log("GLOBAL ID: " + global_id);

  console.log("LOCATION PERMISSION: ", perm_loc.hasLocationPermissions());

  if (global_id == " ") {
    geolocation.enableLocationRequest().then(function () {
      contatore_detail = 0;

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
            latitudine = (loc.latitude).toString();
            longitudine = (loc.longitude).toString();
            console.log(latitudine);
            console.log(longitudine);
            var place, id;

            if(latitudine.includes("-") || longitudine.includes("-")){
              home.set("current_position", "collapsed");
              box_place = false;

              //oLangWebViewInterface.emit('language', {lingua: lingua});

              console.log("Zoom: " + appSetting.getNumber("zoom", 5));

              //oLangWebViewInterface.emit('data', {anno: anno, mese: mese, giorno: giorno, ora: ora, zoom: appSetting.getNumber("zoom", 5), map: appSetting.getString("map", "Satellite"), lat:appSetting.getNumber("lat_center", "40.85"), lang:appSetting.getNumber("lang_center", "14.28")});

              oLangWebViewInterface.emit('location', {lat: latitudine, lang: longitudine});

              oLangWebViewInterface.emit('settings', {
                gradi: appSetting.getNumber("Temperatura", 0),
                vento: appSetting.getNumber("Vento", 0),
                pressione: appSetting.getNumber("Pressione", 0)
              });
            }
            else{
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
                appSetting.setString("lastKnownPosition", global_id);
                appSetting.setString("lastKnownPositionName", place_selected);

                set_preferiti();

                fetch(url_api + "products/wrf5/forecast/" + global_id + "?date=" + currData).then((response) => response.json()).then((data1) => {
                  //console.log(data1);
                  if (data1.result == "ok") {
                    home.set("current_position", "visible");
                    box_place = true;
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
                    box_place = false;
                    home.set("current_position", "collapsed");
                    dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
                  }

                  //oLangWebViewInterface.emit('language', {lingua: lingua});

                  //oLangWebViewInterface.emit('data', {anno: anno, mese: mese, giorno: giorno, ora: ora, zoom: appSetting.getNumber("zoom", 5), map: appSetting.getString("map", "Satellite"), lat:appSetting.getNumber("lat_center", "40.85"), lang:appSetting.getNumber("lang_center", "14.28")});

                  oLangWebViewInterface.emit('location', {lat: latitudine, lang: longitudine});


                  oLangWebViewInterface.emit('settings', {
                    gradi: appSetting.getNumber("Temperatura", 0),
                    vento: appSetting.getNumber("Vento", 0),
                    pressione: appSetting.getNumber("Pressione", 0)
                  });
                })
                    .catch(error => console.error("[SEARCH] ERROR DATA ", error));
              });
            }
          }
        }, function (e) {
          contatore_detail = 0;
          dialog.alert({title: "Errore", message: e.message, okButtonText: "OK"});
          home.set("current_position", "collapsed");
          box_place = false;

          //oLangWebViewInterface.emit('language', {lingua: lingua});

          //oLangWebViewInterface.emit('data', {anno: anno, mese: mese, giorno: giorno, ora: ora, zoom: appSetting.getNumber("zoom", 5), map: appSetting.getString("map", "Satellite"), lat:appSetting.getNumber("lat_center", "40.85"), lang:appSetting.getNumber("lang_center", "14.28")});

          oLangWebViewInterface.emit('settings', {
            gradi: appSetting.getNumber("Temperatura", 0),
            vento: appSetting.getNumber("Vento", 0),
            pressione: appSetting.getNumber("Pressione", 0)
          });
        });
      });
    }, function (e) {
      contatore_detail = 0;
      gps_on = false;
      home.set("current_position", "collapsed");
      box_place = false;

      //oLangWebViewInterface.emit('language', {lingua: lingua});

      //oLangWebViewInterface.emit('data', {anno: anno, mese: mese, giorno: giorno, ora: ora, zoom: appSetting.getNumber("zoom", 5), map: appSetting.getString("map", "Satellite"), lat:appSetting.getNumber("lat_center", "40.85"), lang:appSetting.getNumber("lang_center", "14.28")});

      oLangWebViewInterface.emit('settings', {
        gradi: appSetting.getNumber("Temperatura", 0),
        vento: appSetting.getNumber("Vento", 0),
        pressione: appSetting.getNumber("Pressione", 0)
      });
      console.log("Error: " + (e.message || e));
    });
  }
  else {
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

      set_preferiti();

      if (data1.result == "ok") {
        home.set("current_position", "visible");
        box_place = true;
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
        box_place = false;
        dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
      }
    })
        .catch(error => console.error("[SEARCH] ERROR DATA ", error));
  }

  page.bindingContext = home;
};

// DATA HANDLING
function send_data() {
  if(platformModule.device.language.includes("it"))
    home.set("data", nome_giorno[data.getDay()] + " " + giorno + "/" + mese + "/" + anno + " " + ora + ":00");
  else
    home.set("data", name_day[data.getDay()] + " " + mese + "/" + giorno + "/" + anno + " " + ora + ":00");

  //oLangWebViewInterface.emit('language', {lingua: lingua});

  oLangWebViewInterface.emit('new_data', {data:currData});

  if(gps_on)
    oLangWebViewInterface.emit('location', {lat:latitudine, lang:longitudine});

  oLangWebViewInterface.emit('settings', {gradi:appSetting.getNumber("Temperatura",0), vento:appSetting.getNumber("Vento",0), pressione:appSetting.getNumber("Pressione",0)});

  var position = home.get("position");
  console.log(position);

  if(box_place){
    fetch(url_api + "products/wrf5/forecast/" + global_id + "?date=" + currData).then((response) => response.json()).then((data1) => {
      if (data1.result == "ok") {
        home.set("current_position", "visible");
        box_place = true;
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
        box_place = false;
        dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
      }
    }).catch(error => console.error("[SEARCH] ERROR DATA ", error));
  }
}
exports.showModal = function (args) {
  const page = args.object.page;
  page.showModal(
      "./modal/modal",
      {
        context: ora
      },
      function closeCallback(result) {
        if (result) {
          console.log("Result was: ", result);
          currData = result;
          anno = result.substring(0, 4);
          mese = result.substring(4, 6);
          giorno = result.substring(6,8);
          ora = result.substring(9,11);
          console.log(ora);

          temp_data = new Date(anno, mese-1, giorno);
          data = new Date(anno, mese-1, giorno);

          send_data();
        }
      },
      false
  );
};
exports.onTapNext = function() {
  if(data > max_data)
    return;

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

    temp_data = new Date(anno, mese-1, giorno);
    currData = anno+""+mese+""+giorno+"Z"+ora+"00";

    console.log("Temp Data: " + temp_data);
    console.log("Data: " + currData);
  }

  send_data();
};
exports.onTapBack = function() {
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

  send_data();
};


//----------- FUNCTIONS SIDE-MENU -----------
exports.toggleDrawer = function() {
  drawer.toggleDrawerState();
};
exports.onTapReport = function () {
  if(platformModule.isAndroid)
    page.frame.navigate("bollettino/bollettino");
  else
    page.frame.navigate("bollettino_ios/bollettino_ios");
};
exports.onTapSettings =function(args) {
  var button = args.object;
  const page = button.page;

  page.frame.navigate("settings/setting-page");
};
exports.onTapInfo = function(args) {
  const button = args.object;
  const  page = button.page;

  page.frame.navigate("info/info-page");
};
exports.onItemTap = function(args) {
  const index = args.index;
  console.log(myPref.getItem(index).title);
  oLangWebViewInterface.emit('place_searched', {name:myPref.getItem(index).title});

  place_selected = (myPref.getItem(index).title);
  console.log("POSTO : " + place_selected);

  box_place = true;

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
    global_id = id;
    console.log("ID TAP ITEM: " + global_id);

    set_preferiti();

    fetch(url_api + "products/wrf5/forecast/" + global_id + "?date=" + currData).then((response) => response.json()).then((data1) => {
      //console.log(data1);
      if (data1.result == "ok") {
        home.set("current_position", "visible");
        box_place = true;

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
        box_place = false;
        dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
      }
    })
        .catch(error => console.error("[AUTOCOMPLETE PLACE] ERROR DATA ", error));
  });

  drawer.closeDrawer();
};
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
      home.set("heigt_pref", 50*preferiti.length);

      if(place === place_selected && home.get("pref") === "visible") {
        home.set("pref", "collapsed");
        home.set("no_pref", "visible");
      }

      return false;
    }
  });
};


//----------- DATA TO SEND TO WEBVIEW -----------
function listenLangWebViewEvents(){
  oLangWebViewInterface.on('onload', () => {
    oLangWebViewInterface.emit('add_layers', {
      anno: anno,
      mese: mese,
      giorno: giorno,
      ora: ora,
      lingua: lingua,
      map: appSetting.getString("map", "Satellite"),
      zoom: appSetting.getNumber("zoom", 5),
      map: appSetting.getString("map", "Satellite"),
      lat:appSetting.getNumber("lat_center", latitudine),
      lang:appSetting.getNumber("lang_center", longitudine),
      gradi: appSetting.getNumber("Temperatura", 0),
      vento: appSetting.getNumber("Vento", 0),
      pressione: appSetting.getNumber("Pressione", 0)
    });
  });

  oLangWebViewInterface.on('detail', function(eventData) {
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

  oLangWebViewInterface.on('cursor', function (data) {
    page.getViewById('is_busy').visibility = data.visibility;
  })
}


//----------- SEARCH PLACE TEXT -----------
let autocomplete_map;
if(platformModule.isIOS) {
  var items = new ObservableArray([]);
  autocomplete_map = new Map();

  function onTextChanged(args)
  {
    fetch("https://api.meteo.uniparthenope.it/places/search/byname/autocomplete?term=" + args.text).then((response) => response.json()).then((data) =>
    {
      items.splice(0);
      autocomplete_map.clear();
      for(let i=0; i<data.length; i++) {
        autocomplete_map.set(data[i].label, data[i].id);
        items.push(new autocompleteModule.TokenModel(data[i].label));
      }
    });

    home.set("posti", items);
  }
  exports.onTextChanged = onTextChanged;
}
if(platformModule.isAndroid) {
  var items;
  function onTextChanged(args)
  {
    fetch(url_api + "places/search/byname/autocomplete?term=" + args.text).then((response) => response.json()).then((data) =>
    {
      autocomplete_map = new Map();
      items = new ObservableArray([]);
      for(let i=0; i<data.length; i++) {
        autocomplete_map.set(data[i].label, data[i].id);
        items.push(new autocompleteModule.TokenModel(data[i].label));
      }
    });

    home.set("posti", items);
  }
  exports.onTextChanged = onTextChanged;
}
exports.didAutoComplete = function(args) {
  global_id = autocomplete_map.get(args.text);

  oLangWebViewInterface.emit('centro', {id:global_id});

  fetch(url_api + "products/wrf5/forecast/" + global_id + "?date=" + currData + "&opt=place").then((response) => response.json()).then((data1) => {
    console.log(data1);
    if (data1.result == "ok") {
      home.set("current_position", "visible");
      box_place = true;

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

      set_preferiti();

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
      box_place = false;
      dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
    }

    if(platformModule.isAndroid) {
      var autocompletetxt = page.getViewById("autocomplete");
      autocompletetxt.focus();
      utils.ad.showSoftInput(autocompletetxt.nativeView);
      utils.ad.dismissSoftInput();
      const nativeView = (args.object).nativeView;
      nativeView.getTextField().setText("");
    }
    else{
      const nativeView = (args.object).nativeView;
      nativeView.textField.text = "";
    }

  }).catch(error => console.error("[AUTOCOMPLETE PLACE] ERROR DATA ", error));
};
exports.onAutoCompleteTextViewLoaded = function(args){
  console.log("QUI");
  const nativeView = (args.object).nativeView;
  let color = new Color("#ffffff");
  let background = new Color("#1e4c75");

  if (platformModule.isIOS) {
    nativeView.textField.textColor = color.ios;
    nativeView.backgroundColor = background.ios;
  }

  if (platformModule.isAndroid) {
    nativeView.getTextField().setTextColor(color.android);
    nativeView.getTextField().setHintTextColor(color.android);
  }
};


//----------- PLACE FUNCTIONS -----------
exports.onTapStar = function() {
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
    home.set("heigt_pref", 50*preferiti.length);
  }
};
exports.onTapDetail = function (args) {
  const button = args.object;
  const  page = button.page;


  console.log("DETAIL ID: " + global_id);

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
exports.onTapCenter = function() {
  oLangWebViewInterface.emit('centro', {id:global_id});
};


//----------- QR_CODE -----------
function scan(){
  barcodescanner.scan({
    formats: "QR_CODE",
    cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
    message: "Scansiona un QR-Code per i dettagli sul place.", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
    preferFrontCamera: false,     // Android only, default false
    showFlipCameraButton: false,   // default false
    showTorchButton: false,       // iOS only, default false
    torchOn: false,               // launch with the flashlight on (default false)
    resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
    beepOnScan: true,             // Play or Suppress beep on scan (default true)
    orientation: "portrait",
    openSettingsIfPermissionWasPreviouslyDenied: true, // On iOS you can send the user to the settings app if access was previously denied
    closeCallback: () => {
      console.log("Scanner closed @ " + new Date().getTime());
    }
  }).then(
      function (result) {
        console.log(result.text);
        if(result.text.startsWith("http://")){
          let tmp = result.text.split("=");
          let place = tmp.pop();

          if(place != "") {
            fetch(url_api + "products/wrf5/forecast/" + place + "?date=" + currData + "&opt=place").then((response) => response.json()).then((data1) => {
              if (data1.result == "ok") {
                home.set("current_position", "visible");
                box_place = true;

                global_id = place;
                place_selected = data1.place.long_name.it;
                oLangWebViewInterface.emit('place_searched', {name: data1.place.long_name.it});

                home.set("position", data1.place.long_name.it);
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
              }
              else if (data1.result == "error") {
                home.set("current_position", "collapsed");
                box_place = false;
                dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
              }
            })
                .catch(error => console.error("[QR-CODE] ERROR", error));}
        }
      },
      function (errorMessage) {
        console.log("No scan. " + errorMessage);
      }
  );
}
exports.QRCode = function(){
  barcodescanner.hasCameraPermission().then(permitted => {
    if(permitted)
      scan();
    else{
      barcodescanner.requestCameraPermission().then(
          function () {
            console.log("Camera permission requested");

            scan();
          });
    }
  }, (err) => {
    alert(err);
  });
};
