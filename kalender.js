/* System Datuminfo

Skript erzeugt Variablen für Datum, Tag, Monat, Jahr, KW, Quartal

KW1 = 1. Donnerstag im Jahr
1. Wochentag ist Montag
Feiertage aus Adapter iobroker.feiertage

*/

const path = "0_userdata.0.Kalender.Datuminfo.de"; // Pfad zu Objekten im javascript-Adapter
const fC = false; // Objekte neu erstellen?
const logging = false;

const dezimals = 1; // Dezimalstellen Anteilausgabe

const monthNameLong =    ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const monthNameShort =   ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const dayWeekNameLong =  ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"]; // So 1 und 7
const dayWeekNameShort = ["So","Mo","Di","Mi","Don","Fr","Sa","So"];

// ++++++++++ Objekte
// Adapter feiertage installiert?
const feiertag = true; // Schalter Feiertag-Adapter nutzen oder nicht
const idHolidayToday = "feiertage.0.heute.boolean"/*Feiertag heute?*/;
const idHolidayTodayName = "feiertage.0.heute.Name"/*Feiertag heute - Name*/;


// AB HIER NIX MEHR EINSTELLEN
// Jahr
/*
Jahr
datuminfo.0.de.jahr.nummer (2016)
datuminfo.0.de.jahr.schaltjahr (true)
*/
const idYear = path + ".Jahr.Zahl";
const idYearShort = path + ".Jahr.ZahlShort";
const idYearLeap = path + ".Jahr.Schaltjahr";
createState(idYear, 0, fC, {
    name: "Kalender - Jahreszahl",
    type: "number",
    role: "value"
});
createState(idYearShort, "23", fC, {
    name: "Kalender - Jahreszahl kurz",
    type: "string",
    role: "value"
});
createState(idYearLeap, false, fC, {
    name: "Kalender - Schaltjahr",
    type: "boolean",
    role: "indicator"
});

// Quartal
const idQuart = path + ".Quartal.Nummer";
const idQuartEven = path + ".Quartal.gerade";
const idQuartPastCount = path + ".Quartal.Vergangenheit.Anzahl";
const idQuartPastShare = path + ".Quartal.Vergangenheit.Anteil";
const idQuartFutureCount = path + ".Quartal.Zukunft.Anzahl";
const idQuartFutureShare = path + ".Quartal.Zukunft.Anteil";

createState(idQuart, 1, fC, {
    name: "Kalender - Quartal - Nummer",
    type: "number",
    min: 1,
    max: 4,
    role: "level"
});
createState(idQuartEven, {
    name: "Kalender - Quartal - gerade",
    type: "boolean",
    role: "indicator"
});
createState(idQuartPastCount, 0, fC, {
    name: "Kalender - Quartal - Anzahl vergangene Quartale im Jahr",
    type: "number",
    min: 0,
    max: 3,
    role: "level"
});
createState(idQuartPastShare, 0, fC, {
    name: "Kalender - Quartal - Anteil vergangene Quartale im Jahr",
    type: "number",
    unit: "%",
    role: "level",
    min: 0,
    max: 100
});
createState(idQuartFutureCount, 0, fC, {
    name: "Kalender - Quartal - Anzahl kommender Quartale im Jahr",
    type: "number",
    min: 0,
    max: 3,
    role: "level"
});
createState(idQuartFutureShare, 0, fC, {
    name: "Kalender - Quartal - Anteil kommender Quartale im Jahr",
    type: "number",
    unit: "%",
    role: "level",
    min: 0,
    max: 100
});

