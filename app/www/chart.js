let apiBaseUrl="https://api.meteo.uniparthenope.it";

let conColors = [
    "#FFFFFF",
    "#CCFFFF",
    "#3366FF",
    "#00CC00",
    "#FFFF00",
    "#FF3301",
    "#660033"
];

let scmColors = [
    "#F8F0FD",
    "#E1CAFF",
    "#60F3F0",
    "#30FC4B",
    "#FEF400",
    "#FFA302",
    "#F60000",
    "#C0C0C0",

];

let sssColors = [
    "#1001F3",
    "#0076FF",
    "#04B6FF",
    "#AEFE00",
    "#FFFF00",
    "#FF9403",
    "#DB0200",
    "#DBADAC"
];

let sstColors = [
    "#140756",
    "#4141C7",
    "#206EEB",
    "#459CFB",
    "#7FB7F4",
    "#B5F1F5",
    "#D0FAC4",
    "#00D580",
    "#0FA609",
    "#82D718",
    "#D5ED05",
    "#FDFD26",
    "#F6D403",
    "#F3A000",
    "#FC6608",
    "#F60305",
    "#C00A18",
    "#680A06",
    "#720008",
    "#97009C",
    "#FF05FF",
    "#FDB0F9"

];


let tempColors = [
    "#2400d8",
    "#181cf7",
    "#2857ff",
    "#3d87ff",
    "#56b0ff",
    "#75d3ff",
    "#99eaff",
    "#bcf8ff",
    "#eaffff",
    "#ffffea",
    "#fff1bc",
    "#ffd699",
    "#ffff75",
    "#ff7856",
    "#ff3d3d",
    "#f72735",
    "#d8152f",
    "#a50021"
];

let windColors = [
    "#000033",
    "#0117BA",
    "#011FF3",
    "#0533FC",
    "#1957FF",
    "#3B8BF4",
    "#4FC6F8",
    "#68F5E7",
    "#77FEC6",
    "#92FB9E",
    "#A8FE7D",
    "#CAFE5A",
    "#EDFD4D",
    "#F5D03A",
    "#EFA939",
    "#FA732E",
    "#E75326",
    "#EE3021",
    "#BB2018",
    "#7A1610",
    "#641610"
];

let hsColors = [
    "#01FF84",
    "#00FFFF",
    "#00DDDD",
    "#6363FF",
    "#0000E1",
    "#840094",
    "#B5199D",
    "#D464C3",
    "#CE0000",
    "#FF0000",
    "#FFC300",
    "#FFF05A",
    "#D0D0D0",
    "#BABABA",
    "#A1A1A1",
    "#5A5A5A"
];


let lmColors = [
    "#00CE7B",
    "#00AA00",
    "#7BCE00",
    "#FFCE00",
    "#FF6D00",
    "#DC0000",
    "#A00000",
    "#DC84D1",
    "#B5199D",
    "#640078",
    "#DCDCDC",
    "#AAAAAA",
    "#6E6E6E",
    "#464646"
];

let fpColors = [
    "#000033",
    "#641610"
];

let periodColors = [
    "#00CE7B",
    "#00AA00",
    "#7BCE00",
    "#FFCE00",
    "#FF6D00",
    "#DC0000",
    "#A00000",
    "#DC84D1",
    "#B5199D",
    "#640078",
    "#DCDCDC",
    "#AAAAAA",
    "#6E6E6E",
    "#464646"
];

let rhColors = [
    "#FF0000",
    "#FFFF00",
    "#00FF00",
    "#00FFFF",
    "#0078DC",
    "#FF00FF"
];

let sweColors = [
    "#000000",
    "#DDA0DD",
    "#DA70D6",
    "#BA55D3",
    "#9932CC",
    "#9400D3"
];

function swe2color(rh) {
    let index=0;

    // .5 2.5 5.5 8.5 11.5 15.5

    if (rh<.5) {
        index=0;
    } else if (rh>=.5 && rh<2.5) {
        index=1;
    } else if (rh>=2.5 && rh<5.5) {
        index=2;
    } else if (rh>=5.5 && rh<8.5) {
        index=3;
    } else if (rh>=8.5 && rh<11.5) {
        index=4;
    } else if (rh>=11.5) {
        index=5;
    }

    return sweColors[index];
}

