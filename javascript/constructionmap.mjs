import { drawMap } from '../javascript/flight.mjs';
import { getMinMax } from '../javascript/getMinMax.mjs';
let type = "Construction"

getMinMax(type).then((res) => {
    drawMap("Construction", res[0], res[1], "purple", type);
});