let application = require("tns-core-modules/application");
var frame = require("ui/frame");

global.contatore = 0;
global.place_selected = "";
global.global_id;

application.run({ moduleName: "app-root" });

application.on(application.suspendEvent, (args) => {
    if (args.android) {
        contatore = 0;
        console.log("Activity: " + args.android);
    } else if (args.ios) {
        contatore = 0;
        console.log("UIApplication: " + args.ios);
    }
});

application.on(application.exitEvent, (args) => {
    if (args.android) {
        contatore = 0;
        console.log("Activity exit: " + args.android);
    } else if (args.ios) {
        contatore = 0;
        console.log("UIApplication exit: " + args.ios);
    }
});