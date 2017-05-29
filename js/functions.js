function draw_scatter() {
  // Setup data
  var dataset = [];  // Initialize empty array
  var numDataPoints = 15;  // Number of dummy data points
  var maxRange = Math.random() * 1000;  // Max range of new values
  for(var i=0; i<numDataPoints; i++) {
    var newNumber1 = Math.floor(Math.random() * maxRange);  // New random integer
    var newNumber2 = Math.floor(Math.random() * maxRange);  // New random integer
    dataset.push([newNumber1, newNumber2]);  // Add new number to array
  }

  // Setup settings for graphic
  var canvas_width = 500;
  var canvas_height = 300;
  var padding = 30;  // for chart edges

  // Create scale functions
  var xScale = d3.scale.linear()  // xScale is width of graphic
                .domain([0, d3.max(dataset, function(d) {
                    return d[0];  // input domain
                })])
                .range([padding, canvas_width - padding * 2]); // output range

  var yScale = d3.scale.linear()  // yScale is height of graphic
                .domain([0, d3.max(dataset, function(d) {
                    return d[1];  // input domain
                })])
                .range([canvas_height - padding, padding]);  // remember y starts on top going down so we flip

  // Define X axis
  var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(5);

  // Define Y axis
  var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(5);

  // Create SVG element
  var svg = d3.select("h2")  // This is where we put our vis
    .append("svg")
    .attr("width", canvas_width)
    .attr("height", canvas_height)

  // Create Circles
  svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")  // Add circle svg
    .attr("cx", function(d) {
        return xScale(d[0]);  // Circle's X
    })
    .attr("cy", function(d) {  // Circle's Y
        return yScale(d[1]);
    })
    .attr("r", 2);  // radius

  // Add to X axis
  svg.append("g")
    .attr("class", "x axis_scatter")
    .attr("transform", "translate(0," + (canvas_height - padding) +")")
    .call(xAxis);

  // Add to Y axis
  svg.append("g")
    .attr("class", "y axis_scatter")
    .attr("transform", "translate(" + padding +",0)")
    .call(yAxis);

  // On click, update with new data
  d3.select("h4")
    .on("click", function() {
        var numValues = dataset.length;  // Get original dataset's length
        var maxRange = Math.random() * 1000;  // Get max range of new values
        dataset = [];  // Initialize empty array
        for(var i=0; i<numValues; i++) {
            var newNumber1 = Math.floor(Math.random() * maxRange);  // Random int for x
            var newNumber2 = Math.floor(Math.random() * maxRange);  // Random int for y
            dataset.push([newNumber1, newNumber2]);  // Add new numbers to array
        }

        // Update scale domains
        xScale.domain([0, d3.max(dataset, function(d) {
            return d[0]; })]);
        yScale.domain([0, d3.max(dataset, function(d) {
            return d[1]; })]);

        // Update circles
        svg.selectAll("circle")
            .data(dataset)  // Update with new data
            .transition()  // Transition from old to new
            .duration(1000)  // Length of animation
            .each("start", function() {  // Start animation
                d3.select(this)  // 'this' means the current element
                    .attr("fill", "red")  // Change color
                    .attr("r", 5);  // Change size
            })
            .delay(function(d, i) {
                return i / dataset.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
            })
            //.ease("linear")  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
            .attr("cx", function(d) {
                return xScale(d[0]);  // Circle's X
            })
            .attr("cy", function(d) {
                return yScale(d[1]);  // Circle's Y
            })
            .each("end", function() {  // End animation
                d3.select(this)  // 'this' means the current element
                    .transition()
                    .duration(500)
                    .attr("fill", "black")  // Change color
                    .attr("r", 2);  // Change radius
            });

            // Update X Axis
            svg.select(".x.axis_scatter")
                .transition()
                .duration(1000)
                .call(xAxis);

            // Update Y Axis
            svg.select(".y.axis_scatter")
                .transition()
                .duration(100)
                .call(yAxis);
    });
}

function teken(id) {
var svg = d3.select(id),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data.csv", function(d) {
  d.frequency = +d.frequency;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("y", function(d) { return y(d.frequency); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.frequency); });
});
}