function rh2color(rh) {
    let index=0;

    // set clevs  20 40 60 80 99

    if (rh<20) {
        index=0;
    } else if (rh>=20 && rh<40) {
        index=1;
    } else if (rh>=40 && rh<60) {
        index=2;
    } else if (rh>=60 && rh<80) {
        index=3;
    } else if (rh>=80 && rh<99) {
        index=4;
    } else if (rh>=99 ) {
        index=5 ;
    }

    return rhColors[index];
}

function hs2color(hs) {
    let index=0;


    if (hs<0.1) {
        index=0;
    } else if (hs>=0.1 && hs<0.3) {
        index=1;
    } else if (hs>=0.3 && hs<0.5) {
        index=2;
    } else if (hs>=0.5 && hs<0.8) {
        index=3;
    } else if (hs>=0.8 && hs<1.25) {
        index=4;
    } else if (hs>=1.25 && hs<1.6) {
        index=5;
    } else if (hs>=1.6 && hs<2) {
        index=6;
    } else if (hs>=2 && hs<2.5) {
        index=7;
    } else if (hs>=2.5 && hs<3) {
        index=8;
    } else if (hs>=3 && hs<4) {
        index=9;
    } else if (hs>=4 && hs<5) {
        index=10;
    } else if (hs>=5 && hs<6) {
        index=11;
    } else if (hs>=6 && hs<7) {
        index=12;
    } else if (hs>=7 && hs<8) {
        index=13;
    } else if (hs>=8 && hs<9) {
        index=14;
    } else if (hs>=9 ) {
        index=15 ;
    }

    return hsColors[index];
}

function lm2color(lm) {
    let index=0;


    if (lm<10) {
        index=0;
    } else if (lm>=10 && lm<20) {
        index=1;
    } else if (lm>=20 && lm<30) {
        index=2;
    } else if (lm>=30 && lm<40) {
        index=3;
    } else if (lm>=40 && lm<50) {
        index=4;
    } else if (lm>=50 && lm<60) {
        index=5;
    } else if (lm>=60 && lm<70) {
        index=6;
    } else if (lm>=70 && lm<80) {
        index=7;
    } else if (lm>=80 && lm<90) {
        index=8;
    } else if (lm>=90 && lm<100) {
        index=9;
    } else if (lm>=100 && lm<110) {
        index=10;
    } else if (lm>=110 && lm<120) {
        index=11;
    } else if (lm>=120 && lm<130) {
        index=12;
    } else if (lm>=130 ) {
        index=13 ;
    }

    return lmColors[index];
}

function fp2color(fp) {
    let index=0;

    // 37.5 37.75 38 38.25 38.5 38.75 39
    if (fp<37.5) {
        index=0;
    } else if (fp>=37.5 && fp<37.5) {
        index=1;
    } else if (fp>=37.75 && fp<38) {
        index=2;
    } else if (fp>=38 && fp<38.25) {
        index=3;
    } else if (fp>=38.25 && fp<38.5) {
        index=4;
    } else if (fp>=38.5 && fp<38.75) {
        index=5;
    } else if (fp>=38.75 && fp<39) {
        index=6;
    } else if (fp>=39 ) {
        index=7 ;
    }

    return fpColors[index];
}

function period2color(period) {
    let index=0;

    // 0 2 3 4 5 6 7 8 9 10 11 12 13 14
    if (period<2) {
        index=0;
    } else if (period>=2 && period<3) {
        index=1;
    } else if (period>=3 && period<4) {
        index=2;
    } else if (period>=4 && period<5) {
        index=3;
    } else if (period>=5 && period<6) {
        index=4;
    } else if (period>=6 && period<7) {
        index=5;
    } else if (period>=7 && period<8) {
        index=6;
    } else if (period>=8 && period<9) {
        index=7;
    } else if (period>=9 && period<10) {
        index=8;
    } else if (period>=10 && period<11) {
        index=9;
    } else if (period>=11 && period<12) {
        index=10;
    } else if (period>=12 && period<13) {
        index=11;
    } else if (period>=13 && period<14) {
        index=12;
    } else if (period>=14 ) {
        index=13 ;
    }

    return periodColors[index];
}

