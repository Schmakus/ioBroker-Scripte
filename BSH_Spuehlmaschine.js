//******* Script zum automatischen Start der Spühlmaschine bei Solar-Wärme */
// Bei der Spühlmaschine wird das gewünschte Programm gewählt und der Fernstart aktiviert
// Bei Erreichen der gewünschten Wassertemperatur (limit) wird das gewählte Programm ausgeführt.
// Wenn es nicht zu Erreichen der Temperatur kommen sollte, wird die Maschine automatisch zur gewählten
// Uhrezeit aktiviert.
//********************************************************************************************************** */


const device = "homeconnect.0.BOSCH-SBV68TX06E-68A40E402831"; // Pfad zur Spühlmaschine
const oidCondition = "alias.0.Sensoren.Temperaturen.Heizung_Solar_Tank"; // Object-ID zur Temperatur oder sonstige Bedingung wie PV-Überschuss, etc. 
const limit = 55; // Grenzwert, bei der die Maschine beginnt zu Starten
const operatior = ">="; // Operator
const hour = 18; // Stunde, bei der die Maschine spätestens startet, auch wenn die Temperatur nicht erreicht ist
const minute = 0; // Minute, bei der die Maschine spätestens startet, auch wenn die Temperatur nicht erreicht ist

const logging = true; // Logging ein/aus

//****************************** */
// AB HIER NICHTS MEHR ÄNDERN!!!
//****************************** */

const maschine = {
    remote: {
        oid: device + ".status.BSH_Common_Status_RemoteControlStartAllowed",
        val: async function() { 
            const result = (await getStateAsync(this.oid)).val; 
            if (logging) console.log(`Spühlmaschine Remote Status: ${result}`);
            return result;
        }
    },
    door: {
        oid: device + ".status.BSH_Common_Status_DoorState",
        val: async function() {
            const result = ((await getStateAsync(this.oid)).val) === "BSH.Common.EnumType.DoorState.Closed" ? true : false;
            if (logging) console.log(`Spühlmaschine Tür geschlossen?: ${result}`);
            return result;
        }
    },
    operation: {
        oid: device + ".status.BSH_Common_Status_OperationState",
        val: async function() {
            const result = ((await getStateAsync(this.oid)).val) === "BSH.Common.EnumType.OperationState.Ready" ? true : false;
            if (logging) console.log(`Spühlmaschine startklar?: ${result}`);
            return result;
        }
    },
    control: {
        oid: device + ".programs.active.BSH_Common_Root_ActiveProgram",
        val: async function() {
            const result = (await getStateAsync(this.oid)).val;
            if (logging) console.log(`Spühlmaschine Programm gesetzt: ${result}`);
            return result;
        }
    },
    selected: {
        oid: device + ".programs.selected.BSH_Common_Root_SelectedProgram",
        val: async function() {
            const result = (await getStateAsync(this.oid)).val;
            if (logging) console.log(`Spühlmaschine gewähltes Programm: ${result}`);
            return result;
        }
    },
    condition: {
        oid: oidCondition,
        val: async function() {
            const result = (await getStateAsync(this.oid)).val;
            if (logging) console.log(`Spühlmaschine Wert der Bedingung: ${result}`);
            return result;
        }
    },
    clean: async function() { 
        await setStateAsync(this.control.oid, await this.selected.val()); 
        if (logging) console.log(`Spühlmaschine gestartet.`);
        }
};

console.log(getState(device + ".status.BSH_Common_Status_DoorState").val)

const cron = `${minute} ${hour} * * *`;

//Trigger of Door
on({id: maschine.door.oid, change:"ne"}, async function (obj) {
    if (await maschine.door.val()) {
        if((await maschine.condition.val() >= limit) && await maschine.remote.val() && await maschine.operation.val()) {
            await maschine.clean();
            if (logging) console.log(`Spühlmaschine wurde eingeschaltet, da Bedingung erreicht und Tür geschlossen wurde`);
        }
    }
})

//Trigger of WaterTemperatur
on({id: maschine.condition.oid, change: "ne"}, async function (obj) {
    //Wenn Bedingung erfüllt und Fernstart aktiv und Spühlmaschine ready, dann Start
    if((await maschine.condition.val() >=  limit) && await maschine.remote.val() && await maschine.operation.val()) {
        await maschine.clean();
        if (logging) console.log(`Spühlmaschine wurde eingeschaltet, da Bedingung erreicht`);
    }
  
});

//Scheduler
const schedulerClean = schedule(cron, async function () {
    if (await maschine.remote.val() && await maschine.operation.val()) {
        await maschine.clean();
        if (logging) console.log(`Spühlmaschine wurde eingeschaltet, da Zeit überschritten`);
    }
});

//onStop Funktion
onStop(function () { //Bei Scriptende alle Schedules
    clearSchedule(schedulerClean);
}, 10);

