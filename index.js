var button = document.getElementById("submit-button");
var text   = document.getElementById("text-field");
var select = document.getElementById("select");
var arr=[['Stock', 'price', {role: "annotation"}]];
 var price=100;
      
button.addEventListener('click', function (event) {
  event.preventDefault();
  
  if (!text.value) {
    return false;
  }
  
  var textnode = document.createTextNode(text.value);
  var node = document.createElement("li");
 
  price+=100;
  node.appendChild(textnode);
  arr.push([text.value, price, price]);
  google.charts.setOnLoadCallback(drawChart);

  //to append the item
  select.appendChild(node);
  text.value = '';
  
  return false;
});

google.charts.load('current', {'packages':['corechart','bar']});
     
      function drawChart() {

 
        var data = google.visualization.arrayToDataTable(arr);
        var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" }]);

 var options = {
        title: "Stock Prices",
        width: 600,
        height: 400,
        bar: {groupWidth: "80%"},
        legend: { position: "none" },
      };

        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));

        chart.draw(view, options);
      }
      
     