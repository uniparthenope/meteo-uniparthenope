let closeCallback;
var gestures = require("tns-core-modules/ui/gestures");
let utils = require("tns-core-modules/utils/utils");
var imageSource = require("image-source");
const platformModule = require("tns-core-modules/platform");
const topmost = require("ui/frame").topmost;

let modal;
let density;
let prevDeltaX;
let prevDeltaY;
let startScale = 1;
let double_tap = false;

exports.onShownModally = function (args) {
    modal = args.object;

    const context = args.context;

    console.log("Context passed was: ");
    console.log(JSON.stringify(context));

    let map_zoom = modal.getViewById("map");

    if(platformModule.device.language.includes("it")) {
        modal.getViewById("map_text").text = "Doppio click per zoom";
        modal.getViewById("button_close").text = "Chiudi";
    }
    else {
        modal.getViewById("map_text").text = "Double tap to zoom";
        modal.getViewById("button_close").text = "Close";
    }

    imageSource.fromUrl(context.context)
        .then(function () {
                map_zoom.src = context.context;
            }).catch(err => {console.log("Somthing went wrong!: " + err);
        });

    density = utils.layout.getDisplayDensity();
    map_zoom.translateX = 0;
    map_zoom.translateY = 0;
    map_zoom.scaleX = 1;
    map_zoom.scaleY = 1;

    map_zoom.on(gestures.GestureTypes.pinch, function (args) {
        if (args.state === 1) {
            const newOriginX = args.getFocusX() - map_zoom.translateX;
            const newOriginY = args.getFocusY() - map_zoom.translateY;

            const oldOriginX = map_zoom.originX * map_zoom.getMeasuredWidth();
            const oldOriginY = map_zoom.originY * map_zoom.getMeasuredHeight();

            map_zoom.translateX += (oldOriginX - newOriginX) * (1 - map_zoom.scaleX);
            map_zoom.translateY += (oldOriginY - newOriginY) * (1 - map_zoom.scaleY);

            map_zoom.originX = newOriginX / map_zoom.getMeasuredWidth();
            map_zoom.originY = newOriginY / map_zoom.getMeasuredHeight();

            startScale = map_zoom.scaleX;
        }

        else if (args.scale && args.scale !== 1) {
            let newScale = startScale * args.scale;
            newScale = Math.min(8, newScale);
            newScale = Math.max(0.125, newScale);

            map_zoom.scaleX = newScale;
            map_zoom.scaleY = newScale;
        }
    });

    map_zoom.on(gestures.GestureTypes.pan, function (args) {
        if (args.state === 1) {
            prevDeltaX = 0;
            prevDeltaY = 0;
        }
        else if (args.state === 2) {
            map_zoom.translateX += args.deltaX - prevDeltaX;
            map_zoom.translateY += args.deltaY - prevDeltaY;

            prevDeltaX = args.deltaX;
            prevDeltaY = args.deltaY;
        }
    });

    map_zoom.on(gestures.GestureTypes.doubleTap, function (args) {
        console.log("DOUBLE TAP");
        if(double_tap)
        {
            map_zoom.animate({
                translate: { x: 0, y: 0 },
                scale: { x: 1, y: 1 },
                curve: "easeOut",
                duration: 300
            });
            double_tap = false;
        }
        else{
            map_zoom.animate({
                translate: { x: 0, y: 0 },
                scale: { x: 2, y: 2 },
                curve: "easeOut",
                duration: 300
            });
            double_tap = true;
        }
    });


    closeCallback = args.closeCallback;
};

exports.close = function (args) {
    const page = topmost().currentPage;
    if (page && page.modal) {
        page.modal.closeModal();
    }
};
