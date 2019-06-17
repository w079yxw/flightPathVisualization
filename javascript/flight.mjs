function drawMap(legendText, min, max, color, type) {
    let margin = {
        top: 80,
        bottom: 50,
        left: 50,
        right: 50
    };
    let width = 960;
    let height = 600;

    var colorScale = d3.scaleLinear()
        .domain([min, max])
        .range(["white", color]);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right + 50)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// Legends
    var legend = svg.selectAll(".legend")
        .data(colorScale.ticks(9).slice(1))
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(" + (width) + ", " + (30 + i * 30) + ")");

    legend.append("rect")
        .attr("width", 30)
        .attr("height", 30)
        .style("fill", colorScale);

    //add % for poverty map
    if(type == "Poverty") {
        legend.append("text")
            .attr("x", 75)
            .attr("y", 18)
            .attr("dy", ".35em")
            .text("%");
    }

    legend.append("text")
        .attr("x", 72)
        .attr("y", 18)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(String);

    // Legend title
    svg.append("text")
        .attr("class", "title")
        .attr("x", width)
        .attr("y", 20)
        .attr("fill", "#000")
        .attr("font-size", "16px")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(legendText);

//add second legend
    var delayClass=["on-schedule","delay"]

    var delayText=["On schedule","Likely delay"]
    var delayData=[]

    for(var i=0;i<2;i++){

        delayData.push({'class':delayClass[i],'text':delayText[i]})
        // delayData{'color':delayColor[i],'text':delayText[i]}
    }

  var lineLegend = svg.selectAll(".lineLegend").data(delayData)
    .enter().append("g")
    .attr("class","lineLegend")
    .attr("transform", function (d,i) {
            return "translate(" + (360+i*150) + "," + (600)+")";
        });

lineLegend.append("text").text(function (d) {return d['text'];})
    .attr("transform", "translate(12,9)"); //align texts with boxes

lineLegend.append("circle")
    .attr("r", 5)
    .attr("class", function (d) {
        return d['class']
    } )
    // / Legend title
    svg.append("text")
        .attr("class", "title")
        .attr("x",395)
        .attr("y", 630)
        .attr("fill", "#000")
        .attr("font-size", "16px")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Delay Probability");
// Load data
    let usPromise = d3.json('../asset/us.json');
     let delayPromise = d3.csv('../asset/delay.csv');
    let povertyPromise = d3.csv('../asset/acs2015_county_dataV2.csv');
    let airportPromise = d3.csv("../asset/airport.csv", d => ({
        type: "Feature",
        properties: d,
        geometry: {
            type: "Point",
            coordinates: [+d.longitude, +d.latitude]
        }
    }));
    let flightPromise = d3.csv('../asset/flights.csv');
