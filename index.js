var button = document.getElementById("submit-button");
var text = document.getElementById("text-field");
var select = document.getElementById("select");
var stocks_list = []
var arr = [
  ['Stock', 'price', {
    role: "annotation"
  }]
];


button.addEventListener('click', async function(event) {
  event.preventDefault();

  if (!text.value) {
    return false;
  }
  if (text.value in stocks_list) {
    return false;
  }

  var symbol = text.value.toUpperCase();
  if (!stocks_list.includes(symbol)) {
    stocks_list.push(text.value);
    var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + symbol + '&interval=5min&apikey=DNC2S06DMLBYB9RS';
    var textnode = document.createTextNode(symbol);
    var node = document.createElement("li");
    node.appendChild(textnode);
     //to append the item
        select.appendChild(node);
        text.value = '';

    fetch(url)
      .then(resp => resp.json())
      .then(data => data['Time Series (5min)'][data["Meta Data"]["3. Last Refreshed"]]["4. close"])
      .then(function(data) {

        var price = parseFloat(data);
        arr.push([symbol, price, price]);
        google.charts.setOnLoadCallback(drawChart);

       
      });
  }

});

google.charts.load('current', {
  'packages': ['corechart', 'bar']
});

function drawChart() {



  var data = google.visualization.arrayToDataTable(arr);
  var view = new google.visualization.DataView(data);
  view.setColumns([0, 1,
    {
      calc: "stringify",
      sourceColumn: 1,
      type: "string",
      role: "annotation"
    }
  ]);

  var options = {
    title: "Stock Prices",
    width: 600,
    height: 400,
    bar: {
      groupWidth: "80%"
    },
    legend: {
      position: "none"
    },
  };

  var chart = new google.visualization.BarChart(document.getElementById('chart_div'));

  chart.draw(view, options);
}
