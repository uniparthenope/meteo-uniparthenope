const appSetting = require("application-settings");

var R = it.uniparthenope.meteo.R; // reduces syntax noise, stands for 'android resources'
var rng = new java.util.Random();
var views;

android.appwidget.AppWidgetProvider.extend("com.tns.Second", {
    onUpdate: function (context, appWidgetManager, appWidgetIds) {
        var appWidgetsLen = appWidgetIds.length;

        for (i = 0; i < appWidgetsLen; i++) {
            updateWidget(context, appWidgetManager, appWidgetIds, appWidgetIds[i]);
        }
    }
});

function updateWidget(context, appWidgetManager, appWidgetIds, widgetId) {
    console.log(appSetting.getString("lastKnownPosition", "com63049"));
    console.log(appSetting.getString("lastKnownPositionName", "Comune di Napoli"));

    var data = new Date();
    let ora = data.getHours();
    if (ora < 10)
        ora = '0' + ora;
    let mese = data.getMonth() + 1;
    if (mese < 10)
        mese = '0' + mese;
    let giorno = data.getDate();
    if (giorno < 10)
        giorno = '0' + giorno;
    let anno = data.getFullYear();

    let currData = anno + "" + mese + "" + giorno + "Z" + ora + "00";

    fetch(url_api + "products/wrf5/timeseries/" + appSetting.getString("lastKnownPosition", "com63049") + "?date=" + currData + "&opt=place").then((response) => response.json()).then((data2) => {
        views = new android.widget.RemoteViews(context.getPackageName(), R.layout.my_widget2);

        if(data2.result === "ok"){
            console.log("OK");
            views.setTextViewText(R.id.position, data2.place.long_name.it);
            views.setTextViewText(R.id.temperatura, data2.timeseries[0].t2c + " °C");
            views.setTextViewText(R.id.text_meteo, data2.timeseries[0].text.it);
            views.setTextViewText(R.id.vento, data2.timeseries[0].winds + "  " + data2.timeseries[0].ws10n + " kn");
            let name_image_1 = data2.timeseries[0].icon;
            let img_1 = name_image_1.substr(0, name_image_1.indexOf('.'));
            let temp_id_2 = context.getResources().getIdentifier("@drawable/" + img_1, "layout", context.getPackageName());
            views.setImageViewResource(R.id.image_meteo, temp_id_2);

            for(let i=1; i<6; i++){
                var name_image = data2.timeseries[i].icon;
                var img = name_image.substr(0, name_image.indexOf('.'));
                var temp_id = context.getResources().getIdentifier("@drawable/" + img, "layout", context.getPackageName());
                var temp_id_1 = context.getResources().getIdentifier("@id/imageDay_" + i, "layout", context.getPackageName());
                views.setImageViewResource(temp_id_1, temp_id);

                var temp_name = context.getResources().getIdentifier("@id/nameDay_" + i, "layout", context.getPackageName());
                let ora = (data2.timeseries[i].dateTime).substring(9,11);
                views.setTextViewText(temp_name, ora + ":00");

                console.log(data2.timeseries[i].t2c);
                var temp_dir = context.getResources().getIdentifier("@id/tempDay_" + i, "layout", context.getPackageName());
                views.setTextViewText(temp_dir, data2.timeseries[i].t2c + " °C");
            }

            var startAppIntent = new android.content.Intent(context, com.tns.NativeScriptActivity.class); // the activity defined in AndroidManifest
            startAppIntent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId);

            var pI2 = android.app.PendingIntent.getActivity(context, 0, startAppIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);

            views.setOnClickPendingIntent(R.id.go_app, pI2);

            appWidgetManager.updateAppWidget(widgetId, views);
        }
    });
}