/*
Monat
datuminfo.0.de.monat.name.lang (April)
datuminfo.0.de.monat.name.kurz (April)
datuminfo.0.de.monat.nummer.deutsch.nummer (4)
datuminfo.0.de.monat.nummer.deutsch.gerade (true)
datuminfo.0.de.monat.nummer.deutsch.ungerade (false)
datuminfo.0.de.monat.nummer.system.nummer (5)
datuminfo.0.de.monat.nummer.system.gerade (false)
datuminfo.0.de.monat.nummer.system.ungerade (true)

datuminfo.0.de.monat.jahr.nummer (4) // deutsch
datuminfo.0.de.monat.jahr.anzahl (12)
datuminfo.0.de.monat.jahr.vergangenheit.anzahl (4)
datuminfo.0.de.monat.jahr.vergangenheit.Anteil (4 von 12) (4*100)/12
datuminfo.0.de.monat.jahr.zukunft.anzahl (8)
datuminfo.0.de.monat.jahr.zukunft.Anteil (8 von 12) (8*100)/12
*/
const idMonthNameShort = path + ".Monat.Name.kurz";
const idMonthNameLong = path + ".Monat.Name.lang";
const idMonthNumberCount = path + ".Monat.Nummer.Nummer";
const idMonthNumberString = path + ".Monat.Nummer.NummerString";
const idMonthNumberEven = path + ".Monat.Nummer.gerade";
const idMonthYearCount = path + ".Monat.Jahr.Anzahl"; // steht fest
const idMonthYearPastCount = path + ".Monat.Jahr.Vergangenheit.Anzahl";
const idMonthYearPastShare = path + ".Monat.Jahr.Vergangenheit.Anteil";
const idMonthYearFutureCount = path + ".Monat.Jahr.Zukunft.Anzahl";
const idMonthYearFutureShare = path + ".Monat.Jahr.Zukunft.Anteil";

createState(idMonthNameShort, "", fC, {
    name: "Kalender - Monat - kurze Name",
    type: "string",
    role: "text"
});
createState(idMonthNameLong, "", fC, {
    name: "Kalender - Monat - langer Name",
    type: "string",
    role: "text"
});
createState(idMonthNumberCount, 1, fC, {
    name: "Kalender - Monat - Nummer",
    desc: "Januar = 1, ..., Monat Dezember = 12",
    type: "number",
    min: 1,
    max: 12,
    role: "level"
});
createState(idMonthNumberString, 1, fC, {
    name: "Kalender - Monat - Nummer als String",
    desc: "Januar = 01, ..., Monat Dezember = 12",
    type: "string",
    role: "level"
});
createState(idMonthNumberEven, false, fC, {
    name: "Kalender - Monat - Nummer - gerade",
    type: "boolean",
    role: "indicator"
});
createState(idMonthYearCount, 12, fC, {
    name: "Kalender - Monate - Anzahl im Jahr",
    type: "number",
    role: "val",
    min: 12,
    max: 12
});
createState(idMonthYearPastCount, 0, fC, {
    name: "Kalender - Monate - Anzahl vergangene Monate im Jahr",
    type: "number",
    role: "level",
    min: 0,
    max: 11
});
createState(idMonthYearPastShare, Math.round(1/12), fC, {
    name: "Kalender - Monate - Anteil vergangene Monate im Jahr",
    type: "number",
    unit: "%",
    role: "level",
    min: 0,
    max: 100
});
createState(idMonthYearFutureCount, 0, fC, {
    name: "Kalender - Monate - Anzahl kommender Monate im Jahr",
    type: "number",
    role: "level",
    min: 0,
    max: 11
});
createState(idMonthYearFutureShare, Math.round(11/12), fC, {
    name: "Kalender - Monate - Anteil kommender Monate im Jahr",
    type: "number",
    unit: "%",
    role: "level",
    min: 0,
    max: 100
});

/*
Woche
datuminfo.0.de.woche.gesamt (52)
datuminfo.0.de.woche.vergangenheit.anzahl (17)
datuminfo.0.de.woche.vergangenheit.Anteil (17 von 52) 17*100/52
datuminfo.0.de.woche.zukunft.anzahl (35)
datuminfo.0.de.woche.zukunft.Anteil (35 von 52)       35*100/52
datuminfo.0.de.woche.nummer (17)
datuminfo.0.de.woche.gerade (true)
datuminfo.0.de.woche.ungerade (false)
*/
const idWeekYearCount = path + ".Woche.Jahr.Anzahl"; // steht fest
const idWeekYearNumberCount = path + ".Woche.Jahr.Kalenderwoche.Nummer";
const idWeekYearNumberEven = path + ".Woche.Jahr.Kalenderwoche.gerade";
const idWeekYearPastCount = path + ".Woche.Jahr.Vergangenheit.Anzahl";
const idWeekYearPastShare = path + ".Woche.Jahr.Vergangenheit.Anteil";
const idWeekYearFutureCount = path + ".Woche.Jahr.Zukunft.Anzahl";
const idWeekYearFutureShare = path + ".Woche.Jahr.Zukunft.Anteil";

