//**
/* Script zur Begrenzung von Hoymiles Wechselrichter in Verbindung mit openDTU
/* v0.0.1 2023/12/12 by Schmakus
/* http://www.github.com/Schmakus/ioBroker-Scripte/
*/

//** Angaben zu den Wechselrichtern */
const wechselrichter = {
  1: {
    name: "Wechselrichter 1",
    maxLeistung: 1600,
    objLeistung: "0_userdata.0.PV.LeistungWR1",
    objBegrenzung: "0_userdata.0.PV.BegrenzungWR1",
    aktuelleLeistung: 0, // Nichts ändern!
    begrenzteLeistung: 0, // Nichts ändern!
  },
  2: {
    name: "Wechselrichter 2",
    maxLeistung: 1600,
    objLeistung: "0_userdata.0.PV.LeistungWR2",
    objBegrenzung: "0_userdata.0.PV.BegrenzungWR2",
    aktuelleLeistung: 0, // Nichts ändern!
    begrenzteLeistung: 0, // Nichts ändern!
  },
  3: {
    name: "Wechselrichter 3",
    maxLeistung: 1600,
    objLeistung: "0_userdata.0.PV.LeistungWR3",
    objBegrenzung: "0_userdata.0.PV.BegrenzungWR3",
    aktuelleLeistung: 0, // Nichts ändern!
    begrenzteLeistung: 0, // Nichts ändern!
  },
};

//Wo sollen die eigenen Datenpunkte angelegt werden?
const path = "0_userdata.0.PV";

//Objekt-ID aktuelle Leistungsaufnahme des Hauses
const objLeistungHaus = "0_userdata.0.PV.LeistungHaus";

//Entscheidung ob Batterie geladen werden soll?
const batterie = {
    laden: true,
    maxLadeleistung: 600, //maximale Ladeleistung in Watt
    objLadungWatt: "0_userdata.0.PV.LadeleistungBatterie",
    objLadungProzent: "0_userdata.0.PV.LadeleistungBatterieInProzent",
    objLadungVolt: "0_userdata.0.PV.LadeleistungBatterieInVolt"
}

//**************************** */
// AB HIER NICHTS MEHR ÄNDERN! //
//**************************** */

//Variablen
let wechselrichterLeistungen = [];
let maximaleLeistungen = [];
let entpreller = null;
let maxGesamtLeistung = 0;
let objBegrenzung = "";

// Start
async function onReady() {
    await setStates();
    await getWechselrichterLeistungen();

    for (const wr of Object.values(wechselrichter)) {
        on({ id: wr.objLeistung, change: "ne" }, async (obj) => {
        wr.aktuelleLeistung = obj.state.val;
        console.log(`Aktuelle Leistung eines Wechselrichters aktualisiert. Wechselrichter: ${wr.name}, aktuelle Leistung: ${wr.aktuelleLeistung}`);
        await setWechselrichterLeistungen();
        });
    }

    const updateMaxGesamtLeistung = async (obj) => {
            maxGesamtLeistung = (await getStateAsync(objBegrenzung)).val || 800;
            await setStateAsync(objBegrenzung, { val: maxGesamtLeistung, ack: true });
            console.log(`Aktuelle Begrenzung Soll: ${maxGesamtLeistung}`);
            await setWechselrichterLeistungen();
     };
    
    on({ id: [objLeistungHaus, objBegrenzung], change: "ne" }, updateMaxGesamtLeistung);
}

async function setStates() {
    // Maximal zulässige Gesamtleistung
    await createStateAsync(`${path}.BegrenzungSoll`, 800, { read: true, write: true, name: 'Begrenzung Wechselrichter in Summe', type: "number", role: "state", def: 800 });
    objBegrenzung = `${path}.BegrenzungSoll`;
    maxGesamtLeistung = getState(objBegrenzung).val ?? 800;
}

