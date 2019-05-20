const appSetting = require("application-settings");

var R = it.meteo.uniparthenope.R; // reduces syntax noise, stands for 'android resources'
var rng = new java.util.Random();
var views;

android.appwidget.AppWidgetProvider.extend("com.tns.Third", {
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
        views = new android.widget.RemoteViews(context.getPackageName(), R.layout.my_widget3);
        // retrieve our layout and all its views
        views.setTextViewText(R.id.position, appSetting.getString("lastKnownPositionName", "Comune di Napoli"));
        views.setTextViewText(R.id.temperatura, data1.forecast.t2c + " °C");
        views.setTextViewText(R.id.text_meteo, data1.forecast.text.it);
        views.setTextViewText(R.id.vento, data1.forecast.winds + "  " + data1.forecast.ws10n + " kn");
        let image = getImageName(data1.forecast.winds, data1.forecast.ws10n);
        console.log(image);
        var temp_id = context.getResources().getIdentifier("@drawable/" + image, "layout", context.getPackageName());
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
            views = new android.widget.RemoteViews(context.getPackageName(), R.layout.my_widget3);

            let dir = data1['forecast']['winds'];
            let wind = data1['forecast']['ws10n'];

            let image = getImageName(dir, wind);

            var temp_id = context.getResources().getIdentifier("@drawable/" + image, "layout", context.getPackageName());
            var temp_id_1 = context.getResources().getIdentifier("@id/imageDay_" + i, "layout", context.getPackageName());
            views.setImageViewResource(temp_id_1, temp_id);


            var temp_name = context.getResources().getIdentifier("@id/nameDay_" + i, "layout", context.getPackageName());
            let ora = (data1['forecast']['dateTime']).substring(9,11);
            views.setTextViewText(temp_name, ora + ":00");

            var temp_dir = context.getResources().getIdentifier("@id/dir_" + i, "layout", context.getPackageName());
            views.setTextViewText(temp_dir, data1['forecast']['winds']);

            var temp_wind = context.getResources().getIdentifier("@id/wind_" + i, "layout", context.getPackageName());
            views.setTextViewText(temp_wind, data1['forecast']['ws10n'] + " kn");

            var startAppIntent = new android.content.Intent(context, com.tns.NativeScriptActivity.class); // the activity defined in AndroidManifest
            startAppIntent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId);

            var pI2 = android.app.PendingIntent.getActivity(context, 0, startAppIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);

            views.setOnClickPendingIntent(R.id.go_app, pI2);

            appWidgetManager.updateAppWidget(widgetId, views);
        });
    }
}

function getImageName(dir, wind) {
    let image_name;
    let _wind;
    let _dir;

    if(dir === "NNE" || dir === "ENE")
        _dir = "ne";

    else if(dir === "SSE" || dir === "ESE")
        _dir = "se";

    else if(dir === "SSW" || dir === "WSW")
        _dir = "sw";

    else if(dir === "WNW" || dir === "NNW")
        _dir = "nw";

    else
        _dir = dir.toLowerCase();

    if(wind >=0 && wind < 11)
        _wind = 10;
    else if(wind >=11 && wind < 21)
        _wind = 20;
    else if(wind >= 21 && wind < 31)
        _wind = 30;
    else if(wind >=31 && wind < 41)
        _wind = 40;
    else if(wind >=41 && wind < 51)
        _wind = 50;
    else if(wind >=51 && wind < 61)
        _wind = 60;
    else if(wind >= 61 && wind < 71)
        _wind = 70;
    else if(wind >=71)
        _wind = 100;

    image_name = "wind_" + _dir + "_" + _wind;

    return image_name;
}
