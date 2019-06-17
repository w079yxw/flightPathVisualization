import { drawMap } from '../javascript/flight.mjs';
import { getMinMax } from '../javascript/getMinMax.mjs';
let type = "TotalPop"

getMinMax(type).then((res) => {
    console.log("min is " + res[0]);
    console.log("max is " + res[1]);
    drawMap("Population", res[0]/100, res[1]/100, "green", type);
});