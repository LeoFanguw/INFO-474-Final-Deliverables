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

// d3.csv('dataset.CSV').then(function (dataset) {});


const projection = d3.geoMercator().scale(140)
    .translate([svgWidth / 2, svgHeight / 1.4]);
const path = d3.geoPath(projection);

const g = svg.append('g');

d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(data => {

  const countries = topojson.feature(data, data.objects.countries);

  const g = svg.append('g');


  g.selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('fill', 'green')
    .attr('stroke', 'white')
    .attr('class', 'country')
    .attr('d', path);
});