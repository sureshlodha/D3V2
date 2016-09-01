//function creates food scale based on the nutrient scaleSelection
function getScale(data, svg, scaleSelection) {
    var width = parseInt(d3.select("#display").style("width"), 10),
        height = 500;
  
    var yHeight = 300;
    
    var margin = 
    {
		top: 20,
		bottom: 50,
		left: 40,
		right: 50
	};
    
    var radius = 20;
  
    var maxElement = d3.max(d3.values(data),function(i){
        return i.nutrients[scaleSelection];});
  
    var minElement = d3.min(d3.values(data),function(i){
        return i.nutrients[scaleSelection];});
    
    var scale = d3.scale.linear()
        .range([margin.left, width-margin.right])
        .domain([-maxElement/4,maxElement]);
  
    //scales for zooming the svg
    var y = d3.scale.linear()
        .domain([0, height])
        .range([height, 0]);
    var x = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);
        
    var exData = extractSelected();
    
    // Define Scales  
    var xAxis = d3.svg.axis().scale(scale).orient("bottom").tickPadding(5).tickFormat(
      function(d) { return d + units[nutrients.indexOf(scaleSelection)]; }
    );
    
    // Set scale value
    d3.select("#scale-value").text(scaleSelection.charAt(0).toUpperCase() + scaleSelection.slice(1));
  
    var randY = d3.random.normal(0, 50);
    var foci = [];
    
    for(i=0;i<exData.length;i++) {
        foci[i] = {x: d3.values(exData)[i].x, y: yHeight+randY()};
    }
    
    var force = d3.layout.force()
        .nodes(exData)
        .size([width/2,
               height-(margin.top+margin.bottom)])
        .gravity(.001)
        .charge(0)
        .start();
    
    // Remove old axis
    d3.select(".xaxis")
        .remove();
  
    // Generate x-axis
    svg.append("g")
      .attr("class", "xaxis")
        .attr("transform", "translate("+margin.left+"," + (height - 50) + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "end")
        .attr("font-size", "16px");
  
    // Create node element
    var nodes = svg.selectAll(".force-scale-node")
      .data(force.nodes())
      .enter()
      .append("g")
      .attr("class", "force-scale-node")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", addSelectedFood);
    
    // Add circle background to node
    nodes.append("circle")
      .attr("r", radius)
      .attr("class", "circle-node")
      .attr("fill", function(d, i) 
      {
          return colors[data[d.index].type];
      })
      .transition()
      .duration(1000)
      .attrTween("r", function(d) {
        var i = d3.interpolate(0, radius);
        return function(t) { return i(t); };
      });
  
    // Add image to node
    nodes.append("image")
      .attr("xlink:href", function (d){ return "images/" + data[d.index].food + ".png"; })
      .attr("class", "circle-node")
      .attr("width", 50)
      .attr("height", 50);
    
    force.on("tick", function(e)
    {   
        svg.selectAll(".circle-node")
            .each(cluster(10*e.alpha*e.alpha))
            .each(collide(0.5))
            .attr("x", function(d) { return +d.x - (radius * 4/3); })
            .attr("y", function(d) { return +d.y - (radius * 4/3); })
            .attr("cx", function(d) { return +d.x; })
            .attr("cy", function(d) { return +d.y; });
    });
    
    var zoom = d3.behavior.zoom()
        .x(scale)
        .scaleExtent([0.8, 16])
        .on("zoom", zoomed);

    svg.call(zoom);
    
    function zoomed() 
    {
        svg.select(".xaxis").call(xAxis);
        svg.selectAll("circle")
            .attr("transform", transform);
        force.resume();
    }

    function addSelectedFood(d)
    {
        handleSelectedFood(data, d.index);
        calculateGDA(data, d.index, true);
    };
  
    function mouseover(d)
    {
        var dd = d3.select(this)[0];
        d3.select(this)
            .select("circle")
            .transition()
            .duration(150)
            .attr("r", radius*1.3);
            
        getOverview(data,d.index);
    };
    
    function mouseout()
    {
        d3.select(this)
            .select("circle")
            .transition()
            .duration(150)
            .attr("r", radius);
        
        d3.select(".food-overview").classed("hidden", true);
    };
    
    function extractSelected()
    {
        var dd = [];
        var x = [];
        
        for (i=0;i<data.length;i++)
        {
            dd[i] = {x: data[i].nutrients[scaleSelection], y: yHeight};
        }
        return dd;
    }
    
    function transform(d) 
    {
        return "translate(" + x(d[0]) + "," + y(d[1]) + ")";
    }
    
    function cluster(alpha) 
    {
      return function(d) 
      {
        var cluster = foci[d.index];
        if (scale(cluster.x) == d.x) return;
        var x = d.x - scale(cluster.x),
            y = d.y - cluster.y,
            l = Math.sqrt(x * x + y * y),
            r = radius*1.2;
        if (l != r) 
        {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
        }
      };
    }
    
    function collide(alpha) 
    {
        var quadtree = d3.geom.quadtree(exData);
        return function(d) 
        {
            var r = 2*radius*1.2,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) 
            {
                if (quad.point && (quad.point !== d)) 
                {
                    var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = 2*radius*1.2;
                    if (l < r) 
                    {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }
}
