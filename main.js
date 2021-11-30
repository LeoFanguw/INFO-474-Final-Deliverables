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
      console.log(countrydata[i].value);
      return countrydata[i].value;
    }
  }
  return 0; // Dummy
}


d3.csv('dataset.CSV').then(function (dataset) {

  countrydata = d3.nest()
    .key(d => d['COUNTRY_OF_CITIZENSHIP'])
    .rollup(d => d.length)
    .entries(dataset);

  console.log(d3.schemeBuGn);

  var color = d3.scaleSequential()
	  .domain([0, Math.log(d3.max(countrydata,d => d.value))]) //d3.max(countrydata,d => d.value)
	  .interpolator(d3.interpolateBlues);

  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(data => {

    const countries = topojson.feature(data, data.objects.countries);

    const g = svg.append('g');

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
  });



});



