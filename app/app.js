let application = require("tns-core-modules/application");
const platformModule = require("tns-core-modules/platform");
require('tns-i18n')('en');
const appSettings = require("application-settings");

global.url_api = "https://api.meteo.uniparthenope.it/";
global.contatore = 0;
global.place_selected = "";
global.global_id = " ";
global.global_data = " ";
global.max_data = " ";
global.page = " ";

application.on(application.exitEvent, (args) => {
    if (args.android) {
        contatore = 0;
        global_id = " ";
        console.log("Exit: " + args.android);
    } else if (args.ios) {
        contatore = 0;
        global_id = " ";
        console.log("Exit: " + args.ios);
    }
});


application.on(application.suspendEvent, (args) => {
    if (args.android) {
        contatore = 1;
        console.log("Suspend: " + args.android);
    } else if (args.ios) {
        contatore = 1;
        console.log("Suspend: " + args.ios);
    }
});

if(platformModule.isAndroid) {
    console.log("SDK version: " + platformModule.device.sdkVersion);
    if (platformModule.device.sdkVersion <= 20)
        application.run({moduleName: "app-root1"});
    else {
        if(appSettings.getNumber("Mappa", 0) === 0)
            application.run({moduleName: "app-root"});
        else
            application.run({moduleName: "app-root1"});
    }
}
else{
    if(appSettings.getNumber("Mappa", 0) === 0)
        application.run({moduleName: "app-root"});
    else
        application.run({moduleName: "app-root1"});
}