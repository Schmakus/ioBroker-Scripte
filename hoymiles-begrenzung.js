//**
  * Script zur Begrenzung von Hoymiles Wechselrichter in Verbindung mit openDTU
  * v0.0.2 2023/12/12 by Schmakus
  * http://www.github.com/Schmakus/ioBroker-Scripte/
  *
  * Es werden folgende eigene Datenpunkte erstellt:
  *    BegrenzungSoll:          Vorgabe der Gesamtbegrenzung
  *    BegrenzungIst:           Aktuelle Begrenzung in Watt über alle Wechselrichter
  *    BegrenzungIstInProzent:  Aktuelle Begrenzung in Prozent über alle Wechselrichter
  *
  * Info: Die Objekt-IDs im Wechselrichter Objekt sind nur zum Test und müssen mit den richtigen Datenpunkten der Wechselrichter, usw. ersetzt werden!
  */

//Wo sollen die eigenen Datenpunkte angelegt werden?
const path = "0_userdata.0.PV";

//** Angaben zu den Wechselrichtern */
const wechselrichter = {
  1: {
    name: "Wechselrichter 1",
    maxLeistung: 1600,
    objLeistung: "0_userdata.0.PV.LeistungWR1", // Datenpunkt des Wechselrichters der aktuellen Leistung in Watt
    objBegrenzung: "0_userdata.0.PV.BegrenzungWR1", // Beispiel: opendtu.0.xxxxxx.power_control.limit_persistent_absolute)
    aktuelleLeistung: 0, // Nichts ändern!
    begrenzteLeistung: 0, // Nichts ändern!
  },
  2: {
    name: "Wechselrichter 2",
    maxLeistung: 1600,
    objLeistung: "0_userdata.0.PV.LeistungWR2", // Datenpunkt des Wechselrichters der aktuellen Leistung in Watt
    objBegrenzung: "0_userdata.0.PV.BegrenzungWR2", // Beispiel: opendtu.0.xxxxxx.power_control.limit_persistent_absolute)
    aktuelleLeistung: 0, // Nichts ändern!
    begrenzteLeistung: 0, // Nichts ändern!
  },
  3: {
    name: "Wechselrichter 3",
    maxLeistung: 1600,
    objLeistung: "0_userdata.0.PV.LeistungWR3", // Datenpunkt des Wechselrichters der aktuellen Leistung in Watt
    objBegrenzung: "0_userdata.0.PV.BegrenzungWR3", // Beispiel: opendtu.0.xxxxxx.power_control.limit_persistent_absolute)
    aktuelleLeistung: 0, // Nichts ändern!
    begrenzteLeistung: 0, // Nichts ändern!
  },
};

//Objekt-ID aktuelle Leistungsaufnahme des Hauses
const objLeistungHaus = "0_userdata.0.PV.LeistungHaus"; // Hier den Datenpunkt zum Smartmeter angeben (Shelly, IR-Lesekopf, etc...)

//Entscheidung ob Batterie geladen werden soll?
const batterie = {
    laden: true, // true = laden, false = nicht laden
    maxLadeleistung: 600, //maximale Ladeleistung in Watt,
    unit: "volt", // "volt", "watt" or "percent"
    objLadungWatt: "0_userdata.0.PV.LadeleistungBatterie", // Hier den Datenpunkt zum Ladegerät angeben
    objLadungProzent: "0_userdata.0.PV.LadeleistungBatterieInProzent", // Hier den Datenpunkt zum Ladegerät angeben
    objLadungVolt: "0_userdata.0.PV.LadeleistungBatterieInVolt" // Hier den Datenpunkt zum Ladegerät angeben
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

/**
 * Diese Funktion wird aufgerufen, wenn das System bereit ist.
 */
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

/**
 * Diese Funktion erstellt und initialisiert die eigenen Datenpunkte.
 */
async function setStates() {
    // Maximal zulässige Gesamtleistung
    await createStateAsync(`${path}.BegrenzungSoll`, 800, { read: true, write: true, name: 'Begrenzung Wechselrichter in Summe', type: "number", role: "state", unit: "W", def: 800 });
    await createStateAsync(`${path}.BegrenzungIst`, 0, { read: true, write: false, name: 'Ist-Begrenzung Wechselrichter in Summe [Watt]', type: "number", role: "value", unit: "W", def: 0 });
    await createStateAsync(`${path}.BegrenzungIstInProzent`, 0, { read: true, write: false, name: 'Ist-Begrenzung Wechselrichter in Summe [Prozent]', type: "number", role: "value", unit: "%" def: 0 });
    objBegrenzung = `${path}.BegrenzungSoll`;
    objBegrenzungIst = `${path}.BegrenzungIst`;
    objBegrenzungIstProzent = `${path}.BegrenzungIstInProzent`;
    maxGesamtLeistung = getState(objBegrenzung).val ?? 800;
}

/**
 * Diese Funktion ruft die aktuellen Leistungen aller Wechselrichter ab.
 */
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

/**
 * Diese Funktion gibt ein Array der maximalen Leistungen aller Wechselrichter zurück.
 */
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

/**
 * Berechnet die maximale Leistung und setzt die Begrenzung der Wechselrichter.
 */
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

    const begrenzteLeistungIst = await getMaxBegrenzungSumme();
    const begrenzteLeistungIstInProzent = Math.round((begrenzteLeistungIst / maxGesamtLeistung) * 10000) / 100; // Runden auf 2 Nachkommastellen
    await Promise.all([
      setStateAsync(objBegrenzungIst, { val: begrenzteLeistungIst, ack: true }),
      setStateAsync(objBegrenzungIstInProzent, { val: begrenzteLeistungIstInProzent, ack: true })
    ]);
    console.log(`Gesamtbegrenzung nach Anpassung: ${begrenzteLeistungIst}W, ${begrenzteLeistungIstInProzent}%`);
    
    //Batterieladung
    await loadBattery(aktuelleLeistungen);
}

async function loadBattery(aktuelleLeistungen) {
   if (batterie.laden) {
      const leistungHaus = (await getStateAsync(objLeistungHaus)).val;
      const ueberschuss = Math.max(aktuelleLeistungen - leistungHaus, 0);
      const ladeLeistung = Math.min(ueberschuss, batterie.maxLadeleistung);
  
      const ladeLeistungProzent = Math.round((ueberschuss / batterie.maxLadeleistung) * 10000) / 100; // Runden auf 2 Nachkommastellen
      const ladeLeistungVolt = Math.round(10 * (ladeLeistungProzent / 100) * 100) / 100; // Runden auf 2 Nachkommastellen
  
      switch (batterie.unit) {
        case "watt":
          await setStateAsync(batterie.objLadungWatt, { val: ladeLeistung, ack: false });
          break;
        case "percent":
          await setStateAsync(batterie.objLadungProzent, { val: ladeLeistungProzent, ack: false });
          break;
        case "volt":
          await setStateAsync(batterie.objLadungVolt, { val: ladeLeistungVolt, ack: false });
          break;
        default:
          console.warn(Keine Einheit für die Batterieladung angegeben oder Einheit entspricht nicht 'watt', 'volt' oder 'percent'!");
        
      };
      console.log(`Aktueller Überschuss: ${ueberschuss}, Ladeleistung: ${ladeLeistung}W, ${ladeLeistungProzent}%, ${ladeLeistungVolt}`);
    }
}

onReady();
