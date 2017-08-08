function draw_barchart (div) {

  var margin = { top: 80, right: 10, bottom: 150, left: 100},
    width = 750 - margin.right - margin.left,
    height = 550 - margin.top - margin.bottom;

  var svg = d3.select(div)
    .append('svg')
    .attr("id", "bar_svg")
    .attr({
      "width" : width + margin.right + margin.left,
      "height" : height + margin.top + margin.bottom
    })
    .append('g')
      .attr("transform", "translate(" + margin.left + ',' + margin.top + ')');

  //define the x y scales
  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.2, 0.2);

  var y = d3.scale.linear()
    .range([height, 0]);

  //define axis
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  //maakt text voor pop up tip
  var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>Hours of rain:</strong> <span style='color:red'>" + d.Duur + "</span>";
        })

  svg.call(tip);

  d3.json("../data/duur_neerslag.json", function(error, data) {
    if(error) console.log("Error: data not landed.");

    // maak int van string
    data.forEach(function(d) {
      d.Duur = +d.Duur;
      d.Month = d.Month;
    });

    // specify domains of x and y scales
    x.domain(data.map(function(d) { return d.Month; }) );
    y.domain([0, d3.max(data, function(d) { return d.Duur}) ] );

    // drawing bars
    svg.selectAll('bar')
      .data(data)
      .enter()
      .append('rect')
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Month); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Duur); })
      .attr("height", function(d) { return height - y(d.Duur); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    // draw x axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll('text')
      .attr("transform", "rotate(-60)")
      .attr("dx", "-.8em")
      .attr("dy", "-.25em")
      .style("text-anchor", "end")
      .style("font-size", "15px");

    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 110)
      .text("Months of the year 2015-2016")
      .style("font-weight", "normal")
      .style("font-size", '18px');

    // draw y axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Hours of rain per month")
      .style("font-weight", "normal")
      .style("font-size", '18px');

    // making the title
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", -(margin.top - 25))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
      .text("Hours of rain per Month in the year 2015 to 2016 in 'de Bilt'");

    // sources
    svg.append("text")
    .attr("x", -60)
    .attr("y", height + margin.top + 50)
      .style("font-size", "14px")
    .html('<a target="_blank" href="http://projects.knmi.nl/klimatologie/uurgegevens/selectie.cgi">Source: KNMI</a>');
  });

}

draw_barchart("#bar_chart_example");