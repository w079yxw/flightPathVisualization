import { drawMap } from '../javascript/flight.mjs';
import { getMinMax } from '../javascript/getMinMax.mjs';
let type = "IncomePerCap"

getMinMax(type).then((res) => {
    console.log("min is " + res[0]);
    console.log("max is " + res[1]);
    drawMap("Income", res[0], res[1], "blue", type);
});