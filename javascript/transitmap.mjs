import { drawMap } from '../javascript/flight.mjs';
import { getMinMax } from '../javascript/getMinMax.mjs';
let type = "Transit"

getMinMax(type).then((res) => {
    console.log("min is " + res[0]);
    console.log("max is " + res[1]);
    drawMap("Transit", res[0]/10, res[1]/10, "brown", type);
});