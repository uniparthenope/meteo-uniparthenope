const appSetting = require("application-settings");

(function () {
    // yay for JavaScript closures!
    var taps = -1;
    var R = it.meteo.uniparthenope.R; // reduces syntax noise, stands for 'android resources'
    var rng = new java.util.Random();
    var views;

    android.appwidget.AppWidgetProvider.extend("com.tns.MyWidget2", {
        // is called each time the widget is added to the homescreen, or update ticks
        onUpdate: function (context, appWidgetManager, appWidgetIds) {
            // gets the number of instances of the same widget on the homescreen
            var appWidgetsLen = appWidgetIds.length;

            // for each widget - update - we want them to be consistent
            for (i = 0; i < appWidgetsLen; i++) {
                updateWidget(context, appWidgetManager, appWidgetIds, appWidgetIds[i]);
            }
        }
    });

    function updateWidget(context, appWidgetManager, appWidgetIds, widgetId) {
        console.log(appSetting.getString("lastKnownPosition", "com63049"));
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
        console.log(currData);

        fetch(url_api + "products/wrf5/forecast/" + appSetting.getString("lastKnownPosition", "com63049") + "?date=" + currData + "&opt=place").then((response) => response.json()).then((data1) => {
            console.log(data1.place.long_name.it);

            var temp_place;
            var place = data1.place.long_name.it;
            if (place.includes("Municipalit")) {
                var tmp = place.split("-");
                temp_place = tmp.pop();
            } else {
                temp_place = place;
            }

            views = new android.widget.RemoteViews(context.getPackageName(), R.layout.my_widget2);
            // retrieve our layout and all its views
            views.setTextViewText(R.id.position, temp_place);
            views.setTextViewText(R.id.temperatura, data1.forecast.t2c + " °C");
            views.setTextViewText(R.id.dir_vento, data1.forecast.winds);
            views.setTextViewText(R.id.wind, data1.forecast.ws10n + " kn");
            console.log(data1.forecast.icon);
            var name_image = data1.forecast.icon;
            var img = name_image.substr(0, name_image.indexOf('.'));
            var temp_id = context.getResources().getIdentifier("@drawable/" + img, "layout", context.getPackageName());
            views.setImageViewResource(R.id.image_meteo, temp_id);

            var startAppIntent = new android.content.Intent(context, com.tns.NativeScriptActivity.class); // the activity defined in AndroidManifest
            startAppIntent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId);
            var pI2 = android.app.PendingIntent.getActivity(context, 0, startAppIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
            views.setOnClickPendingIntent(R.id.go_app, pI2);

            appWidgetManager.updateAppWidget(widgetId, views);
        });
    }
})();