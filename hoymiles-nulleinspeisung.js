//ALPHA VERSION!!!!

const inverters = [
	{
  	name: "Inverter 1",
    maxPower: 1600,
    newLimit: 100,
    oldLimit: 100,
    grid: 1200,
  },
  {
  	name: "Inverter 2",
    maxPower: 1600,
    newLimit: 100,
    oldLimit: 100,
    grid: 1500,
  },
  {
  	name: "Inverter 3",
    maxPower: 1600,
    newLimit: 100,
    oldLimit: 100,
    grid: 633,
  },
]

const powerPhaseA = -300;
const powerPhaseB = 0;
const powerPhaseC = 0;

const limitMin = 5;
const limitMax = 100;

async function reload() {
	const powerSum = powerPhaseA + powerPhaseB + powerPhaseC;
	const gridSum = await gridSumme();
  const neededPower = await gridSum + powerSum;
  const maxInverterSumme = await maxInverterSum();
  const limitSum = await percent(neededPower, maxInverterSumme, 100);
  console.log(`limitSum: ${limitSum} %, neededPower: ${neededPower} W, gridSum: ${gridSum} W, maxInverterPower: ${maxInverterSumme}`);

  let newInverterPowerSum = 0;
  let limitInverterSum = 0;
  
  if (Math.abs(gridSum - neededPower) <= 100) {
    	console.log(`${wr.name}: Nichts zu tun. Erzeugte Leistung liegt im Bereich der gemessen Leistung`);
      //return;
  }
  
  console.log(`Begrenzung durchführen...`);
  
  for (let i = 0; i < inverters.length; i++) {
  	wr = inverters[i];

    const factor = await percent(wr.grid, gridSum, 100);    
    const newlimitPower = await round(neededPower * factor / 100);
    const newLimitPercent = await percentAndLimit(limitPower, wr.maxPower, 100);
        
    console.log(`${wr.name}: Factor = ${factor}, newLimitPercent = ${newLimitPercent} %, new maximumPower = ${newlimitPower} W`);
    
    await setLimit(wr, newLimitPercent);
  
  } 
}

async function setLimit(inverter, limit) {
  console.log(`Neues Limit für ${wr.name} gesetzt.`)
}

async function gridSumme() {
	let result = 0;
	for (let i = 0; i < inverters.length; i++) {
  	result += inverters[i].grid;
	}
  return result;
}

async function maxInverterSum() {
	let result = 0;
	for (let i = 0; i < inverters.length; i++) {
  	result += inverters[i].maxPower;
	}
  return result;
}

async function limit(limit) {
  return Math.min(limitMax, Math.max(limitMin, limit));
}

async function round(value) {
  return Math.round(value * 100) / 100;
}

async function percent(power1, power2, factor) {
  let result = power1 / power2 * factor;
  result = await round(result);
  return result;
}

async function percentAndLimit(power1, power2, factor) {
  let result = power1 / power2 * factor;
  result = await round(result);
  result = await limit(result);
  return result;
}

reload();