function sss2color(sss) {
    let index=0;

    // 37.5 37.75 38 38.25 38.5 38.75 39
    if (sss<37.5) {
        index=0;
    } else if (sss>=37.5 && sss<37.5) {
        index=1;
    } else if (sss>=37.75 && sss<38) {
        index=2;
    } else if (sss>=38 && sss<38.25) {
        index=3;
    } else if (sss>=38.25 && sss<38.5) {
        index=4;
    } else if (sss>=38.5 && sss<38.75) {
        index=5;
    } else if (sss>=38.75 && sss<39) {
        index=6;
    } else if (sss>=39 ) {
        index=7 ;
    }

    return sssColors[index];
}

function sst2color(sst) {
    let index=0;

    // 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
    if (sst<10) {
        index=0;
    } else if (sst>=10 && sst<11) {
        index=1;
    } else if (sst>=11 && sst<12) {
        index=2;
    } else if (sst>=12 && sst<13) {
        index=3;
    } else if (sst>=13 && sst<14) {
        index=4;
    } else if (sst>=14 && sst<15) {
        index=5;
    } else if (sst>=15 && sst<16) {
        index=6;
    } else if (sst>=16 && sst<17) {
        index=6;
    } else if (sst>=17 && sst<18) {
        index=6;
    } else if (sst>=18 && sst<19) {
        index=6;
    } else if (sst>=19 && sst<20) {
        index=6;
    } else if (sst>=20 && sst<21) {
        index=6;
    } else if (sst>=21 && sst<22) {
        index=6;
    } else if (sst>=22 && sst<23) {
        index=6;
    } else if (sst>=23 && sst<24) {
        index=6;
    } else if (sst>=24 && sst<25) {
        index=6;
    } else if (sst>=25 && sst<26) {
        index=6;
    } else if (sst>=26 && sst<27) {
        index=6;
    } else if (sst>=27 && sst<28) {
        index=6;
    } else if (sst>=28 && sst<29) {
        index=6;
    } else if (sst>=29 && sst<30) {
        index=6;
    } else if (sst>=30 ) {
        index=7 ;
    }

    return sstColors[index];
}

function con2color(conc) {
    let index=0;

    // 1 18 230 700 4600 46000
    if (conc<18) {
        index=0;
    } else if (conc>=18 && conc<230) {
        index=1;
    } else if (conc>=230 && conc<700) {
        index=2;
    } else if (conc>=700 && conc<4600) {
        index=3;
    } else if (conc>=4600 && conc<46000) {
        index=4;
    } else if (conc>=46000 ) {
        index=5 ;
    }

    return conColors[index];
}

function scm2color(scm) {
    let index=0;

    // 0.1 0.2 0.3 0.4 0.5 0.6 0.7
    if (scm<0.1) {
        index=0;
    } else if (scm>=.1 && scm<.2) {
        index=1;
    } else if (scm>=.2 && scm<.3) {
        index=2;
    } else if (scm>=.3 && scm<.4) {
        index=3;
    } else if (scm>=.4 && scm<.5) {
        index=4;
    } else if (scm>=.5 && scm<.6) {
        index=5;
    } else if (scm>=.6 && scm<.7) {
        index=5;
    } else if (scm>=.7 ) {
        index=8;
    }

    return scmColors[index];
}

function temp2color(temp) {
    let index=0;

    // -40 -30 -20 -15 -10 -5 0 3 6 9 12 15 18 21 25 30 40 50
    if (temp>=-40 && temp<-30) {
        index=0;
    } else if (temp>=-30 && temp<-20) {
        index=1;
    } else if (temp>=-20 && temp<-15) {
        index=2;
    } else if (temp>=-15 && temp<-10) {
        index=3;
    } else if (temp>=-10 && temp<-5) {
        index=4;
    } else if (temp>=-5 && temp<0) {
        index=5;
    } else if (temp>=0 && temp<3) {
        index=6;
    } else if (temp>=3 && temp<6) {
        index=7;
    } else if (temp>=6 && temp<9) {
        index=8;
    } else if (temp>=9 && temp<12) {
        index=9;
    } else if (temp>=12 && temp<15) {
        index=10;
    } else if (temp>=15 && temp<18) {
        index=11;
    } else if (temp>=18 && temp<21) {
        index=12;
    } else if (temp>=21 && temp<25) {
        index=13;
    } else if (temp>=25 && temp<30) {
        index=14;
    } else if (temp>=30 && temp<40) {
        index=15;
    } else if (temp>=40 && temp<50) {
        index=16;
    } else if (temp>=50 ) {
        index=17;
    }

    return tempColors[index];
}

