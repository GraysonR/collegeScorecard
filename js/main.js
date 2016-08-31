d3.json("/data/scorecard_data.json", function(all_data) {
  var feature = "debt_mdn"; // Default feature
  var schools = ["avg"];
  var all_schools = [];
  var myChart;

  // Get all school names for fast searching
  for (var i = 0; i < all_data.features.length; i++) {
    all_schools.push(all_data.features[i].school);
  }

  /*
  * Transforms tree like JSON into a flat JSON for D3 to process.
  */
  var flatten_data = function(data, feature) {
     var flat_data = [];

     for (var i in data) {
       for(var j in data[i].data) {
         if ((data[i].data[j].financial_data)[feature]) {
           new_line = {}; // flat JSON
           new_line.year = data[i].data[j].year;
           new_line.school = data[i].school;
           new_line[feature] = (data[i].data[j].financial_data)[feature];

           flat_data.push(new_line);
         }
       }
     }

     return flat_data;
  };

  /*
  * Filters out the schools selected then flattens that school data.
  */
  var filter_data = function() {
    var data = dimple.filterData(all_data.features, "school", schools);
    data = flatten_data(data, feature);

    return data;
  };

  /* ----------------------------------------------------------- */
  /* ---------------------Feature Selection--------------------- */
  /* ----------------------------------------------------------- */
  var caret_span = document.createElement('span');
  caret_span.setAttribute("class", "caret");

  var change_feature = function() {
    // Update button
    button = document.getElementsByClassName("dropdown-toggle")[0];
    button.textContent = this.childNodes[0].text + " ";
    button.appendChild(caret_span);
    feature = this.id;

    // Update graph
    myChart.data = filter_data();
    myChart.axes[1].measure = feature;
    myChart.draw(500);
  };

  var lis = document.getElementsByClassName("feature-option");
  for (i = 0; i < lis.length; i++) {
    lis[i].onclick = change_feature;
  }

  /* ----------------------------------------------------------- */
  /* ----------------------Visualization------------------------ */
  /* ----------------------------------------------------------- */
  var svg = dimple.newSvg("#chartContainer", 700, 400);

  myChart = new dimple.chart(svg, filter_data());
  myChart.setBounds(60, 30, "100%,-120px", "100%,-100px");

  var x = myChart.addTimeAxis("x", "year", "%Y", "%Y");
  x.addOrderRule("year");

  var y = myChart.addMeasureAxis("y", feature);
  y.overrideMin = 0;

  var s = myChart.addSeries(schools, dimple.plot.line);
  s.lineMarkers = true;

  myChart.draw();
});
