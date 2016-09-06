d3.json("data/scorecard_data.json", function(all_data) {
  var feature = "debt_mdn"; // Default feature
  var schools = ["National Average"];
  var all_schools = [];
  var myChart;

  /*
  * List to make school searching faster.
  */
  for (var i = 0; i < all_data.features.length; i++) {
    all_schools.push(all_data.features[i].school);
  }

  $( function() {
    $( ".school-search" ).autocomplete({
      source: all_schools
    });
  });

  /*
  * Data to show multiple financial values at the same time.
  */
  var average_data = function() {
    var avg_data = dimple.filterData(all_data.features, "school", ["National Average"]);
    var key_converter = {
              "tuition_in": "Tuition In-State",
              "tuition_out": "Tuition Out-Of-State",
              "mn_earn": "Average Earnings",
              "md_earn": "Median Earnings",
              "debt_mdn": "Average Debt"
            };
    var new_avg_data = [];

    for (var i in avg_data[0].data) {
      for (var j in avg_data[0].data[i].financial_data) {
        var new_entry = {};
        new_entry.year = avg_data[0].data[i].year;
        new_entry.Dollars = avg_data[0].data[i].financial_data[j];
        new_entry.type = key_converter[j];
        new_avg_data.push(new_entry);
      }
    }

    return new_avg_data;
  };

  /*
  * Transforms tree like JSON into a flat JSON for D3 to process.
  */
  var flatten_data = function(data, feature) {
     var flat_data = [];

     for (var i in data) {
       for(var j in data[i].data) {
         if ((data[i].data[j].financial_data)[feature]) {
           var new_line = {}; // flat JSON
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
  /* -----------------------Chart Selection--------------------- */
  /* ----------------------------------------------------------- */

  var chart_selector = function() {
    var buttons = document.getElementsByClassName("chart-type");

    // Activate National Average
    if (this === buttons[0]) {
      buttons[0].setAttribute("class", "col-md-2 btn btn-default chart-type active");
      buttons[1].setAttribute("class", "col-md-2 btn btn-default chart-type");

      document.getElementById("explantoryChart").style = "display: block";
      document.getElementById("exploratoryChart").style = "display: none";
    }
    if (this === buttons[1]) {
      buttons[0].setAttribute("class", "col-md-2 btn btn-default chart-type");
      buttons[1].setAttribute("class", "col-md-2 btn btn-default chart-type active");

      document.getElementById("explantoryChart").style = "display: none";
      document.getElementById("exploratoryChart").style = "display: block";
    }
  };

  var buttons = document.getElementsByClassName("chart-type");
  for (var button in buttons) {
    buttons[button].onclick = chart_selector;
  }





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


    var list_group = document.getElementsByClassName("list-group")[0];

    // All schools removed so have to recreate the ul
    if (!list_group) {
      var ul = document.createElement("ul");
      ul.setAttribute("class", "list-group");
      ul.appendChild(new_school);
      document.getElementsByClassName("feature-selector")[1].appendChild(ul);
    }
    else {
      list_group.appendChild(new_school);
    }

    document.getElementsByClassName("school-search")[0].value = "";
  };

  document.getElementsByClassName("add-school-button")[0].onclick = add_school;
  $(".school-search").keyup(function(event){
    // Enter button hit
    if(event.keyCode == 13){
      add_school();
    }
  });

  // Add delete button functionality to national average
  document.getElementsByClassName("list-group-item")[0].onclick = delete_school;

  /* ----------------------------------------------------------- */
  /* ----------------------Visualization------------------------ */
  /* ----------------------------------------------------------- */
  var explantoryexploratorySvg = dimple.newSvg("#explantoryChart", 920, 500);
  var explanatoryChart = new dimple.chart(explantoryexploratorySvg, average_data());
  explanatoryChart.setBounds(60, 30, "100%,-190px", "100%,-75px");
  var ex = explanatoryChart.addTimeAxis("x", "year", "%Y", "%Y");
  ex.addOrderRule("year");
  var ey = explanatoryChart.addMeasureAxis("y", "Dollars");
  ey.overrideMin = 0;
  var es = explanatoryChart.addSeries("type", dimple.plot.line);
  es.lineMarkers = true;
  explanatoryChart.addLegend(800, 150, 100, 75, "left", [es]);
  explanatoryChart.draw();

  var exploratorySvg = dimple.newSvg("#chartContainer", 880, 400);
  myChart = new dimple.chart(exploratorySvg, filter_data());
  myChart.setBounds(60, 30, "100%,-300px", "100%,-100px");
  var x = myChart.addTimeAxis("x", "year", "%Y", "%Y");
  x.addOrderRule("year");
  var y = myChart.addMeasureAxis("y", feature);
  y.overrideMin = 0;
  var s = myChart.addSeries("school", dimple.plot.line);
  s.lineMarkers = true;
  var format_year = d3.time.format("%Y");
  var format_value = function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  s.getTooltipText = function (e) {
                          return [
                              "School: " + e.aggField[0],
                              "Year: " + format_year(new Date(e.x)),
                              "Value: $" + format_value(e.yValueList[0])
                          ];
                      };
  myChart.addLegend(675, 100, 100, 75, "left", [s]);
  myChart.draw();
});
