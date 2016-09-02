d3.json("data/scorecard_data.json", function(all_data) {
  var feature = "debt_mdn"; // Default feature
  var schools = ["National Average"];
  var all_schools = [];
  var myChart;

  /*
  * School searching.
  */
  for (var i = 0; i < all_data.features.length; i++) {
    all_schools.push(all_data.features[i].school);
  }

  $( function() {
    $( ".school-search" ).autocomplete({
      source: all_schools
    });
  } );

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

  // Data features to search on
  var lis = document.getElementsByClassName("feature-option");
  for (i = 0; i < lis.length; i++) {
    lis[i].onclick = change_feature;
  }

  /* ----------------------------------------------------------- */
  /* ---------------------School Selection--------------------- */
  /* ----------------------------------------------------------- */
  var delete_school = function() {
    var school_to_remove = this.parentElement;
    var school_name = school_to_remove.textContent;

    school_to_remove.parentElement.removeChild(school_to_remove);

    var index = schools.indexOf(school_name);
    schools.splice(index, 1);
    myChart.data = filter_data();
    myChart.draw(500);
  };

  var add_school = function() {
    if (schools.length > 6) {
      return;
    }

    var added_schools = document.getElementsByClassName("added-school");
    var search_value = document.getElementsByClassName("school-search")[0].value;

    // Checks to see if the school exists
    for (i = 0; i < all_schools.length; i++) {
      if (all_schools[i] === search_value) {
        break;
      }
    }
    if (i === all_schools.length) {
      return;
    }

    // See if school is already in the list
    for (i = 0; i < schools.length; i++) {
      if (schools[i] == search_value) {
        return;
      }
    }

    // Add school to the chart
    schools.push(search_value);
    myChart.data = filter_data();
    myChart.draw(500);

    // Add school to the list of schools shown
    var delete_button = document.createElement("button");
    delete_button.setAttribute("class", "btn btn-default remove-school-button");
    var minus_sign = document.createElement("span");
    minus_sign.setAttribute("class", "glyphicon glyphicon-minus");
    delete_button.appendChild(minus_sign);
    delete_button.onclick = delete_school;

    var new_school = document.createElement("ul");
    new_school.setAttribute("class", "list-group-item");
    new_school.innerHTML = search_value;
    new_school.appendChild(delete_button);

    document.getElementsByClassName("list-group")[0].appendChild(new_school);
    document.getElementsByClassName("school-search")[0].value = "";
  };

  document.getElementsByClassName("add-school-button")[0].onclick = add_school;
  $(".school-search").keyup(function(event){
    // Enter button hit
    if(event.keyCode == 13){
      add_school();
    }
  });

  /* ----------------------------------------------------------- */
  /* ----------------------Visualization------------------------ */
  /* ----------------------------------------------------------- */
  var svg = dimple.newSvg("#chartContainer", 880, 400);

  myChart = new dimple.chart(svg, filter_data());
  myChart.setBounds(60, 30, "100%,-300px", "100%,-100px");

  var x = myChart.addTimeAxis("x", "year", "%Y", "%Y");
  x.addOrderRule("year");

  var y = myChart.addMeasureAxis("y", feature);
  y.overrideMin = 0;

  var s = myChart.addSeries("school", dimple.plot.line);
  s.lineMarkers = true;

  myChart.addLegend(675, 100, 100, 75, "left", [s]);

  myChart.draw();

  myLegend.shapes.selectAll("rect").on("click", delete_school);
});
