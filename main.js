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

// Compute padding dimensions
var padding = {t: 60, r: 100, b: 60, l: 100};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

var EducationMap = ['None', 'High School', 'Associate\'s', 'Bachelor\'s', 'Master\'s', 'Doctorate', 'Other'];

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');


var barBand = chartWidth / 7;
var barWidth = barBand * 0.7;


function findmatch(key, json) {
  for (var i = 0; i < json.length; i++) {
    if (key === json[i].key) {
      return json[i].value;
    }
  }
  console.log('bug!');
  return "";   // The function returns the product of p1 and p2
}
  
d3.csv('dataset.CSV').then(function(dataset) {
  education = d3.nest()
    .key(d => d['MINIMUM_EDUCATION'])
    .rollup(d => d.length)
    .entries(dataset)
    .filter(d => d.key !== '');
  
  console.log(education);
  var orderedData = [];
  for (var i = 0; i < EducationMap.length; i++) {
    var obj = { 
      key: EducationMap[i],
      value: findmatch(EducationMap[i], education)
    };
    console.log()
    orderedData.push(obj);
  };
  console.log(orderedData);
  
  var maxDomain = d3.max(orderedData,d => d.value);

  scaleLinearBar = d3.scaleLinear()
    .domain([0, maxDomain]) 
    .range([0, chartHeight]);

  scaleLinearAxis = d3.scaleLinear()
    .domain([maxDomain, 0]) 
    .range([0, chartHeight]);
  
  scaleBand = d3.scaleBand()
    .domain(orderedData.map(d => d.key))
    .range([0, chartWidth]);
  
  leftAxis = d3.axisLeft(scaleLinearAxis)
    .scale(scaleLinearAxis);

  bottomAxis = d3.axisBottom(scaleBand)
    .scale(scaleBand);
  
  chartG.append('g')
    .attr('class', 'left grid')
    .call(leftAxis);

  let bargroup = chartG.append('g')
    .attr('class', 'bar-group')
    .attr('transform', 'translate(13, 0)');
  
  bargroup.selectAll('rect')
    .data(orderedData)
    .enter()
    .append("rect")
    .attr('transform', function (d, i) {
      var tx = i * barBand + 2.5;
      var ty = chartHeight - scaleLinearBar(d.value);
      return 'translate(' + tx + ', ' + ty + ')';
    })
    .attr("width", barWidth)
    .attr("height", d => scaleLinearBar(d.value))
    .attr("fill", "Indianred");

  chartG.append('g')
    .attr('class', 'bottom grid')
    .attr('transform', 'translate(0, ' + chartHeight + ')')
    .call(bottomAxis);
});