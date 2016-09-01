function getDominantNutrients(data, foodIndex){

    // Initialise the nutrient data variables
    var nutrientdata = data[foodIndex].nutrients;
    var nutrientkeys = d3.keys(nutrientdata);
  
    // Populate the detailed nutrition box with values
    for (var i = -1; i < nutrients.length; i++) {
      d3.select("#" + (i == -1 ? "main" : nutrientkeys[i]) + "-nutrient-item")
          .html(function() 
          {
              if (i == -1) return ("Main Nutrients: " + data[foodIndex].food + "");
              else return (nutrientkeys[i] + "<span class=\"nutrient-amount\">" + nutrientdata[ nutrientkeys[i] ] + units[i] + "</span>")
          });
          
      var xPos = d3.event.pageX;
      var yPos = d3.event.pageY;
      d3.select(".dominant-nutrients")
          .style("left", xPos + "px")
          .style("top", yPos + "px")
      
      d3.select(".dominant-nutrients").classed("hidden", false);
    }
}
