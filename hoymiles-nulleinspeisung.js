const inverters = [
	{
  	name: "Inverter 1",
    maxPower: 1600,
    newLimit: 100,
    oldLimit: 100,
    grid: 500,
  },
  {
  	name: "Inverter 2",
    maxPower: 1600,
    newLimit: 100,
    oldLimit: 100,
    grid: 500,
  },
  {
  	name: "Inverter 3",
    maxPower: 1600,
    newLimit: 100,
    oldLimit: 100,
    grid: 833,
  },
]

const powerPhaseA = -400;
const powerPhaseB = 0;
const powerPhaseC = 0;

const limitMin = 5;
const limitMax = 100;

async function check() {
	const powerSum = powerPhaseA + powerPhaseB + powerPhaseC;
	const gridSum = await gridSumme();
  const neededPower = await gridSum + powerSum;
  const maxInverterSumme = await maxInverterSum();
  const limitSum = await percent(neededPower, maxInverterSumme, 100);
  console.log(`limitSum: ${limitSum} %, neededPower: ${neededPower} W, gridSum: ${gridSum} W, maxInverterPower: ${maxInverterSumme}`);
  
  if (powerSum >= -300 && powerSum <= 0  || (neededPower - gridSum) < 100) {
    	console.log(`Nichts zu tun. Erzeugte Leistung liegt im Bereich der gemessen Leistung`);
      await reload();
      return;
  }
    
  for (let i = 0; i < inverters.length; i++) {    
  	const inverter = inverters[i];
    
    const factor = await percent(inverter.grid, gridSum, 100);    
    const newlimitPower = await round(neededPower * factor / 100);
    const newLimitPercent = await percentAndLimit(newlimitPower, inverter.maxPower, 100);
        
    //console.log(`${inverter.name}: Factor = ${factor}, newLimitPercent = ${newLimitPercent} %, new maximumPower = ${newlimitPower} W`);
    
    await setLimit(inverter, newLimitPercent);  
  }  
  await reload();
}

async function setLimit(inverter, limit) {
  if (inverter.oldLimit === limit) {
    console.log(`Limit von ${inverter.name} ist gleich altem Limit. Keine Begrenzung`);
    return;
  }
  inverter.oldLimit = limit;
  console.log(`Neues Limit ${limit} % für ${inverter.name} gesetzt.`);
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

async function reload() {
  await new Promise(resolve => setTimeout(resolve, 5000));
  await check();
}

check();
