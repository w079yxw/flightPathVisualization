import { getMinMax } from '../javascript/getMinMax.mjs';
import { drawMap } from '../javascript/flight.mjs';
let type = "Drive"

getMinMax(type).then((res) => {
    drawMap("Drive", res[0], res[1], "grey", type);
});