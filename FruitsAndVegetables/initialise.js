function initialise(data, svg) {    
  
  // Create the defailed nutrition box
  var nutrientchart = d3.select("#overview")
        .append("div")
        .attr("class", "food-overview")
        .attr("id", "foodOverview")
        .classed("hidden", true);
  
  // Create GDA fulfillment box
  var gda = d3.select("#gda");
  gda.append("div")
        .attr("class", "gda-header")
        .text("Nutritional Overview");
  gda.append("div")
      .attr("class", "gda");
  gda.append("div")
      .attr("class", "gda-nutrient gda-nutrient-container")
      .append("span")
      .attr("class", "gda-percentage")
      .text("% Daily Value");
  d3.select("#selected")
        .append("div")
        .attr("class", "gda-header")
        .text("Selected Food");
  
  // Add Slider
  d3.select('#gda-slider').call(
    d3.slider().min(8).max(1).step(1).value(1).orientation("vertical").on("slide", 
      function(evt, value) {
          mouseclick(Math.round(value - 1));
      }
    )
  );
  
  // Create the selection menu, defailed info box, GDA fulfillment box
  for (var i = 0; i < nutrients.length; i++) {
      
    // Create GDA Fulfillment sections
    switch(nutrients[i]){
        case "vitaminA":
        case "magnesium":
          var tempcont = gda.append("div")
            .attr("class", "gda-nutrient-container vitamin-container")
            .attr("id", nutrients[i] + "-container")
          var nutrientcontainer = tempcont.append("div")
        break;
        case "vitaminC":
        case "iron":
          var nutrientcontainer = d3
            .select("#"+nutrients[i-1] + "-container").append("div")
        break;
        default:
          var nutrientcontainer = gda.append("div")
            .attr("class", "gda-nutrient-container")
        break;
    }
    
    nutrientcontainer.attr("id", "gda-" + nutrients[i])
    nutrientcontainer.append("span")
      .text(nutrients[i].charAt(0).toUpperCase() + nutrients[i].slice(1).replace("C", " C").replace("A", " A"))
      .attr("class", "gda-nutrient")
    nutrientcontainer.append("span")
      .attr("class", "gda-amount")
      .text("0" + units[i]);
    nutrientcontainer.append("span")
      .attr("class", "gda-percentage")
      .text("0%");
  }
  

  // Fired when a menu box is selected
  function mouseclick(value) {
    var targetid = nutrients[value]
    if (targetid && targetid != selected_nutrient) {
      
      // Set all backgrounds to default
      d3.selectAll(".gda-nutrient")
        .style("color", "#000");

      // Set selected box to highlighted color
      d3.select("#gda-" + targetid+" .gda-nutrient")
        .transition()
        .duration(100)
        .style("color", "#FF3030");
      
      // Update the selection variable with the new id
      selected_nutrient = targetid;
      
      // Remove all displayed nodes and regenerate graph
      d3.selectAll(".force-scale-node").remove();
      getScale(data, svg, selected_nutrient);
    }
  }  
}