// Path
    let projection = d3.geoAlbers()
        .scale(1280)
        .translate([480, 300]);
    let path1 = d3.geoPath();
    let path = d3.geoPath()
        .projection(projection).pointRadius(2.5)
        // .pointRadius(2.5);
    let div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    let radius = d3.scaleSqrt()
        .domain([0, 100])
        .range([0, 14]);
    let voronoi = d3.voronoi()
        .extent([[-1, -1], [width + 1, height + 1]]);
    ;
    Promise.all([usPromise, povertyPromise, airportPromise, flightPromise,delayPromise]).then(function (values) {
        let us = values[0];
        let percent = values[1];
        let airports = values[2];
        let flights = values[3];
         let delays=values[4];

        let povertyMap = d3.map();
        percent.forEach(function (p) {
            povertyMap.set(p.CensusId, p);
        });

        airports.forEach(function (d) {
            d[0] = +d.properties.longitude;
            d[1] = +d.properties.latitude;
            d.arcs = {type: "MultiLineString", coordinates: []};
            return d;
        })

 var delayByflights = d3.map(delays,function (d) {
           return d.origin+","+d.destination;
        })

        var airportByIata = d3.map(airports, function (d) {
            return d.properties.iata
        });
          flights.forEach(function (flight) {
                flight.count = +flight.count;
                var source = airportByIata.get(flight.origin),
                    target = airportByIata.get(flight.destination),
                    delay=delayByflights.get(flight.origin+","+flight.destination);
                    let delayprob=delay!=null?delay.delay_probability:0
                source.arcs.coordinates.push([source, target,delayprob]);

                target.arcs.coordinates.push([target, source,delayprob]);
                return flight
            }
        );

        airports = airports
            .filter(function (d) {
                return d.arcs.coordinates.length;
            });
        let features = topojson.feature(us, us.objects.counties).features;
        let features2 = topojson.mesh(us, us.objects.states, function (a, b) {
            return a != b;
        });

        let info = [];

        svg.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .attr("class", "land")
            .data(features)
            .enter()
            .append("path")
            .attr("d", path1)
            .attr("fill", (d) => {
                if (povertyMap.get(d.id)) {
                    return colorScale(povertyMap.get(d.id)[type]);
                }
            })

        svg.append("path")
            .attr("class", "state-borders")
            .datum(features2)
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", path1);
        svg.append("path")
            .datum({type: "FeatureCollection", features: airports})

             .attr("d", path)
            .attr("fill","darkblue")
        .style("opacity", 0.6)



        var airport = svg.selectAll(".airport")
            .data(airports)
            .enter().append("g")
            .attr("class", "airport");

        airport.append("title")
            .text(function (d) {
                return d.properties.iata + "\n" + d.arcs.coordinates.length + " flights";
            });
        //colorful path with airports
        // airport.append("path")
        //     .attr("class", function (d) {
        //         let num = d.arcs.coordinates.length
        //         if (num > 10 && num<50) {
        //             return 'airport-arc'
        //         }
        //         else if (num >= 50){
        //             return 'airport-arc0'
        //         }
        //         else if (num <=10){
        //             return 'airport-arc1'
        //         }
        //             }
        //     )
        //     .attr("d", function (d) {
        //
        //
        //
        //         return path(d.arcs);
        //     })
//colorful path with flights
  airport.selectAll("path").data(function (d) {

      return d.arcs.coordinates
  })
      .enter()
      .append("path")
            .attr("class", function (d) {
                // console.log(d)
                // let num = d.length
                // if (num > 10 && num<50) {
                //     return 'airport-arc'
                // }
                // else if (num >= 50){
                //     return 'airport-arc0'
                // }
                // else if (num <=10){
                //     return 'airport-arc1'
                // }
                //     }
                let num = d[2]
                if(num==0){

                    return 'airport-arc0'
                }
                else{
                    return 'airport-arc1'
                }
                }
            )
            .attr("d", function (d) {

            // console.log(path(d))

                // return path(d);
                return lngLatToArc(d, 0, 1, 0);
            })


        var item = voronoi.polygons(airports.map(projection));
        airport.append("path")
            .data(item)
            .attr("class", "airport-cell")
            .attr("d", function (d) {
                return d ? "M" + d.join("L") + "Z" : null;
            });
    });
}
function lngLatToArc(d, sourceName, targetName, bend){

     let projection = d3.geoAlbers()
        .scale(1280)
        .translate([480, 300]);
			// .scale(730.1630554896399) //translate to center the map in view
		// If no bend is supplied, then do the plain square root
		bend = bend || 1;
		// `d[sourceName]` and `d[targetname]` are arrays of `[lng, lat]`
		// Note, people often put these in lat then lng, but mathematically we want x then y which is `lng,lat`

		var sourceLngLat = d[sourceName],
				targetLngLat = d[targetName];

		if (targetLngLat && sourceLngLat) {
			var sourceXY = projection( sourceLngLat ),
					targetXY = projection( targetLngLat );

			// Uncomment this for testing, useful to see if you have any null lng/lat values
			// if (!targetXY) console.log(d, targetLngLat, targetXY)
            if(sourceXY==null||targetXY==null){
               return;
           }
			var sourceX = sourceXY[0],
					sourceY = sourceXY[1];

			var targetX = targetXY[0],
					targetY = targetXY[1];

			var dx = targetX - sourceX,
					dy = targetY - sourceY,
					dr = Math.sqrt(dx * dx + dy * dy)*bend;

			// To avoid a whirlpool effect, make the bend direction consistent regardless of whether the source is east or west of the target
			var west_of_source = (targetX - sourceX) < 0;
			if (west_of_source) return "M" + targetX + "," + targetY + "A" + dr + "," + dr + " 0 0,1 " + sourceX + "," + sourceY;
			return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;

		} else {
			return "M0,0,l0,0z";
		}
	}
export {drawMap};
