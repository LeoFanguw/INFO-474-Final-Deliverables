var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
var svg = d3.select('svg');
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');
// import color scale
var accent = d3.scaleOrdinal(d3.schemeBuGn);
const projection = d3.geoMercator().scale(140)
  .translate([svgWidth / 2, svgHeight / 1.4]);
const path = d3.geoPath(projection);

const g = svg.append('g');


var findvalue = function (country) {
  

  for (var i = 0; i < countrydata.length; i++) {
    if (country.toUpperCase() === countrydata[i].key.toUpperCase()) {
      return countrydata[i].value;
    }
  }
  return 0; // Dummy
}
d3.csv('ETA_9089.csv').then(function (dataset) {
  countrydata = d3.nest()
    .key(d => d['COUNTRY_OF_CITIZENSHIP'])
    .rollup(d => d.length)
    .entries(dataset);


  var color = d3.scaleSequential()
	  .domain([0, Math.log(d3.max(countrydata,d => d.value))]) //d3.max(countrydata,d => d.value)
	  .interpolator(d3.interpolateBlues);



  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(data => {

    const countries = topojson.feature(data, data.objects.countries);

    const g = svg.append('g')
      .attr('class', 'country');

    grouppath = g.selectAll('g')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('fill', 'green')
      .attr('stroke', 'white')
      .attr('class', 'country')
      .style('fill', function (d) {
        var value = findvalue(d.properties.name);
        return color(Math.log(value));
      })
      .attr('d', path)
      .append('title')
      .text(d => d.properties.name + ": " + findvalue(d.properties.name))
      .attr('fill', 'red');


    var legend = Legend(d3.scaleSequentialLog([1, 46196], d3.interpolateBlues), {
      title: "Number of Applicants",
      ticks: 7
    })

    const legend_group = svg.append('g')
      .attr('class', 'legend');
    console.log('What is this' + legend);
    legend_group.html(legend.outerHTML)
      .attr('transform', 'translate(20, 10)');
  });



});
// Copyright 2021, Observable Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/color-legend
function Legend(color, {
  title,
  tickSize = 6,
  width = 320,
  height = 50 + tickSize,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = 0,
  ticks = width / 64,
  tickFormat,
  tickValues
} = {}) {

  function ramp(color, n = 256) {
    const canvas = document.createElement("canvas");
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    for (let i = 0; i < n; ++i) {
      context.fillStyle = color(i / (n - 1));
      context.fillRect(i, 0, 1, 1);
    }
    return canvas;
  }

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("overflow", "visible")
    .style("display", "block");

  let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x;

  // Continuous
  if (color.interpolator) {
    x = Object.assign(color.copy()
      .interpolator(d3.interpolateRound(marginLeft, width - marginRight)), {
        range() {
          return [marginLeft, width - marginRight];
        }
      });

    svg.append("image")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", ramp(color.interpolator()).toDataURL());
  }


  var tick_scale = [0, 10, 100, 1000, 10000, 46196];
  svg.append("g")
    .attr('class', 'scale_group')
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x)
      .tickSize(tickSize)
      .tickValues(tick_scale)
      .tickFormat(function(d,i){ return tick_scale[i]; }))
    .call(tickAdjust)
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
      .attr("x", marginLeft)
      .attr("y", marginTop + marginBottom - height - 6)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .attr('font-size', '9pt')
      .attr("class", "title")
      .text(title));

  return svg.node();
} 