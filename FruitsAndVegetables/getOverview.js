function getOverview(data, foodIndex)
{
    var serving = data[foodIndex]["cup-weight"];
    var food = titleCase(data[foodIndex].food.replace("-", " "));

  d3.select("#foodOverview")
        .html("<span class=\"food-overview-food\">"
            + food + "</span><br>"
            + selected_nutrient.charAt(0).toUpperCase() + selected_nutrient.slice(1).replace("C", " C").replace("A", " A") +":&nbsp;" + data[foodIndex].nutrients[selected_nutrient] + units[nutrients.indexOf(selected_nutrient)] + "<br />"
            + "Cup Weight:&nbsp;"
            + "<span class=\"food-overview-serving\">"
            + serving + "g</span>");
        
    var xPos = d3.event.pageX;
    var yPos = d3.event.pageY;
    d3.select(".food-overview")
        .style("left", xPos + "px")
        .style("top", yPos + "px")    
    
    d3.select(".food-overview").classed("hidden", false);
}