createState(idWeekYearCount, 52, fC, {
    name: "Kalender - Wochen im Jahr - Anzahl",
    type: "number",
    role: "level"
});
createState(idWeekYearPastCount, 0, fC, {
    name: "Kalender - Wochen - Anzahl vergangene Wochen im Jahr",
    type: "number",
    min: 0,
    max: 52,
    role: "level"
});
createState(idWeekYearPastShare, 0, fC, {
    name: "Kalender - Wochen - Anteil vergangene Wochen im Jahr",
    type: "number",
    unit: "%",
    min: 0,
    max: 100,
    role: "level"
});
createState(idWeekYearFutureCount, 0, fC, {
    name: "Kalender - Wochen - Anzahl kommender Wochen im Jahr",
    type: "number",
    min: 0,
    max: 52,
    role: "level"
});
createState(idWeekYearFutureShare, 0, fC, {
    name: "Kalender - Wochen - Anteil kommender Wochen im Jahr",
    type: "number",
    unit: "%",
    min: 0,
    max: 100,
    role: "level"
});
createState(idWeekYearNumberCount, 0, fC, {
    name: "Kalender - Wochen - Kalenderwoche",
    type: "number",
    min: 0,
    max: 53,
    unit: "KW",
    role: "level"
});
createState(idWeekYearNumberEven, false, fC, {
    name: "Kalender - Wochen - Kalenderwoche gerade",
    type: "boolean",
    role: "indicator"
});

/*
Tag
datuminfo.0.de.tag.woche.name.lang (Donnerstag)
datuminfo.0.de.tag.woche.name.kurz (Do)
datuminfo.0.de.tag.woche.nummer.deutsch (4)
datuminfo.0.de.tag.woche.nummer.system (4)
datuminfo.0.de.tag.woche.vergangenheit.anzahl (4) // deutsches system ab Montag
datuminfo.0.de.tag.woche.vergangenheit.Anteil (4 von 7)  4*100/7
datuminfo.0.de.tag.woche.zukunft.anzahl (3)
datuminfo.0.de.tag.woche.zukunft.Anteil (3 von 7)        3*100/7

datuminfo.0.de.tag.monat.gesamt (30) // tage im monat
datuminfo.0.de.tag.monat.vergangenheit.anzahl (28) // seit monats beginn
datuminfo.0.de.tag.monat.vergangenheit.Anteil (28 von 30)   28*100/30
datuminfo.0.de.tag.monat.zukunft.anzahl (2)        // bis monatsende
datuminfo.0.de.tag.monat.zukunft.Anteil (2 von 30)          2*100/30
datuminfo.0.de.tag.monat.nummer (28)
datuminfo.0.de.tag.monat.gerade (true)
datuminfo.0.de.tag.monat.ungerade (false)

datuminfo.0.de.tag.jahr.nummer (119)
datuminfo.0.de.tag.jahr.gerade (true)
datuminfo.0.de.tag.jahr.ungerade (false)
datuminfo.0.de.tag.jahr.gesamt (366)
datuminfo.0.de.tag.jahr.vergangenheit.anzahl (119)           // seit jahresbeginn
datuminfo.0.de.tag.jahr.vergangenheit.Anteil (119 von 366) 119*100/366
datuminfo.0.de.tag.jahr.zukunft.anzahl (247)                // bis jahresende
datuminfo.0.de.tag.jahr.zukunft.Anteil (247 von 366)       247*100/366
*/
const idDayName = path + ".Tag.Name";
const idDayHoliday = path + ".Tag.Feiertag";
createState(idDayName, "", fC, {
    name: "Kalender - Name des Tages",
    type: "string",
    role: "text"
}); 
createState(idDayHoliday, false, fC, {
    name: "Kalender - heute Feiertag?",
    type: "boolean",
    role: "indicator"
});

