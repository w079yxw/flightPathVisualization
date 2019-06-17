function getMinMax(type) {
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    return new Promise(function(resolve) {
            resolve(d3.csv("../asset/acs2015_county_dataV2.csv").then(function (data) {
                data.map((d) => {
                    if (Number(d[type]) < min) {
                        min = d[type];
                    }

                    if(Number(d[type]) > max) {
                        max = d[type];
                    }
                });
                let res = [min, max];
                return res;
            }));
        }
    );
}

export {getMinMax}