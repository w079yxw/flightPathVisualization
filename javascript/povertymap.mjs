import { getMinMax } from '../javascript/getMinMax.mjs';
import { drawMap } from '../javascript/flight.mjs';
let type = "Poverty"

getMinMax(type).then((res) => {
    drawMap("Poverty Rate", res[0], res[1], "red", type);
});