function calculateGDA(data, index, insert) {
  
  // Initialise the nutrient data variables
  var nutrientdata = data[index].nutrients;
  var nutrientkeys = nutrients;
  
  for (var i = 0; i < nutrients.length; i++) {

    if (nutrientdata[nutrientkeys[i]] != null){
      var elem = d3.select("#gda-" + nutrientkeys[i]);
      
      // Update GDA Percentage and Amount
      var gdapercent = elem.select(".gda-percentage");
      var newpc = +gdapercent.attr("value") + ((insert ? 1 : -1)
                        * Math.round((nutrientdata[nutrientkeys[i]] / gda[i]) * 100));
      gdapercent.text(newpc + "%");
      gdapercent.attr("value", newpc);
      
      var gdaamount = elem.select(".gda-amount");
      var newam = +(+gdaamount.attr("value") + ((insert ? 1 : -1) * nutrientdata[nutrientkeys[i]])).toFixed(2);;
      gdaamount.text(newam + units[i]);
      gdaamount.attr("value", newam);
      
      
      elem.style("background-image", "linear-gradient(left, #77DD77, #77DD77 "+newpc+"%, transparent "+newpc+"%, transparent 100%")
          .style("background-image", "-webkit-linear-gradient(left, #77DD77, #77DD77 "+newpc+"%, transparent "+newpc+"%, transparent 100%");
    }
  }
}