function windKnt2color(ws) {
    let index=0;

    if (ws>=0 && ws<1) {
        index=0;
    } else if (ws>=1 && ws<3) {
        index=1;
    } else if (ws>=3 && ws<5) {
        index=2;
    } else if (ws>=5 && ws<7) {
        index=3;
    } else if (ws>=7 && ws<9) {
        index=4;
    } else if (ws>=9 && ws<11) {
        index=5;
    } else if (ws>=11 && ws<15) {
        index=6;
    } else if (ws>=15 && ws<17) {
        index=7;
    } else if (ws>=17 && ws<19) {
        index=8;
    } else if (ws>=19 && ws<21) {
        index=9;
    } else if (ws>=21 && ws<23) {
        index=10;
    } else if (ws>=23 && ws<25) {
        index=11;
    } else if (ws>=25 && ws<27) {
        index=12;
    } else if (ws>=27 && ws<30) {
        index=13;
    } else if (ws>=30 && ws<35) {
        index=14;
    } else if (ws>=35 && ws<40) {
        index=15;
    } else if (ws>=40 && ws<45) {
        index=16;
    } else if (ws>=45 && ws<50) {
        index=17;
    } else  {
        index=18;
    }

    // 0 1 3 5 7 9 11 13 15 17 19 21 23 25 27 30 35 40 45 50

    return windColors[index+1];
}

let oWebViewInterface1 = window.nsWebViewInterface;
let prod;
let output;
let place;
let step;
let hours;
let lingua;

oWebViewInterface1.on("lingua", function (cor) {
    lingua = cor.lingua;
});

