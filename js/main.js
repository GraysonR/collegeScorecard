var svg = dimple.newSvg("#chartContainer", 700, 400);

feature = "tuition_out";
d3.json("/data/scorecard_data.json", function (data) {
  data = dimple.filterData(data.features, "school", ["avg"]);
  data = flatten_data(data, feature);
  console.log(data);

  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(60, 30, "100%,-120px", "100%,-100px");

  var x = myChart.addTimeAxis("x", "year", "%Y", "%Y");
  x.addOrderRule("year");

  var y = myChart.addMeasureAxis("y", feature);
  y.overrideMin = 0;

  var s = myChart.addSeries(null, dimple.plot.line);
  s.lineMarkers = true;

  myChart.draw();
});

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

var format  = d3.time.format("%Y");
