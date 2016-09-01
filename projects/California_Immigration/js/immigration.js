// define margin
var margin = {top: 20, right: 40, bottom: 70, left:40},
    width = 500 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom,
    radius = Math.min(width,height) / 2;           // radius for pie chart

// define svg
var stack_svg = d3.select("#leftCol")
    .append("svg")
    .attr("class", "stack-svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.right + ")");

var pie_svg = d3.select("#rightCol")
    .append("svg")
    .attr("class", "pie-svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + (width+margin.left + margin.right)/2 + "," + (height+margin.top+margin.bottom)/2 + ")");

var slider_svg = d3.select("#bottomLeftCol")
    .append("svg")
    .attr("class", "stack-svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", 40)
    .append("g")
    .attr("transform","translate(" + 0 + "," + height + ")");
var start_year = '1850';

var parseDate = d3.time.format("%Y")
    .parse,
    formatPercent = d3.format(".0%");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0,0.4])
    .range([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var area = d3.svg.area()
    .x(function(d) { return x(d.year); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); })
 .interpolate('basis');

var stack = d3.layout.stack()
    .values(function(d) { return d.values; });

d3.csv("data/data.csv", function(error, data) {
  if (error) throw error;

 color.domain(d3.keys(data[0])
    .filter(function(key) {
        return key !== "year" && key !== "Percent Foreign" && key !== "Natives";
    }));

  data.forEach(function(d) {
    d.year = parseDate(d.year);
  });

  var browsers = stack(color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {year: d.year, y: d[name] / 100};
      })
    };
  }));

  x.domain(d3.extent(data, function(d) { return d.year; }));

  var browser = stack_svg.selectAll(".browser")
      .data(browsers)
    .enter().append("g")
      .attr("class", "browser");

  browser.append("path")
      .attr("class", "area")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d) { return color(d.name); });

    browser.append("text")
    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
    .attr("x", 38)
    .attr("y", 4)
    .text(function(d) { return d.name; });

  stack_svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  stack_svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
});


// draw pie chart 

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var description = start_year + " Immigration";
var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d[start_year] });

d3.csv("data/data2.csv", function(error, data) {
   if(error) console.log("Error: data2.csv not loaded");
    
   function tweenPie(b) {
        b.innerRadius = 0;
        var i = d3.interpolate({
            startAngle: 0,
            endAngle: 0
        }, b);
        return function(t) {
            return arc(i(t));
        };
    }
    
    var g = pie_svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");
    
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.region); })
        .transition()
        .ease("spring")
        .duration(1000)
        .attrTween("d", tweenPie);
    
    g.append('text')
    .attr("transform", "translate(0," + (height/2+10) + ")")
        .text(description)
        .attr("text-anchor", "middle");
});