const idDayWeekNameLong = path + ".Tag.Woche.Name.lang";
const idDayWeekNameShort = path + ".Tag.Woche.Name.kurz";
const idDayWeekNumber = path + ".Tag.Woche.Nummer";
const idDayWeekPastCount = path + ".Tag.Woche.Vergangenheit.Anzahl";
const idDayWeekPastShare = path + ".Tag.Woche.Vergangenheit.Anteil";
const idDayWeekFutureCount = path + ".Tag.Woche.Zukunft.Anzahl";
const idDayWeekFutureShare = path + ".Tag.Woche.Zukunft.Anteil";

createState(idDayWeekNameLong, "", fC, {
    name: "Kalender - Tag der Woche - langer Name",
    type: "string",
    role: "dayofweek"
});
createState(idDayWeekNameShort, "", fC, {
    name: "Kalender - Tag der Woche - kurzer Name",
    type: "string",
    role: "dayofweek"
});
createState(idDayWeekNumber, 1, fC, {
    name: "Kalender - Tag der Woche - Nummer",
    desc: "Mo = 1, ..., Sa = 6, So = 7",
    type: "number",
    role: "level",
    min: 1,
    max: 7
});
createState(idDayWeekPastCount, 0, fC, {
    name: "Kalender - Tag der Woche - Anzahl vergangene Tage in der Woche",
    type: "number",
    min: 0,
    max: 6,
    role: "value"
});
createState(idDayWeekPastShare, 0, fC, {
    name: "Kalender - Tag der Woche - Anteil vergangene Tage in der Woche",
    type: "number",
    unit: "%",
    min: 0,
    max: 100,
    role: "level"
});
createState(idDayWeekFutureCount, 0, fC, {
    name: "Kalender - Tag der Woche - Anzahl kommender Tage in der Woche",
    type: "number",
    min: 0,
    max: 6,
    role: "value"
});
createState(idDayWeekFutureShare, 0, fC, {
    name: "Kalender - Tag der Woche - Anteil kommender Tage in der Woche",
    type: "number",
    unit: "%",
    min: 0,
    max: 100,
    role: "level"
});

const idDayMonthCount = path + ".Tag.Monat.Anzahl";
const idDayMonthPastCount = path + ".Tag.Monat.Vergangenheit.Anzahl";
const idDayMonthPastShare = path + ".Tag.Monat.Vergangenheit.Anteil";
const idDayMonthFutureCount = path + ".Tag.Monat.Zukunft.Anzahl";
const idDayMonthFutureShare = path + ".Tag.Monat.Zukunft.Anteil";
const idDayMonthNumber = path + ".Tag.Monat.Nummer";
const idDayMonthEven = path + ".Tag.Monat.gerade";

createState(idDayMonthCount, 0, fC, {
    name: "Kalender - Tage im Monat - Anzahl Tage im Monat",
    type: "number",
    min: 28,
    max: 31,
    role: "level"
}); 
createState(idDayMonthPastCount, 0, fC, {
    name: "Kalender - Tage im Monat - Anzahl vergangene Tage im Monat",
    type: "number",
    role: "level",
    min: 0,
    max: 31
});
createState(idDayMonthPastShare, 0, fC, {
    name: "Kalender - Tage im Monat - Anteil vergangene Tage im Monat",
    type: "number",
    unit: "%",
    role: "level",
    min: 0,
    max: 100
});
createState(idDayMonthFutureCount, 0, fC, {
    name: "Kalender - Tage im Monat - Anzahl kommender Tage im Monat",
    type: "number",
    role: "level",
    min: 0,
    max: 31
});
createState(idDayMonthFutureShare, 0, fC, {
    name: "Kalender - Tage im Monat - Anteil kommender Tage im Monat",
    type: "number",
    unit: "%",
    role: "level",
    min: 0,
    max: 100
}); 
createState(idDayMonthNumber, 0, fC, {
    name: "Kalender - Tage im Monat - Nummer",
    type: "number",
    role: "level",
    min: 0,
    max: 31
}); 
createState(idDayMonthEven, false, fC, {
    name: "Kalender - Tage im Monat - Nummer gerade",
    type: "boolean",
    role: "indicator"
}); 

