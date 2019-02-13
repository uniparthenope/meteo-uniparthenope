var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
var Observable = require("data/observable");
var PageSettingViewModel = require("./settings-view-model");
var settingViewModel = new PageSettingViewModel();
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
const segmentedBarModule = require("tns-core-modules/ui/segmented-bar");
const appSettings = require("application-settings");

function pageLoaded(args)
{
    var page = args.object;
    var setting = new Observable.fromObject({});
    var temp = appSettings.getNumber("Temperatura", 0);
    var wind = appSettings.getNumber("Vento", 0);
    var pressione = appSettings.getNumber("Pressione", 0);

    setting.set("tempSelection", temp);
    setting.on(observableModule.Observable.propertyChangeEvent, (propertyChangeData) =>
    {
        if (propertyChangeData.propertyName === "tempSelection")
        {
            appSettings.setNumber("Temperatura", propertyChangeData.value);
        }
    });

    setting.set("windSelection", wind);
    setting.on(observableModule.Observable.propertyChangeEvent, (propertyChangeData) =>
    {
        if (propertyChangeData.propertyName === "windSelection")
        {
            appSettings.setNumber("Vento", propertyChangeData.value);
        }
    });

    //setting.set("gpsSelection", pressione);
    setting.on(observableModule.Observable.propertyChangeEvent, (propertyChangeData) =>
    {
        if (propertyChangeData.propertyName === "gpsSelection")
        {
            if (propertyChangeData.value == 1)
            {
                const promptOptions = {
                    title: "SignalK",
                    message: "Inserire URL server",
                    okButtonText: "Ok",
                    cancelButtonText: "Cancel",
                    defaultText: "URL",
                    inputType: "text", // email, number, text, password, or email
                    capitalizationType: "sentences" // all, none, sentences or words
                };
                prompt(promptOptions).then((r) => {
                    console.log("Dialog result: ", r.result);
                    console.log("Text: ", r.text);
                });
            }

        }
    });

    setting.set("windSelection", wind);
    setting.on(observableModule.Observable.propertyChangeEvent, (propertyChangeData) =>
    {
        if (propertyChangeData.propertyName === "windSelection")
        {
            appSettings.setNumber("Vento", propertyChangeData.value);
        }
    });
    page.bindingContext = setting;
}

exports.pageLoaded = pageLoaded;