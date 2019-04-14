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
        console.log(appSetting.getString("lastKnownPosition", ""));

        fetch(url_api + "products/wrf5/forecast/" + appSetting.getString("lastKnownPosition", "") + "?opt=place").then((response) => response.json()).then((data1) => {
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
            setImage(name_image);

            var intent = new android.content.Intent(context, com.tns.MyWidget.class);
            intent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);

            var startAppIntent = new android.content.Intent(context, com.tns.NativeScriptActivity.class); // the activity defined in AndroidManifest
            startAppIntent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId);

            var pI = android.app.PendingIntent.getBroadcast(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
            var pI2 = android.app.PendingIntent.getActivity(context, 0, startAppIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);

            //views.setOnClickPendingIntent(R.id.tap_button, pI);
            //views.setOnClickPendingIntent(R.id.go_app, pI2);

            appWidgetManager.updateAppWidget(widgetId, views);
        });
    }

    function setImage(name_image){
        if(name_image.includes("cloudy1.png")) {
            views.setImageViewResource(R.id.image_meteo, R.drawable.cloudy1);
        }
        else if(name_image.includes("cloudy1_night.png"))
        {
            views.setImageViewResource(R.id.image_meteo, R.drawable.cloudy1_night);
        }
        else if(name_image.includes("cloudy2.png"))
        {
            console.log("QUI");
            views.setImageViewResource(R.id.image_meteo, R.drawable.cloudy2);
        }
        else if(name_image.includes("cloudy2_night.png"))
        {
            views.setImageViewResource(R.id.image_meteo, R.drawable.cloudy2_night);
        }
        else if(name_image.includes("cloudy3.png"))
        {
            views.setImageViewResource(R.id.image_meteo, R.drawable.cloudy3);
        }
        else if(name_image.includes("cloudy3_night.png"))
        {
            views.setImageViewResource(R.id.image_meteo, R.drawable.cloudy3_night);
        }
        else if(name_image.includes("cloudy4.png"))
        {
            views.setImageViewResource(R.id.image_meteo, R.drawable.cloudy4);
        }
        else if(name_image.includes("cloudy4_night.png"))
        {
            views.setImageViewResource(R.id.image_meteo, R.drawable.cloudy4_night);
        }
        else if(name_image.includes("cloudy5.png"))
        {
            views.setImageViewResource(R.id.image_meteo, R.drawable.cloudy5);
        }
        else if(name_image.includes("cloudy5_night.png"))
        {
            views.setImageViewResource(R.id.image_meteo, R.drawable.cloudy5_night);
        }

        else if(name_image.includes("shower1.png"))
        {
            views.setImageViewResource(R.id.image_meteo, R.drawable.shower1);
        }
        else if(name_image.includes("shower1_night.png"))
        {
            views.setImageViewResource(R.id.image_meteo, R.drawable.shower1_night);
        }
        else if(name_image.includes("shower2.png"))
        {
            views.setImageViewResource(R.id.image_meteo, R.drawable.shower2);
        }
        else if(name_image.includes("shower2_night.png"))
        {
            views.setImageViewResource(R.id.image_meteo, R.drawable.shower2_night);
        }
        else if(name_image.includes("shower3.png"))
        {
            views.setImageViewResource(R.id.image_meteo, R.drawable.shower3);
        }
        else if(name_image.includes("shower3_night.png"))
        {
            views.setImageViewResource(R.id.image_meteo, R.drawable.shower3_night);
        }
    }
})();