let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();

let data, gdpValues, heghtScale, xScale, xAxisScale, yAxisScale;

let width = 800;
let height = 600;
let padding = 50;

let svg = d3.select("svg");

function drawCanvas() {
  svg.attr("width", width);
  svg.attr("height", height);
}

function generateScales() {
  heghtScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(gdpValues, (item) => {
        return item[1];
      }),
    ])
    .range([0, height - 2 * padding]);
  xScale = d3
    .scaleLinear()
    .domain([0, gdpValues.length - 1])
    .range([padding, width - padding]);

  let dates = gdpValues.map((i) => {
    return new Date(i[0]);
  });

  xAxisScale = d3
    .scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([padding, width - padding]);

  yAxisScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(gdpValues, (i) => {
        return i[1];
      }),
    ])
    .range([height - padding, padding]);
}

function drawBar() {
  let barWidth = (width - 2 * padding) / gdpValues.length;

  let toolTip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("width", "auto")
    .style("height", "auto")
    .style("visibility", "hidden")
    .style("position", "relative");

  svg
    .selectAll("rect")
    .data(gdpValues)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", barWidth)
    .attr("data-date", (i) => {
      return i[0];
    })
    .attr("data-gdp", (i) => {
      return i[1];
    })
    .attr("height", (i) => {
      return heghtScale(i[1]);
    })
    .attr("x", (i, index) => {
      return xScale(index);
    })
    .attr("y", (i) => {
      return height - padding - heghtScale(i[1]);
    })
    .on("mouseover", (e, i) => {
      toolTip.text(i);
      toolTip.transition().style("visibility", "visible");
      document.querySelector("#tooltip").setAttribute("data-gdp", i[1]);
      document.querySelector("#tooltip").setAttribute("data-date", i[0]);
    })
    .on("mouseout", () => {
      toolTip.transition().style("visibility", "hidden");
    });
}
function generaeAxis() {
  let xAxis = d3.axisBottom(xAxisScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");

  let yAxis = d3.axisLeft(yAxisScale);

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)");
}

req.open("GET", url, true);
req.onload = () => {
  data = JSON.parse(req.responseText);
  gdpValues = data.data;
  drawCanvas();
  generateScales();
  generaeAxis();
  drawBar();
};
req.send();