const idDayYearPastCount = path + ".Tag.Jahr.Vergangenheit.Anzahl";
const idDayYearPastShare = path + ".Tag.Jahr.Vergangenheit.Anteil";
const idDayYearFutureCount = path + ".Tag.Jahr.Zukunft.Anzahl";
const idDayYearFutureShare = path + ".Tag.Jahr.Zukunft.Anteil";
const idDayYearNumber = path + ".Tag.Jahr.Nummer";
const idDayYearEven = path + ".Tag.Jahr.gerade";
const idDayYearCount = path + ".Tag.Jahr.Anzahl";

createState(idDayYearPastCount, 0, fC, {
    name: "Kalender - Tage im Jahr - Anzahl vergangene Tage im Jahr",
    type: "number",
    role: "level",
    min: 0,
    max: 366
});
createState(idDayYearPastShare, 0, fC, {
    name: "Kalender - Tage im Jahr - Anteil vergangene Tage im Jahr",
    type: "number",
    unit: "%",
    role: "level",
    min: 0,
    max: 100
});
createState(idDayYearFutureCount, 0, fC, {
    name: "Kalender - Tage im Jahr - Anzahl kommender Tage im Jahr",
    type: "number",
    role: "level",
    min: 0,
    max: 366
});
createState(idDayYearFutureShare, 0, fC, {
    name: "Kalender - Tage im Jahr - Anteil kommender Tage im Jahr",
    type: "number",
    unit: "%",
    role: "level",
    min: 0,
    max: 100
}); 
createState(idDayYearNumber, 1, fC, {
    name: "Kalender - Tage im Jahr - Nummer",
    type: "number",
    role: "level",
    min: 1,
    max: 366
}); 
createState(idDayYearEven, false, fC, {
    name: "Kalender - Tage im Jahr - Nummer gerade",
    type: "boolean",
    role: "indicator"
}); 
createState(idDayYearCount, 365, fC, {
    name: "Kalender - Tage im Jahr - Anzahl",
    desc: "Anzahl der Tage im Jahr ist abhängig vom Schaltjahr",
    type: "number",
    role: "level",
    min: 365,
    max: 366
}); 

/*
Datum
datuminfo.0.de.datum.sehrkurz (28.4.16)
datuminfo.0.de.datum.kurz (28.04.2016)
datuminfo.0.de.datum.monattext (28. April 2016)
datuminfo.0.de.datum.tagmonattext (Donnerstag, 28. April 2016)
datuminfo.0.de.datum.tagdermonattext (Donnerstag, der 28. April 2016)
*/

const idDateVeryShort = path + ".Datum.sehrkurz";
const idDateShort = path + ".Datum.kurz";
const idDateMonthText = path + ".Datum.monattext";
const idDateDayMonthText = path + ".Datum.tagmonattext";
const idDateDayMonthArtikelText = path + ".Datum.tagdermonattext";

createState(idDateVeryShort, "", fC, {
    name: "Kalender - Datum als sehr kurzer Text",
    desc: "DD.M.JJ",
    type: "string",
    role: "text"
}); 
createState(idDateShort, "", fC, {
    name: "Kalender - Datum als kurzer Text",
    desc: "DD.MM.JJJJ",
    type: "string",
    role: "text"
}); 
createState(idDateMonthText, "", fC, {
    name: "Kalender - Datum als Text mit Monatsname",
    desc: "DD. Monat JJJJ",
    type: "string",
    role: "text"
}); 
createState(idDateDayMonthText, "", fC, {
    name: "Kalender - Datum als Text mit Wochentag und Monatsname",
    desc: "Wochentag, DD. Monat JJJJ",
    type: "string",
    role: "text"
}); 
createState(idDateDayMonthArtikelText, "", fC, {
    name: "Kalender - Datum als Text mit Wochentag, Artikel und Monatsname",
    desc: "Wochentag, der DD. Monat JJJJ",
    type: "string",
    role: "text"
}); 

