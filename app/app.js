let application = require("tns-core-modules/application");
const platformModule = require("tns-core-modules/platform");
const appSettings = require("application-settings");

if((platformModule.device.language).includes("it"))
    require('tns-i18n')('it');
else
    require('tns-i18n')('en');

global.url_api = "https://api.meteo.uniparthenope.it/";
global.contatore = 0;
global.contatore_detail = 0;
global.place_selected = "";
global.global_id = " ";
global.global_data = " ";
global.max_data = " ";
global.page = " ";
global.global_id_detail = " ";
global.global_data_detail = " ";

var firebase = require("nativescript-plugin-firebase");

firebase.init({
    // Optionally pass in properties for database, authentication and cloud messaging,
    // see their respective docs.
    iOSEmulatorFlush: true
}).then(
    function () {
        console.log("firebase.init done");
    },
    function (error) {
        console.log("firebase.init error: " + error);
    }
);

application.on(application.exitEvent, (args) => {
    if (args.android) {
        contatore = 0;
        contatore_detail = 0;
        global_id = " ";
        global_id_detail = " ";
        console.log("Exit: " + args.android);
    } else if (args.ios) {
        contatore = 0;
        contatore_detail = 0;
        global_id = " ";
        global_id_detail = " ";
        console.log("Exit: " + args.ios);
    }
});


application.on(application.suspendEvent, (args) => {
    if (args.android) {
        contatore = 1;
        contatore_detail = 1;
        console.log("Suspend: " + args.android);
    } else if (args.ios) {
        contatore = 1;
        contatore_detail = 1;
        console.log("Suspend: " + args.ios);
    }
});

if(platformModule.isAndroid) {
    /*
    console.log("SDK version: " + platformModule.device.sdkVersion);
    if (platformModule.device.sdkVersion <= 19)
        application.run({moduleName: "app-root1"});
    else {
        if(appSettings.getNumber("Mappa", 0) === 0)
            application.run({moduleName: "app-root"});
        else
            application.run({moduleName: "app-root1"});
    }
     */
    application.run({moduleName: "app-root"});
}
else{
    if(appSettings.getNumber("Mappa", 0) === 0)
        application.run({moduleName: "app-root"});
    else
        application.run({moduleName: "app-root1"});
}
