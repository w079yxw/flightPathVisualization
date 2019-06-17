import { drawMap } from '../javascript/flight.mjs';
import { getMinMax } from '../javascript/getMinMax.mjs';
let type = "MeanCommute"

getMinMax(type).then((res) => {
    console.log("min is " + res[0]);
    console.log("max is " + res[1]);
    drawMap("Mean Commute", res[0], res[1], "green", type);
});