async function getWechselrichterLeistungen() {
    for (const wr of Object.values(wechselrichter)) {
        try {
            const leistung = await getStateAsync(wr.objLeistung);
            if (leistung) {
                wr.aktuelleLeistung = leistung.val;
            } else {
                console.error(
                `Could not retrieve state for ${wr.objLeistung}`
                );
                wr.aktuelleLeistung = 0; // Use 0 as a default value
            }
        } catch (error) {
            console.error(
                `Error retrieving state for ${wr.objLeistung}: ${error}`
            );
            wr.aktuelleLeistung = 0; // Use 0 as a default value
        }
    }    
}

async function getMaximaleLeistungen() {
  return Object.values(wechselrichter).map(
    (wechselrichter) => wechselrichter.maxLeistung
  );
}

/**
 * Berechnet die Summe aller maxLeistung-Werte im Wechselrichter-Objekt.
 */
async function getMaxLeistungSumme() {
  let summe = 0;
  // Iteriere durch jedes Wechselrichter-Objekt
  for (const wr of Object.values(wechselrichter)) {
      summe = summe + wr.aktuelleLeistung;
  }
  return summe;
};

/**
 * Berechnet die Summe aller begrenzteLeistung-Werte im Wechselrichter-Objekt.
 */
async function getMaxBegrenzungSumme() {
  let summe = 0;
  // Iteriere durch jedes Wechselrichter-Objekt
  for (const wr of Object.values(wechselrichter)) {
      summe = summe + wr.begrenzteLeistung;
  }
  return summe;
};

//maxLeistung berechnen und Wechselrichter setzen
async function setWechselrichterLeistungen() {
    const aktuelleLeistungen = await getMaxLeistungSumme();
    console.log(`Aktuelle Gesamtleistung der Wechselrichter: ${aktuelleLeistungen}`);

    const faktor = maxGesamtLeistung / aktuelleLeistungen;
    console.log(`Reduktionsfaktor der Wechselrichter: ${faktor}`);

    await Promise.all(
        Object.values(wechselrichter).map(async (wr) => {
            let begrenzung = Math.floor(wr.aktuelleLeistung * faktor);
            
            // Begrenze die einzelnen Wechselrichter auf mindestens 50W
            begrenzung = Math.max(begrenzung, 50);
            
            // Begrenze die einzelnen Wechselrichter auf maxGesamtLeistung
            begrenzung = Math.min(begrenzung, maxGesamtLeistung);
            
            wr.begrenzteLeistung = begrenzung;
            
            await setStateAsync(wr.objBegrenzung, { val: wr.begrenzteLeistung, ack: false });

            const prozentualeLeistung = (wr.begrenzteLeistung / wr.maxLeistung) * 100;
            console.log(`${wr.name}: ${wr.begrenzteLeistung}W (${prozentualeLeistung.toFixed(2)}%)`);
        })
    );

    const begrenzteLeistungGesamt = await getMaxBegrenzungSumme();
    await setStateAsync("0_userdata.0.PV.BegrenzungGesamt", { val: begrenzteLeistungGesamt, ack: true });
    console.log(`Gesamtbegrenzung nach Anpassung: ${begrenzteLeistungGesamt}`);


    
    //Batterieladung
   if (batterie.laden) {
    const leistungHaus = (await getStateAsync(objLeistungHaus)).val;
    const ueberschuss = Math.max(aktuelleLeistungen - leistungHaus, 0);
    const ladeLeistung = Math.min(ueberschuss, batterie.maxLadeleistung);

    const ladeLeistungProzent = Math.round((ueberschuss / batterie.maxLadeleistung) * 10000) / 100; // Runden auf 2 Nachkommastellen
    const ladeLeistungVolt = Math.round(10 * (ladeLeistungProzent / 100) * 100) / 100; // Runden auf 2 Nachkommastellen

    await Promise.all([
        setStateAsync(batterie.objLadungWatt, { val: ladeLeistung, ack: false }),
        setStateAsync(batterie.objLadungProzent, { val: ladeLeistungProzent, ack: false }),
        setStateAsync(batterie.objLadungVolt, { val: ladeLeistungVolt, ack: false }),
    ]);
    console.log(`Aktueller Überschuss: ${ueberschuss}, Ladeleistung: ${ladeLeistung}W, ${ladeLeistungProzent}%`);
    }

}

onReady();
