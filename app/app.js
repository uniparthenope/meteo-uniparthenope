let application = require("tns-core-modules/application");
var frame = require("ui/frame");

if (application.android)
{
    application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
}
function backEvent(args)
{
    var currentPage = frame.topmost().currentPage;
    if (currentPage && currentPage.exports && typeof currentPage.exports.backEvent === "function")
    {
        currentPage.exports.backEvent(args);
    }
}

application.run({ moduleName: "app-root" });
