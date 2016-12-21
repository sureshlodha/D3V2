function handleSelectedFood(data, index){
  var selection = data[index];

  if (!selected_foods[index]) {
    selected_foods[index] = 1;
    var element = d3.select("#selected")
      .append("div")
      .attr("id", "selected-"+selection.food)
      .attr("value", 1)
      .attr("class", "selected-food-item")
      .html("<img src=\"images/"+selection.food+".png\" style=\"img-"+selection.type+"\" />"+titleCase(selection.food.replace("-", " ")));

    element.append("div")
      .attr("id", "selected-serving-control")
      .attr("class", "selected-food-control");

    element.select("#selected-serving-control")
      .append("div")
      .attr("id", "plus")
      .attr("class", "selected-plusminus")
      .text("+")
      .on("click", function()
      {
          selected_foods[index] += 1;
          element.attr("value", selected_foods[index])
              .select("#amount")
              .text(selected_foods[index] + " Cups");

          calculateGDA(data, index, true);
      });

    element.select("#selected-serving-control")
      .append("div")
      .attr("id", "minus")
      .attr("class", "selected-plusminus")
      .text("-")
      .on("click", function()
      {
          selected_foods[index] -= 1;
          element
              .attr("value", selected_foods[index])
              .select("#amount")
              .text(selected_foods[index] + " Cup" + (selected_foods[index] == 1 ? "" : "s"));

          if (element.attr("value") == "0")
          {
              element.remove();
              element = null;
              selected_foods[index] = null;
          }

          calculateGDA(data, index, false);
      });

    element
      .append("span")
      .attr("id", "amount")
      .attr("class", "selected-food-serving")
      .text(selected_foods[index] + " Cup");
    
  } else {
    
    selected_foods[index] += 1;
    
    var element = d3.select("#selected-"+selection.food);
    element.attr("value", selected_foods[index])
      .select("#amount")
      .text(selected_foods[index] + " Cups");
    
  }
}

function titleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}