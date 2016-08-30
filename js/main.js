var svg = dimple.newSvg("#chartContainer", 590, 500);

feature = "debt_mdn";
d3.json("/data/scorecard_data.json", function (data) {
  data = dimple.filterData(data.features, "school", ["avg"]);
  data = flatten_data(data, feature);
  console.log(data);

  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(60, 30, 505, 305);
  var x = myChart.addTimeAxis("x", "year");
  x.addOrderRule("year");
  var y = myChart.addCategoryAxis("y", feature);
  var s = myChart.addSeries(null, dimple.plot.line);

  myChart.draw();
});

// var data = [
//     {'Date': '01-03-2013', 'Views': 'a', 'Owner':'Alpha','Rating':'****'},
//     {'Date': '05-03-2013', 'Views': 'b', 'Owner':'Beta','Rating':'****'},
//     {'Date': '09-03-2013', 'Views': 'c', 'Owner':'Gamma','Rating':'**'},
//     {'Date': '13-03-2013', 'Views': 'd', 'Owner':'Beta','Rating':'****'},
//     {'Date': '01-04-2013', 'Views': 'a', 'Owner':'Theta','Rating':'****'},
//     {'Date': '05-04-2013', 'Views': 'b', 'Owner':'Beta','Rating':'***'},
//     {'Date': '09-04-2013', 'Views': 'c', 'Owner':'Theta','Rating':'**'},
//     {'Date': '13-04-2013', 'Views': 'd', 'Owner':'Beta','Rating':'*'},
// ];
//
// var myChart = new dimple.chart(svg, data);
// myChart.setBounds(70, 30, 420, 330);
// var x = myChart.addTimeAxis("x", "Date", "%d-%m-%Y", "%d-%m");
// x.showGridlines = true;
// x.addOrderRule("Date");
// var y = myChart.addCategoryAxis("y", "Views");
// var s = myChart.addSeries(["Owner","Rating"], dimple.plot.bubble);
// s.lineWeight = 4;
// s.lineMarkers = true;
// var myLegend = myChart.addLegend(530, 100, 60, 300, "Right");
// myChart.draw();

var flatten_data = function(data, feature) {
   flat_data = [];

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
