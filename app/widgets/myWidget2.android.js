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

    fetch(url_api + "products/wrf5/forecast/" + appSetting.getString("lastKnownPosition", "com63049") + "?date=" + currData + "&opt=place").then((response) => response.json()).then((data1) => {
        views = new android.widget.RemoteViews(context.getPackageName(), R.layout.my_widget2);
        // retrieve our layout and all its views
        views.setTextViewText(R.id.position, appSetting.getString("lastKnownPositionName", "Comune di Napoli"));
        views.setTextViewText(R.id.temperatura, data1.forecast.t2c + " °C");
        views.setTextViewText(R.id.text_meteo, data1.forecast.text.it);
        views.setTextViewText(R.id.vento, data1.forecast.winds + "  " + data1.forecast.ws10n + " kn");
        let name_image = data1.forecast.icon;
        let img = name_image.substr(0, name_image.indexOf('.'));
        let temp_id = context.getResources().getIdentifier("@drawable/" + img, "layout", context.getPackageName());
        views.setImageViewResource(R.id.image_meteo, temp_id);

        appWidgetManager.updateAppWidget(widgetId, views);
    });

    for(let i=1; i<6; i++){
        if((parseInt(ora)+1) >23)
        {
            ora = "00";
            var endDate = data.setDate(data.getDate() + 1);
            data = new Date(endDate);

            anno = data.getFullYear();
            mese = data.getMonth() + 1;
            if(mese < 10)
                mese = "0" + mese;
            giorno = data.getDate();
            if(giorno < 10)
                giorno = "0" + giorno;

            currData = anno+""+mese+""+giorno+"Z"+ora+"00";
        }
        else
        {
            ora++;

            if(ora < 10)
                ora = "0" + ora;

            currData = anno+""+mese+""+giorno+"Z"+ora+"00";
        }

        fetch(url_api + "products/wrf5/forecast/" + appSetting.getString("lastKnownPosition", "com63049") + "?date=" + currData + "&opt=place").then((response) => response.json()).then((data1) => {
            views = new android.widget.RemoteViews(context.getPackageName(), R.layout.my_widget2);

            var name_image = data1['forecast']['icon'];
            var img = name_image.substr(0, name_image.indexOf('.'));
            var temp_id = context.getResources().getIdentifier("@drawable/" + img, "layout", context.getPackageName());
            var temp_id_1 = context.getResources().getIdentifier("@id/imageDay_" + i, "layout", context.getPackageName());
            views.setImageViewResource(temp_id_1, temp_id);


            var temp_name = context.getResources().getIdentifier("@id/nameDay_" + i, "layout", context.getPackageName());
            let ora = (data1['forecast']['dateTime']).substring(9,11);
            views.setTextViewText(temp_name, ora + ":00");

            var temp_dir = context.getResources().getIdentifier("@id/tempDay_" + i, "layout", context.getPackageName());
            views.setTextViewText(temp_dir, data1['forecast']['t2c'] + " °C");

            var startAppIntent = new android.content.Intent(context, com.tns.NativeScriptActivity.class); // the activity defined in AndroidManifest
            startAppIntent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId);

            var pI2 = android.app.PendingIntent.getActivity(context, 0, startAppIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);

            views.setOnClickPendingIntent(R.id.go_app, pI2);

            appWidgetManager.updateAppWidget(widgetId, views);
        });
    }
}
