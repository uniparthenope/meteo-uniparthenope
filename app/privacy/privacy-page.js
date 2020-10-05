const observableModule = require("tns-core-modules/data/observable");
const app = require("tns-core-modules/application");
const platform = require("tns-core-modules/platform");
const httpModule = require("tns-core-modules/http");
const dialogs = require("tns-core-modules/ui/dialogs");

let page;
let viewModel;
let loading;

function onNavigatingTo(args) {
    page = args.object;

    viewModel = observableModule.fromObject({});

    loading = page.getViewById("activityIndicator");

    httpModule.request({
        url: "https://api.uniparthenope.it//UniparthenopeApp/v1/general/privacy",
        method: "GET"
    }).then((response) => {
        loading.visibility = "visible";

        const result = response.content.toJSON();

        if (response.statusCode === 401 || response.statusCode === 500) {
            dialogs.alert({
                title: "Errore: Privacy-Page",
                message: result.errMsg,
                okButtonText: "OK"
            }).then(
                loading.visibility = "collapsed"
            );
        }
        else {
            console.log(result["privacy"]);
            loading.visibility = "collapsed";
            page.getViewById("privacy").html = result.privacy;

            if(platform.isIOS)
                page.getViewById("privacy").requestLayout();
        }

    },(e) => {
        console.log("Error", e);
        dialogs.alert({
            title: "Errore: Privacy-Page",
            message: e.toString(),
            okButtonText: "OK"
        });
    });

    page.bindingContext = viewModel;
}

exports.onNavigatingTo = onNavigatingTo;
