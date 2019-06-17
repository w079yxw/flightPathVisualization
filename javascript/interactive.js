
let topDelayFlight = [];
//let flightData = d3.csv("../asset/2015_flights_IATA_CountV2.csv");
let flightData = d3.csv("../asset/Merged_csv/out.csv");

let margin = {
    top: 80,
    right: 80,
    bottom: 80,
    left: 80
};
let width = 960 - margin.left - margin.right;
let height = 480 - margin.top - margin.bottom;
let svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + " " + margin.top + ")")
    .attr("transform", "translate(80, 0)");

flightData.then(function(data){
    data.forEach(function(d){
        topDelayFlight.push({
            origin: d.ORIGIN_AIRPORT,
            destination: d.DESTINATION_AIRPORT,
            totalflights: +d.TOTAL_FLIGHTS,
            delayCount: +d.ARRIVAL_DELAY,
            delayRate: +d.DELAY_RATIO,
            county: d.County_des,
            state: d.state_des,
            totalPop: +d.TotalPop_des,
            poverty: +d.Poverty_des,
            incomePerCap: +d.IncomePerCap_des,
            incomePerCapErr: +d.IncomePerCapErr_des
        });
    });

    top10DelayFlight = topDelayFlight.filter(function (d) {
        return d.totalflights > 120;
    }).sort((a, b) => (b.delayRate - a.delayRate)).slice(0, 10);

    console.log(top10DelayFlight);

    let xScale = d3.scaleLinear()
        .domain([0, d3.max(top10DelayFlight, (d) => d.delayRate)])
        .range([0, width*0.8]);

    let yScale = d3.scaleLinear()
        .domain([0, top10DelayFlight.length])
        .range([margin.top, height + margin.top])

    let lineChart = svg.selectAll("rect")
        .data(top10DelayFlight)
        .enter();

    lineChart.append("text")
        .attr("x", 0)
        .attr("y", (d, i) => yScale(i-1))
        .attr("fill", "black")
        .attr("text-anchor", "end")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text((d) => d.origin);

    lineChart.append("rect")
        .attr("fill", "grey")
        .attr("x", 10)
        .attr("y", (d,i) => yScale(i-1)-16)
        .attr("width", (d) => xScale(d.delayRate))
        .attr("height", yScale(0)*0.3);

    lineChart.append("text")
        .attr("x", margin.left)
        .attr("y", (d, i) => yScale(i-1))
        .attr("fill", "white")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text((d) => d.delayRate.toFixed(3));

    lineChart.append("text")
        .attr("x", (d) => xScale(d.delayRate)+20)
        .attr("y", (d, i) => yScale(i-1))
        .attr("fill", "black")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text((d) => d.destination);


//add mouseOver
svg.selectAll("rect")
    .on("mouseover", function(d){
    d3.select(this).attr("fill", "blue");
    console.log(this);
    //console.log(d.country);

    drawText(d);
})
    .on("mouseout",function(){
    d3.select(this).attr("fill", "gray")
   d3.select("#myTitle").remove();
     d3.select("#myText").remove();

});

//add text
var margin2 = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width2 = 350,
    height2 = 300;

function drawText(d){
    var info = "Total_flights: " + d.totalflights + "\n" + "Delay_flights: " + d.delayCount + "\n"+
            "Location: " + d.county + "," + d.state + "\n" + "Population: " + d.totalPop + '\n' + "Poverty: " + d.poverty + '\n' + "Income_per_Capital: " + d.incomePerCap + '\n'

    svg.append("text")
         .attr("id", "myTitle")
        .attr("x", 0)
        .attr("y", 400)
        .text("Delay-Airline information in details:"  )
        .style("font-weight", "bold")
        .style("text-anchor", "left");

    svg.append("text")
        .text(info)
         .attr("id", "myText")
        .attr("x", 0)
        .attr("y", 420)
        .style("text-anchor", "left");

}
});
