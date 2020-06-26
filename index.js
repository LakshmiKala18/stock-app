var button = document.getElementById("submit-button");
var text = document.getElementById("text-field");
var select = document.getElementById("select");
let stockMap = new Map()

button.addEventListener('click', async function(event) {
  event.preventDefault();

  if (!text.value) {
    alert("Stock symbol required!");
    return false;
  }
  clearInterval(setinterval);
  var symbol = text.value.toUpperCase();

  if (!stockMap.has(symbol)) {
    let price = await Promise.resolve(fetchStockData(symbol));

    if (price) {
      stockMap.set(symbol, parseFloat(price));
      var textnode = document.createTextNode(symbol);
      var node = document.createElement("li");
      node.appendChild(textnode);
      select.appendChild(node);
      text.value = '';
      google.charts.load('current', {
        'packages': ['corechart']
      });
      google.charts.setOnLoadCallback(drawChart);
    } else {
      alert("Enter a valid symbol or please try again");
    }
  } else {
    alert(symbol + " is already added!");
  }
  setinterval = setInterval(refresh, 5000);
});

function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'stockID');
  data.addColumn('number', 'price');

  stockMap.forEach(function(value, key, map) {
    data.addRow([key, value]);
  });

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
    height: 300,
    bar: {
      groupWidth: "90%"
    },
    legend: {
      position: "none"
    },
    hAxis: {
      minValue: 0,
      title: "Price"
    }
  };
  var chart = new google.visualization.BarChart(document.getElementById("chart_div"));
  chart.draw(view, options);
}

function fetchStockData(symbol) {
  var url = 'https://finnhub.io/api/v1/quote?symbol=' + symbol + '&token=brksgrnrh5r8d4o96dm0';
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return data.c;
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

function refresh() {
  var d = new Date();
  var dayOfWeek = d.getDay();
  var currentTimeInHours = d.getUTCHours();
  if ((dayOfWeek != 0 && dayOfWeek != 6) && (currentTimeInHours >= 13 && currentTimeInHours < 22)) {
    stockMap.forEach(function(value, key, map) {
      let price = fetchStockData(key);

      if (price) {
        stockMap.set(key, parseFloat(price));
         console.log(stockMap.get(key));
        google.charts.load('current', {
          'packages': ['corechart']
        });
        google.charts.setOnLoadCallback(drawChart);
      }
     
    });
    
  }
}

var setinterval = setInterval(refresh, 5000);