// LOGIK ++++++++++++++++++
function zeit(time) {
    // log(formatDate(time,"JJJJ.MM.TT SS:mm:ss"));
    let jetzt = new Date(time);
    let jahr       = jetzt.getFullYear();
    let jahrShort  = jetzt.getFullYear().toString().slice(-2);
    let monat      = (jetzt.getMonth()+1 < 10) ? "0" + (jetzt.getMonth()+1) : jetzt.getMonth()+1;

    let monthNum    = jetzt.getMonth() + 1; // Monat als eine Zahl von 1 bis 12
    let monatString = monthNum < 10 ? '0' + monthNum : monthNum.toString(); // Monat als String mit vorangestellter 0 falls einstellig

    let tag        = jetzt.getDate();
    let tag_lang   = (jetzt.getDate() < 10) ? "0" + jetzt.getDate() : jetzt.getDate();
    let wochentag  = jetzt.getDay(); // startet am Sonntag mit 0
    let stunde     = (jetzt.getHours() < 10) ? "0" + jetzt.getHours() : jetzt.getHours();
    let minute     = (jetzt.getMinutes() < 10) ? "0" + jetzt.getMinutes() : jetzt.getMinutes();
    let sekunde    = (jetzt.getSeconds() < 10) ? "0" + jetzt.getSeconds() : jetzt.getSeconds();
    return {
        "Jahr"         : jahr,
        "JahrShort"    : jahrShort,
        "Monat"        : monat,
        "MonatString"  : monatString,
        "Monat_gerade" : (monat%2 === 0) ? true : false,
        "Tag"          : tag,
        "Tag_lang"     : tag_lang,
        "Wochentag"    : wochentag,
        "Stunde"       : stunde,
        "Minute"       : minute,
        "Sekunde"      : sekunde
    };
}

function ermittleQuartal(time) {
    //let z = new Date (time);
    let y = time.getMonth(); // Monat 0 - 11
    let q = 0;
    switch (y) {
        case 0: // Jan
        case 1:
        case 2: 
            q = 1;
            break;
        case 3: // Apr
        case 4:
        case 5: 
            q = 2;
            break;
        case 6: // Jul
        case 7:
        case 8: 
            q = 3;
            break;
        case 9: // Okt
        case 10:
        case 11: 
            q = 4;
            break;
        default: 
            q = 0;
            break;
    }
    
    return({
        "count": q,
        "even" : (q%2 === 0) ? true : false
    });
}

function ermittleTagDesJahres (time) {
    var heutestart = new Date(time.setHours(0,0,0,0));
    var Jahr = heutestart.getFullYear();
    var neujahr = new Date(Jahr,0,1);
    var difftage = (heutestart - neujahr) / (24*60*60*1000) + 1;
    var tag = Math.ceil(difftage);
    return(tag);
}

function ermittleKW(time) { // http://www.web-toolbox.net/webtoolbox/datum/code-kalenderwocheaktuell.htm
    // Woche, die den ersten Donnerstag enthält https://de.wikipedia.org/wiki/Woche
    var KWDatum = new Date(time);
    var DonnerstagDat = new Date(KWDatum.getTime() + (3-((KWDatum.getDay()+6) % 7)) * 86400000);
    var KWJahr = DonnerstagDat.getFullYear();
    var DonnerstagKW = new Date(new Date(KWJahr,0,4).getTime() + (3-((new Date(KWJahr,0,4).getDay()+6) % 7)) * 86400000);
    var KW = Math.floor(1.5 + (DonnerstagDat.getTime() - DonnerstagKW.getTime()) / 86400000/7);
    var kalenderwoche = (parseInt(KW,10) < 10) ? "0" + KW : KW;
    return({
        "kalenderwocheStr" : kalenderwoche,   // ggf. führende 0
        "kalenderwocheInt" : parseInt(KW,10), // Zahl
        "even"             : (parseInt(KW,10)%2 === 0) ? true: false
    });
}

