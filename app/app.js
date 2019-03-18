let application = require("tns-core-modules/application");
var frame = require("ui/frame");

const platformModule = require("tns-core-modules/platform");
let language = platformModule.device.language;
if(language != 'it')
    language == 'en'
console.log("Lingua: " + language);

require('tns-i18n')(language);

global.contatore = 0;
global.place_selected = "";
global.global_id = " ";

application.run({ moduleName: "app-root" });

application.on(application.suspendEvent, (args) => {
    if (args.android) {
        contatore = 0;
        global_id = " ";
        console.log("Activity: " + args.android);
    } else if (args.ios) {
        contatore = 0;
        global_id = " ";
        console.log("UIApplication: " + args.ios);
    }
});