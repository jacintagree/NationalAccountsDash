// A dashboard of the Australian National Accounts, published quarterly by the absolute

// Page dimensions
var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50
  },
  width = 400 - margin.left - margin.right,
  height = 220 - margin.top - margin.bottom;


// ----- Charts 1 and 2 ---------------------


// Variable to interpret the dates (change to quarterly)
var parseDate = d3.timeParse("%Y");

// Variables to convert data to canvas points
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Set up axes
var xAxis = d3.axisBottom(x).ticks(5);
var yAxis = d3.axisLeft(y).ticks(5);



// Define the first line
var valueline1 = d3.line()
  .x(function(d) {
    return x(d.date);
  })
  .y(function(d) {
    return y(d.gdpqoq);
  });

// Define the second line
var valueline2 = d3.line()
  .x(function(d) {
    return x(d.date);
  })
  .y(function(d) {
    return y(d.gdptty);
  });


// Add the first chart to the svg canvas and give it a group
var chart1 = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add the first chart to the svg canvas and give it a group
var chart2 = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("NADash.csv", function(error, data) {
  data.forEach(function(d) {
    d.date = parseDate(d.Date);
    d.gdpqoq = +d.GDPqoq;
    d.gdptty = +d.GDPtty;
  });

  // Set up max values
  var maxqoq = d3.max(data, function(d) {
    return d.gdpqoq;
  });
  var maxtty = d3.max(data, function(d) {
    return d.gdptty;
  });
  console.log(maxqoq)
  console.log(maxtty)

  // Scale the range of the data for chart 1
  x.domain(d3.extent(data, function(d) {
    return d.date;
  }));
  y.domain([-maxqoq, maxqoq]);

  // Add the first path, and x and y axes.
  chart1.append("path")
    .attr("class", "line")
    .attr("stroke", "pink")
    .attr("d", valueline1(data));

  chart1.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height / 2 + ")")
    .call(xAxis);

  chart1.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  chart1.append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", 0)
    .attr("dy", 0)
    .attr("text-anchor", "middle")
    .text("GDP growth (qoq)");

  chart1.append("text")
    .attr("class", "yAxisLabel")
    .attr("text-anchor", "end")
    .style("pointer-events", "none")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", 0)
    .text("%");

  // Scale the range of the data for chart 2
  x.domain(d3.extent(data, function(d) {
    return d.date;
  }));
  y.domain([-maxtty, maxtty]);

  // Add the second path, and x and y axes.
  chart2.append("path")
    .attr("class", "line")
    .attr("stroke", "pink")
    .attr("d", valueline2(data));

  chart2.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height / 2 + ")")
    .call(xAxis);

  chart2.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  chart2.append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", 0)
    .attr("dy", 0)
    .attr("text-anchor", "middle")
    .text("GDP growth (tty)");

  chart2.append("text")
    .attr("class", "yAxisLabel")
    .attr("text-anchor", "end")
    .style("pointer-events", "none")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", 0)
    .text("%");


});


// ------- End of charts 1 and 2 -----------


// ------- Charts 3 ---------------

// Variables to convert data to canvas points
var x3 = d3.scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.1);

var y3 = d3.scaleLinear()
  .range([height, 0]);

// Set up axes
var xAxis3 = d3.axisBottom(x3).ticks(5);
var yAxis3 = d3.axisLeft(y3).ticks(5);