oWebViewInterface1.on("chart", function (cor) {
    prod = cor.prod;
    place = cor.place;
    output = cor.output;
    hours = cor.hours;
    step = cor.step;

    let timeseriesUrl;

    if(prod==="ww33")
        timeseriesUrl=apiBaseUrl+"/products/"+prod+"/timeseries/"+place;
    else
        timeseriesUrl=apiBaseUrl+"/products/"+prod+"/timeseries/"+place+"?hours="+hours+"&step="+step;

    //timeseriesUrl=apiBaseUrl+"/products/"+prod+"/timeseries/"+place+"?hours="+hours+"&step="+step;

    console.log("timeseriesUrl: "+timeseriesUrl);

    let title = "Forecast";
    let dataPoints = [];
    let dataPoints2 = [];
    let data=[];
    let axisY=null, axisY2=null, colorSet=null;

    if (prod==='wrf5') {
        if (output === "gen" || output === "tsp") {
            fontSize: 18;
            let title1;
            let title2;
            if(lingua == "it") {
                title = "Pressione e Temperatura";
                title1 = "Pressione a livello del mare (HPa)";
                title2 = "Temperatura (°C)";
            }
            else {
                title = "Pressure and Temperature";
                title1 = "Sea Level Pressure (HPa)";
                title2 = "Temperature (°C)";
            }

            axisY = {
                title: title1,
                includeZero: false,
                suffix: " HPa",
                labelFontSize: 12,
                titleFontSize: 10
            };
            axisY2 = {
                title: title2,
                includeZero: false,
                suffix: " °C",
                labelFontSize: 12,
                titleFontSize: 10
            };
            data.push({
                name: "t2c",
                type: "column",
                axisYType: "secondary",
                yValueFormatString: "#0.## °C",
                dataPoints: dataPoints
            });
            data.push({
                name: "slp",
                type: "line",
                yValueFormatString: "##.# HPa",
                dataPoints: dataPoints2
            });
        } else if (output==="wn1") {
            fontSize: 18;
            let title1;
            let title2;
            if(lingua == "it") {
                title = "Velocità e direzione del vento a 10m";
                title1 = "Velocità del vento a 10m";
                title2 = "Direzione del vento a 10m (°N)";
            }
            else {
                title = "Wind Speed and Direction at 10m";
                title1 = "Wind Speed at 10m (knt)";
                title2 = "Wind Direction at 10m (°N)";
            }

            axisY = {
                title: title1,
                includeZero: false,
                suffix: " knt",
                labelFontSize: 12,
                titleFontSize: 10
            };
            axisY2 = {
                title: title2,
                maximum: 360,
                minimum:0,
                interval: 45,
                includeZero: false,
                suffix: " °",
                labelFontSize: 12,
                titleFontSize: 10
            };
            data.push({
                name: "ws",
                type: "column",
                yValueFormatString: "##.# knt",
                dataPoints: dataPoints
            });
            data.push({
                name: "wd",
                type: "line",
                axisYType: "secondary",
                yValueFormatString: "#0.## °",
                dataPoints: dataPoints2
            });
        } else if (output==="crh") {
            fontSize: 18;
            let title1;
            let title2;
            if(lingua == "it") {
                title = "Nuvole e pioggia";
                title1 = "Pioggia cumulata oraria (mm)";
                title2 = "Nuvolosità (%)";
            }
            else {
                title = "Clouds and Rain";
                title1 = "Hourly cumulated rain (mm)";
                title2 = "Cloud fraction (%)";
            }

            axisY= {
                title: title1,
                includeZero: false,
                suffix: " mm",
                labelFontSize: 12,
                titleFontSize: 10
            };
            axisY2 = {
                title: title2,
                includeZero: false,
                maximum: 100,
                suffix: " %",
                labelFontSize: 12,
                titleFontSize: 10
            };
            data.push({
                name: "crh",
                type: "column",
                yValueFormatString: "##.# mm",
                dataPoints: dataPoints
            });
            data.push({
                name: "crf",
                type: "line",
                axisYType: "secondary",
                yValueFormatString: "#0.## %",
                dataPoints: dataPoints2
            });
        }
        else if (output==="rh2") {
            fontSize: 18;
            let title1;
            let title2;
            if(lingua == "it") {
                title = "Umidità rilevata a 2m";
                title1 = "Umidità rilevata a 2m (%)";
                title2 = "Direzione del vento a 10m (°N)";
            }
            else {
                title = "Relative Humidity at 2m";
                title1 = "Relative Humidity at 2m (%)";
                title2 = "Wind Direction at 10m (°N)";
            }
            axisY= {
                title: title1,
                includeZero: false,
                maximum: 100,
                suffix: "%"
            };
            axisY2 = {
                title: title2,
                maximum: 360,
                interval: 45,
                includeZero: true,
                suffix: " °"
            };
            data.push({
                name: "rh2",
                type: "column",
                yValueFormatString: "#0.## %",
                dataPoints: dataPoints
            });
            data.push({
                name: "wd",
                type: "line",
                axisYType: "secondary",
                yValueFormatString: "#0.## °",
                dataPoints: dataPoints2
            });
        } else if (output==="swe") {
            fontSize: 18;
            let title1;
            let title2;
            if(lingua == "it") {

                // DA TRADURRE
                title = "Hourly cumulated snow fall";
                title1 = "Hourly cumulated snow fall (cm)";
                title2 = "Wind Direction at 10m (°N)";
            }
            else {
                title = "Hourly cumulated snow fall";
                title1 = "Hourly cumulated snow fall (cm)";
                title2 = "Wind Direction at 10m (°N)";
            }
            axisY= {
                title: title1,
                includeZero: false,
                suffix: "cm"
            };
            axisY2 = {
                title: title2,
                maximum: 360,
                interval: 45,
                includeZero: true,
                suffix: " °"
            };
            data.push({
                name: "rh2",
                type: "column",
                yValueFormatString: "#0.## %",
                dataPoints: dataPoints
            });
            data.push({
                name: "wd",
                type: "line",
                axisYType: "secondary",
                yValueFormatString: "#0.## °",
                dataPoints: dataPoints2
            });
        }
    } else if (prod==='wcm3') {
        if (output === "gen" || output === "con") {
            fontSize: 18;
            let title1;
            if(lingua == "it") {
                title = "Concentrazione particelle";
                title1 = "Numero di particelle";
            }
            else {
                title = "Particle concentration";
                title1 = "Number of Particles (#)";
            }

            axisY = {
                title: title1,
                includeZero: false,
                suffix: "",
                labelFontSize: 12,
                titleFontSize: 10
            };

            data.push({
                name: "con",
                type: "column",
                yValueFormatString: "##.# ",
                dataPoints: dataPoints
            });
        }
    } else if (prod==='rms3') {
        if (output === "gen" || output === "scu") {
            fontSize: 18;

            let title1;
            let title2;
            if(lingua == "it") {
                title = "Corrente superficiale";
                title1 = "Velocità corrente superficiale (m/s)";
                title2 = "Direzione Corrente superficiale (°N)";
            }
            else {
                title = "Surface current";
                title1 = "Current Speed at the surface (m/s)";
                title2 = "Current Direction at the surface (°N)";
            }

            axisY = {
                title: title1,
                includeZero: false,
                suffix: " m/s",
                labelFontSize: 12,
                titleFontSize: 10
            };
            axisY2 = {
                title: title2,
                maximum: 360,
                minimum:0,
                interval: 45,
                includeZero: false,
                suffix: " °",
                labelFontSize: 12,
                titleFontSize: 10
            };
            data.push({
                name: "scm",
                type: "column",
                yValueFormatString: "##.# m/s",
                dataPoints: dataPoints
            });
            data.push({
                name: "scd",
                type: "line",
                axisYType: "secondary",
                yValueFormatString: "#0.## °",
                dataPoints: dataPoints2
            });
        } else if (output === "sst") {
            fontSize: 18;
            let title1;
            if(lingua == "it") {
                title = "Temperatura superficiale";
                title1 = "Temperatura superficiale (°C)";
            }
            else {
                title = "Surface temperature";
                title1 = "Surface temperature (°C)";
            }

            axisY = {
                title: title1,
                includeZero: false,
                suffix: " °C",
                labelFontSize: 12,
                titleFontSize: 10
            };
            data.push({
                name: "sst",
                type: "column",
                yValueFormatString: "##.# °C",
                dataPoints: dataPoints
            });

        } else if (output === "sss") {
            fontSize: 18;
            let title1;
            if(lingua == "it") {
                title = "Salinità superficiale";
                title1 = "Salinità superficiale (1/1000)";
            }
            else {
                title = "Surface salinity";
                title1 = "Surface salinity (1/1000)";
            }

            axisY = {
                title: title1,
                includeZero: false,
                suffix: " ",
                labelFontSize: 12,
                titleFontSize: 10
            };
            data.push({
                name: "sss",
                type: "line",
                yValueFormatString: "##.# ",
                dataPoints: dataPoints
            });

        } else if (output === "sts") {
            fontSize: 18;

            let title1;
            let title2;
            if(lingua == "it") {
                title = "Temperatura e salinità superficiale";
                title1 = "Temperatura superficiale (°C)";
                title2 = "Salinità superficiale (1/1000)";
            }
            else {
                title = "Surface temperature and salinity";
                title1 = "Surface temperature (°C)";
                title2 = "Surface salinity (1/1000)";
            }

            axisY = {
                title:title1 ,
                includeZero: false,
                suffix: " °C",
                labelFontSize: 12,
                titleFontSize: 10
            };
            axisY2 = {
                title: title2,
                includeZero: false,
                suffix: " ",
                labelFontSize: 12,
                titleFontSize: 10
            };
            data.push({
                name: "sst",
                type: "column",
                yValueFormatString: "##.# °C",
                dataPoints: dataPoints
            });
            data.push({
                name: "sss",
                type: "line",
                axisYType: "secondary",
                yValueFormatString: "#0.## ",
                dataPoints: dataPoints2
            });
        }
    } else if (prod==='ww33') { //DA TRADURRE
        if (output === "gen" || output === "hsd") {
            fontSize: 18;
            let title1;
            let title2;
            if(lingua == "it") {
                title = "Altezza e direzione onde";
                title1 = "Altezza e direzione onde (m)";
                title2 = "Direzione onde (°N)";
            }
            else {
                title = "Significant wave height and direction";
                title1 = "Significant wave height (m)";
                title2 = "Mean wave direction surface (°N)";
            }
            axisY = {
                title: title1,
                includeZero: false,
                suffix: " m"
            };
            axisY2 = {
                title: title2,
                maximum: 360,
                interval: 45,
                includeZero: true,
                suffix: " °"
            };
            data.push({
                name: "hs",
                type: "column",
                yValueFormatString: "##.# m",
                dataPoints: dataPoints
            });
            data.push({
                name: "dir",
                type: "line",
                axisYType: "secondary",
                yValueFormatString: "#0.## °",
                dataPoints: dataPoints2
            });
        } else if (output === "lmd") {
            title = "Mean wave length and direction";
            axisY = {
                title: "Mean wave length (m)",
                includeZero: false,
                suffix: " m"
            };
            axisY2 = {
                title: "Mean wave direction surface (°N)",
                maximum: 360,
                interval: 45,
                includeZero: true,
                suffix: " °"
            };
            data.push({
                name: "lm",
                type: "column",
                yValueFormatString: "##.# m",
                dataPoints: dataPoints
            });
            data.push({
                name: "dir",
                type: "line",
                axisYType: "secondary",
                yValueFormatString: "#0.## °",
                dataPoints: dataPoints2
            });

        } else if (output === "fpd") {
            title = "Peak frequency and direction";
            axisY = {
                title: "Peak frequency (s-1)",
                includeZero: false,
                suffix: " s-1"
            };
            axisY2 = {
                title: "Mean wave direction surface (°N)",
                maximum: 360,
                interval: 45,
                includeZero: true,
                suffix: " °"
            };
            data.push({
                name: "fp",
                type: "line",
                yValueFormatString: "##.# s-1",
                dataPoints: dataPoints
            });
            data.push({
                name: "dir",
                type: "line",
                axisYType: "secondary",
                yValueFormatString: "#0.## °",
                dataPoints: dataPoints2
            });

        } else if (output === "ppd") {
            title = "Mean period and direction";
            axisY = {
                title: "Mean period (s)",
                includeZero: false,
                suffix: " s"
            };
            axisY2 = {
                title: "Mean wave direction surface (°N)",
                maximum: 360,
                interval: 45,
                includeZero: true,
                suffix: " °"
            };
            data.push({
                name: "period",
                type: "column",
                yValueFormatString: "##.# s",
                dataPoints: dataPoints
            });
            data.push({
                name: "dir",
                type: "line",
                axisYType: "secondary",
                yValueFormatString: "#0.## °",
                dataPoints: dataPoints2
            });
        }
    }

    let options= {
        credits: {
            enabled: false
        },
        animationEnabled: true,
        theme: "light2",
        title: {
            text: title,
            fontSize: 18,
            fontColor: "rgba(30,76,117,1)",
            margin: 20
        },
        axisX: {
            valueFormatString: "DD MMM, HHZ",
            titleFontSize: 10,
            labelFontSize: 10
        },
        axisY: axisY,
        axisY2: axisY2,

        data: data
    };

    let chart = new CanvasJS.Chart("chartContainer", options);

    $.getJSON(timeseriesUrl, function(data){
        if(data["result"]=="ok"){
            let timeSeries=data['timeseries'];
            for (let i = 0; i < timeSeries.length; i++) {
                let date = timeSeries[i].dateTime;
                let year = date.substring(0,4);
                let month = date.substring(4, 6);
                let day = date.substring(6, 8);
                let hour = date.substring(9, 11);
                let sDateTime = year + "-" + month + "-" + day + "T" + hour + ":00:00Z";
                let dateTime = new Date(sDateTime);

                if (prod==='wrf5') {
                    if (output === "gen" || output === "tsp") {

                        dataPoints2.push({
                            x: dateTime,
                            y: timeSeries[i].slp
                        });

                        dataPoints.push({
                            x: dateTime,
                            y: timeSeries[i].t2c,
                            color: temp2color(timeSeries[i].t2c)
                        });

                        oWebViewInterface1.emit("load_chart", {status:"OK"});
                    } else if (output=="wn1") {

                        dataPoints.push({
                            x: dateTime,
                            y: timeSeries[i].ws10n,
                            color: windKnt2color(timeSeries[i].ws10n)
                        });

                        dataPoints2.push({
                            x: dateTime,
                            y: timeSeries[i].wd10
                        });

                        oWebViewInterface1.emit("load_chart", {status:"OK"});
                    } else if (output=="crh") {

                        dataPoints.push({
                            x: dateTime,
                            y: timeSeries[i].crh
                        });

                        dataPoints2.push({
                            x: dateTime,
                            y: timeSeries[i].clf * 100
                        });

                        oWebViewInterface1.emit("load_chart", {status:"OK"});
                    } else if (output=="rh2") {

                        dataPoints.push({
                            x: dateTime,
                            y: val.rh2,
                            color: rh2color(val.rh2)
                        });

                        dataPoints2.push({
                            x: dateTime,
                            y: val.wd10
                        });

                        oWebViewInterface1.emit("load_chart", {status:"OK"});
                    } else if (output=="swe") {

                        dataPoints.push({
                            x: dateTime,
                            y: val.swe,
                            color: swe2color(val.swe)
                        });

                        dataPoints2.push({
                            x: dateTime,
                            y: val.wd10
                        });

                        oWebViewInterface1.emit("load_chart", {status:"OK"});
                    } else{
                        oWebViewInterface1.emit("load_chart", {status:"Error"});
                    }
                } else if (prod==='wcm3') {
                    if (output === "gen" || output === "con") {

                        dataPoints.push({
                            x: dateTime,
                            y: timeSeries[i].con,
                            color: con2color(timeSeries[i].con)
                        });

                        oWebViewInterface1.emit("load_chart", {status:"OK"});
                    } else{
                        oWebViewInterface1.emit("load_chart", {status:"Error"});
                    }
                } else if (prod==='rms3') {
                    if (output === "gen" || output === "scu") {
                        dataPoints.push({
                            x: dateTime,
                            y: timeSeries[i].scm,
                            color: scm2color(timeSeries[i].scm)
                        });

                        dataPoints2.push({
                            x: dateTime,
                            y: timeSeries[i].scd
                        });

                        oWebViewInterface1.emit("load_chart", {status:"OK"});
                    } else if (output === "sst") {
                        dataPoints.push({
                            x: dateTime,
                            y: timeSeries[i].sst,
                            color: sst2color(timeSeries[i].sst)
                        });

                        oWebViewInterface1.emit("load_chart", {status:"OK"});
                    } else if (output === "sss") {
                        dataPoints.push({
                            x: dateTime,
                            y: timeSeries[i].sss,
                            color: sss2color(timeSeries[i].sss)
                        });

                        oWebViewInterface1.emit("load_chart", {status:"OK"});
                    } else if (output === "sts") {
                        dataPoints.push({
                            x: dateTime,
                            y: timeSeries[i].sst,
                            color: sst2color(timeSeries[i].sst)
                        });

                        dataPoints2.push({
                            x: dateTime,
                            y: timeSeries[i].sss
                        });

                        oWebViewInterface1.emit("load_chart", {status:"OK"});
                    }
                    else{
                        oWebViewInterface1.emit("load_chart", {status:"Error"});
                    }
                } else if (prod==='ww33') {
                    if (output === "gen" || output === "hsd") {
                        dataPoints.push({
                            x: dateTime,
                            y: timeSeries[i].hs,
                            color: hs2color(timeSeries[i].hs)
                        });

                        dataPoints2.push({
                            x: dateTime,
                            y: timeSeries[i].dir
                        });

                        oWebViewInterface1.emit("load_chart", {status:"OK"});
                    } else if (output === "lmd") {
                        dataPoints.push({
                            x: dateTime,
                            y: timeSeries[i].lm,
                            color: lm2color(timeSeries[i].lm)
                        });

                        dataPoints2.push({
                            x: dateTime,
                            y: timeSeries[i].dir
                        });

                        oWebViewInterface1.emit("load_chart", {status:"OK"});
                    } else if (output === "fpd") {
                        dataPoints.push({
                            x: dateTime,
                            y: timeSeries[i].fp,
                            color: fp2color(timeSeries[i].fp)
                        });

                        dataPoints2.push({
                            x: dateTime,
                            y: timeSeries[i].dir
                        });

                        oWebViewInterface1.emit("load_chart", {status:"OK"});
                    } else if (output === "ppd") {
                        dataPoints.push({
                            x: dateTime,
                            y: timeSeries[i].period,
                            color: period2color(timeSeries[i].period)
                        });

                        dataPoints2.push({
                            x: dateTime,
                            y: timeSeries[i].dir
                        });

                        oWebViewInterface1.emit("load_chart", {status:"OK"});
                    } else{
                        oWebViewInterface1.emit("load_chart", {status:"Error"});
                    }
                }
            }
            chart.render();
        }
        else{
            oWebViewInterface1.emit("load_chart", {status:"Error"});
        }
        }).catch(err => {
            oWebViewInterface1.emit("load_chart", {status:"Error"});
        });
});