function leseDatum () {
    let jetzt = new Date();
    
    // ### Jahr
    let jjjj = zeit(jetzt).Jahr;
    let sj = (jjjj % 4 === 0) ? true : false;
    if (logging) {
        log("Jahr: " + jjjj);
        log("Schaltjahr: " + sj);
    }
    setState(idYearLeap, sj, true);
    setState(idYear, jjjj, true);
    setState(idYearShort, zeit(jetzt).JahrShort, true);
    
    // ### Quartal
    let quartal = ermittleQuartal(jetzt).count;
    setState(idQuart, quartal, true);
    setState(idQuartEven, ermittleQuartal(jetzt).even, true);
    setState(idQuartPastCount, quartal, true);
    setState(idQuartPastShare, parseFloat((quartal * 100 / 4).toFixed(dezimals)), true);
    setState(idQuartFutureCount, 4 - quartal, true);
    setState(idQuartFutureShare, parseFloat(((4-quartal) * 100 / 4).toFixed(dezimals)), true);
    
    // ### Monat
    //setState("Kalender.Datuminfo.de.Monat.Jahr.Anzahl", {val: 12, ack: true}); // steht fest und wird oben angelegt
    let mon_vergangen = parseInt(zeit(jetzt).Monat, 10);
    let monat_gerade = zeit(jetzt).Monat_gerade;
    setState(idMonthNameShort, monthNameShort[mon_vergangen-1], true); 
    setState(idMonthNameLong, monthNameLong[mon_vergangen-1], true);
    setState(idMonthNumberCount, mon_vergangen, true);
    setState(idMonthNumberEven, monat_gerade, true);
    setState(idMonthNumberString, zeit(jetzt).MonatString, true);
    // Monat im Jahr
    setState(idMonthYearPastCount, mon_vergangen, true);
    setState(idMonthYearPastShare, parseFloat((mon_vergangen * 100 / 12).toFixed(dezimals)), true);
    setState(idMonthYearFutureCount, 12 - mon_vergangen, true);
    setState(idMonthYearFutureShare, parseFloat(((12-mon_vergangen) * 100 / 12).toFixed(dezimals)), true);
    
    // ### Woche
    // setState("Kalender.Datuminfo.de.Woche.Jahr.Anzahl", {val: 52, ack: true});
    let kw = ermittleKW(jetzt).kalenderwocheInt;
    let silvester = new Date(zeit(jetzt).Jahr, 11, 31, 23, 59, 59, 0); // 31.12.JAHR 23:59:59:0000 Uhr aktuelles Jahr Silvester
    let lastkw = ermittleKW(silvester).kalenderwocheInt;
    if (logging) log("KW an Silvester: " + lastkw);
    setState(idWeekYearNumberCount, kw, true);
    setState(idWeekYearNumberEven, ermittleKW(jetzt).even, true);
    
    // Woche im Jahr
    setState(idWeekYearPastCount, kw, true);
    setState(idWeekYearPastShare, parseFloat(((kw * 100) / 52).toFixed(dezimals)), true);
    let x_kw = (lastkw != 1 ? lastkw : 52); // 52 oder 53 ----- einfach Wert zum weiteren Rechnen
    let futurekw = x_kw - kw; // wenn letzte KW des Jahres 1 ist, dann von 52 abziehen (können auch mal 53KW sein)
    setState(idWeekYearFutureCount, futurekw, true); 
    setState(idWeekYearFutureShare, parseFloat(((x_kw - kw) * 100 / x_kw).toFixed(dezimals)), true);
    
    // ### Tag
    // Tag in Woche
    let wochentag = (zeit(jetzt).Wochentag > 0) ? zeit(jetzt).Wochentag : 7 ; // Wenn Tag nicht 0, dann Tag sonst 7; Mo = 1, ..., So = 7
    setState(idDayWeekNameLong, dayWeekNameLong[wochentag], true);
    setState(idDayWeekNameShort, dayWeekNameShort[wochentag], true);
    if (logging) log("Wochentag:" + wochentag);
    setState(idDayWeekNumber, wochentag, true);
    setState(idDayWeekPastCount, wochentag, true);
    setState(idDayWeekPastShare, parseFloat((wochentag * 100 / 7).toFixed(dezimals)), true);
    setState(idDayWeekFutureCount, 7 - wochentag, true);
    setState(idDayWeekFutureShare, parseFloat(((7 - wochentag) * 100 / 7).toFixed(dezimals)), true);
    // Tag im Monat
    let schaltfeb = (sj) ? 29 : 28;
    let monatslaenge = [31,schaltfeb,31,30,31,30,31,31,30,31,30,31];
    let tage_im_monat = parseInt(monatslaenge[mon_vergangen-1],10);
    setState(idDayMonthCount, tage_im_monat, true);
    let tage_im_monat_vergangen = zeit(jetzt).Tag;
    setState(idDayMonthPastCount, tage_im_monat_vergangen, true);
    setState(idDayMonthPastShare, parseFloat(((tage_im_monat_vergangen * 100) / tage_im_monat).toFixed(dezimals)), true);
    setState(idDayMonthFutureCount, tage_im_monat- tage_im_monat_vergangen, true);
    setState(idDayMonthFutureShare, parseFloat(((tage_im_monat - tage_im_monat_vergangen) * 100 / tage_im_monat).toFixed(dezimals)), true);
    setState(idDayMonthNumber, tage_im_monat_vergangen, true);
    let tage_im_monat_vergangen_gerade = (tage_im_monat_vergangen % 2 === 0) ? true : false;
    setState(idDayMonthEven, tage_im_monat_vergangen_gerade, true);
    // Tag im Jahr
    let tage_im_jahr_vergangen = ermittleTagDesJahres(jetzt);
    setState(idDayYearNumber, tage_im_jahr_vergangen, true);
    let tage_im_jahr_vergangen_gerade = (tage_im_jahr_vergangen % 2 === 0) ? true : false;
    setState(idDayYearEven, tage_im_jahr_vergangen_gerade, true);
    let tage_im_jahr = (sj) ? 366 : 365;
    setState(idDayYearCount, tage_im_jahr, true);
    setState(idDayYearPastCount, tage_im_jahr_vergangen, true);
    setState(idDayYearPastShare, parseFloat((tage_im_jahr_vergangen * 100 / tage_im_jahr).toFixed(dezimals)), true);
    setState(idDayYearFutureCount, tage_im_jahr - tage_im_jahr_vergangen, true);
    setState(idDayYearFutureShare, parseFloat(((tage_im_jahr - tage_im_jahr_vergangen) * 100 / tage_im_jahr).toFixed(dezimals)), true);
    
    // heute Feiertag
    let name_des_tages = "";
    let istFeiertag = false;
    if (feiertag) {
        name_des_tages = getState(idHolidayTodayName).val;
        istFeiertag = getState(idHolidayToday).val;
    }
    setState(idDayName, name_des_tages, true);
    setState(idDayHoliday, istFeiertag, true);
    
    // ### Ausgabe + Allgemein
    // D.M.YY
    let jj = jjjj - 2000;
    setState(idDateVeryShort, tage_im_monat_vergangen + "." + mon_vergangen + "." + jj, true);
    // DD.MM.YYYY
    let dd = (tage_im_monat_vergangen < 10) ? "0" + tage_im_monat_vergangen : tage_im_monat_vergangen;
    let mm = (mon_vergangen < 10) ? "0" + mon_vergangen : mon_vergangen;
    setState(idDateShort, dd + "." + mm + "." + jjjj, true);
    // D. Monat JJJJ
    setState(idDateMonthText, tage_im_monat_vergangen + ". " + monthNameLong[mon_vergangen-1] + " " + jjjj, true);
    // Wochentag, DD. Monat JJJJ
    setState(idDateDayMonthText, dayWeekNameLong[wochentag] + ", " + tage_im_monat_vergangen + ". " + monthNameLong[mon_vergangen-1] + " " + jjjj, true);
    // Wochentag, der DD. Monat JJJJ
    setState(idDateDayMonthArtikelText, dayWeekNameLong[wochentag] + ", der " + tage_im_monat_vergangen + ". " + monthNameLong[mon_vergangen-1] + " " + jjjj, true);

    log("Kalenderinformation zum heutigen Datum angelegt", "debug");
}   

setTimeout(leseDatum, 2500);
schedule("0 0,12,18 * * *", leseDatum); // Mitternacht und zwei Backups