// Set up the third chart and append, give it a group
var chart3 = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// Get the data
d3.csv("NADash_current.csv", function(error, data3) {

// Transform data and get totals - data 3
var cumulative = 0;
for (var i = 0; i < data3.length; i++ ) {
  data3[i].start = cumulative;
  cumulative += +data3[i].value;
  data3[i].end = cumulative;

data3[i].class = ( +data3[i].value >= 0 ) ? 'positive' : 'negative'

}; // Close for loop

data3.push({
  name: 'Total',
  end: cumulative,
  start: 0,
  class: 'total'
}); // Close data push function

console.log(data3)
console.log(cumulative)

// Get the domain of the data and scale it to the svg range
x3.domain(data3.map(function (d) { return d.name; }));
y3.domain([0, d3.max(data3, function(d) { return d.end; })]);

// Append x axis to the chart
chart3.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis3)
  .selectAll(".tick text")
  .call(wrap, x3.bandwidth());


// Append the y axis to the chart
chart3.append("g")
  .attr("class", "y axis")
  .call(yAxis3);

//
chart3.append("text")
  .attr("class", "title")
  .attr("x", width / 2)
  .attr("y", 0)
  .attr("dy", 0)
  .attr("text-anchor", "middle")
  .text("Contribution to GDP growth (qoq)");

// Set up the bars
var bar = chart3.selectAll(".bar")
      .data(data3)
      .enter().append("g")
      .attr("class", function(d) { return "bar" + d.class })
      .attr("transform", function(d) { return "translate(" + x3(d.name) + ",0)"; });

// Add the bars to the chart
bar.append("rect")
.style("opacity", 0.2)
.attr("y", function(d) { return y3(Math.max(d.start, d.end) ); })
.attr("height", function(d) { return Math.abs(y3(d.start) - y3(d.end) ); })
.attr("width", x3.bandwidth());

// Add the labels
bar.append("text")
.attr("x", x3.bandwidth()/2 )
.attr("y", function(d) { return y3(d.end) ; })
.attr("dy", function(d) { return ((d.class=='negative') ? '-' : '') + "0.75em" })
.text(function(d) {return d.end - d.start ; });


bar.filter( function(d) { return d.class != "total"} ).append("line")
.attr("class", "connector")
.attr("x1", x3.bandwidth() + 5)
.attr("y1", function(d) { return y3(d.end) } )
.attr("x2", x3.bandwidth() / (-5) )
.attr("y2", function(d) { return y3(d.end) } )

}); //Close d3.csv


function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
    while (word = words.pop()) {
      line.push(word)
      tspan.text(line.join(" "))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
      }
    }
  })
}

//Source: https://gist.github.com/guypursey/f47d8cd11a8ff24854305505dbbd8c07
//Source: http://bl.ocks.org/chucklam/f3c7b3e3709a0afd5d57

// ----------- end of chart 3 -------------------------- //

// ----------- start chart 4 (copy of chart3) ----------- //

// Variables to convert data to canvas points
var x4 = d3.scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.1);

var y4 = d3.scaleLinear()
  .range([height, 0]);

// Set up axes
var xAxis4 = d3.axisBottom(x4).ticks(5);
var yAxis4 = d3.axisLeft(y4).ticks(5);

// Set up the third chart and append, give it a group
var chart4 = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// Get the data
d3.csv("NADash_current.csv", function(error, data4) {

// Transform data and get totals - data 3
var cumulative = 0;
for (var i = 0; i < data4.length; i++ ) {
  data4[i].start = cumulative;
  cumulative += +data4[i].valuetty;
  data4[i].end = cumulative;

data4[i].class = ( +data4[i].valuetty >= 0 ) ? 'positive' : 'negative'

}; // Close for loop

data4.push({
  name: 'Total',
  end: cumulative,
  start: 0,
  class: 'total'
}); // Close data push function

console.log(data4)
console.log(cumulative)

// Get the domain of the data and scale it to the svg range
x4.domain(data4.map(function (d) { return d.name; }));
y4.domain([0, d3.max(data4, function(d) { return d.end; })]);

// Append x axis to the chart
chart4.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis4)
  .selectAll(".tick text")
  .call(wrap, x4.bandwidth());


// Append the y axis to the chart
chart4.append("g")
  .attr("class", "y axis")
  .call(yAxis4);

//
chart4.append("text")
  .attr("class", "title")
  .attr("x", width / 2)
  .attr("y", 0)
  .attr("dy", 0)
  .attr("text-anchor", "middle")
  .text("Contribution to GDP growth (tty)");

// Set up the bars
var bar = chart4.selectAll(".bar")
      .data(data4)
      .enter().append("g")
      .attr("class", function(d) { return "bar" + d.class })
      .attr("transform", function(d) { return "translate(" + x4(d.name) + ",0)"; });

// Add the bars to the chart
bar.append("rect")
.style("opacity", 0.2)
.attr("y", function(d) { return y4(Math.max(d.start, d.end) ); })
.attr("height", function(d) { return Math.abs(y4(d.start) - y4(d.end) ); })
.attr("width", x4.bandwidth());

// Add the labels
bar.append("text")
.attr("x", x4.bandwidth()/2 )
.attr("y", function(d) { return y4(d.end) ; })
.attr("dy", function(d) { return ((d.class=='negative') ? '-' : '') + "0.75em" })
.text(function(d) {return d.end - d.start ; });


bar.filter( function(d) { return d.class != "total"} ).append("line")
.attr("class", "connector")
.attr("x1", x4.bandwidth() + 5)
.attr("y1", function(d) { return y4(d.end) } )
.attr("x2", x4.bandwidth() / (-5) )
.attr("y2", function(d) { return y4(d.end) } )

}); //Close d3.csv
