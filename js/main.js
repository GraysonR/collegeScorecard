$.getJSON("data/scorecard_data.json", function(json) {
  console.log(json);
});

var svg = dimple.newSvg("#chartContainer", 590, 400);
d3.json("/data/scorecard_data.json", function (data) {
  data = dimple.filterData(data, "School", ["avg"]);

  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(60, 30, 505, 305);

  var x = myChart.addCategoryAxis("x", "Year");
  x.addOrderRule("Year");

  myChart.addMeasureAxis("y", "debt_mdn");

  var s = myChart.addSeries(null, dimple.plot.line);

  myChart.draw();
});
