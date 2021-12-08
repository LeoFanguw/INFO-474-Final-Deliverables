var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

var svg = d3.select('svg');
var svgWidth = +svg.attr('viewBox').split(" ")[2];
var svgHeight = +svg.attr('viewBox').split(" ")[3];


// Compute padding dimensions
var padding = { t: 60, r: 120, b: 60, l: 120 };

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

var EducationMap = ['None', 'High School', 'Associate\'s', 'Bachelor\'s', 'Master\'s', 'Doctorate', 'Other'];

// Create a group element for appending chart elements
var chartG = svg.append('g')
  .attr('transform', 'translate(' + [padding.l, padding.t] + ')');


var barBand = chartWidth / 7;
var barWidth = barBand * 0.7;


function findmatch(key, json) {
  for (var i = 0; i < json.length; i++) {
    if (key === json[i].key) {
      return json[i].value;
    }
  }
  return "";   // dummy return;
}

d3.csv('ETA_9089.csv').then(function (dataset) {
  education = d3.nest()
    .key(d => d['MINIMUM_EDUCATION'])
    .rollup(d => d.length)
    .entries(dataset)
    .filter(d => d.key !== '');

  var orderedData = [];
  for (var i = 0; i < EducationMap.length; i++) {
    var obj = {
      key: EducationMap[i],
      value: findmatch(EducationMap[i], education)
    };
    orderedData.push(obj);
  };

  var maxDomain = d3.max(orderedData, d => d.value);

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

  leftAxisGroup = chartG.append('g')
    .attr('class', 'left grid')
    .style('stroke-width', '2px')
    .call(leftAxis);

  leftAxisGroup.selectAll('text')
    .style('fill', '#293241')
    .style('font-size', '10pt');

  let barbrella = chartG.append('g')
    .attr('class', 'bar-container')
    .selectAll('.bar-group')
    .data(orderedData);;

  let bargroup = barbrella.enter()
    .append('g')
    .attr('class', 'bar-group')
    .attr('transform', function (d, i) {
      var tx = i * barBand + 16;
      var ty = chartHeight - scaleLinearBar(d.value);
      return 'translate(' + tx + ', ' + ty + ')';
    });

  bargroup.append("rect")
    .attr("width", barWidth)
    .attr("height", d => scaleLinearBar(d.value))
    .attr("fill", "#ee6c4d");

  bargroup.append("text")
    .text(d => d.value)
    .style('text-anchor', 'middle')
    .attr('transform', 'translate(30, -5)')
    .style('font-size', '16px')
    .attr('class', 'bar-text-none')
    .style('fill', '#BB3311');

  bottomAxisGroup = chartG.append('g')
    .attr('class', 'bottom grid')
    .attr('transform', 'translate(0, ' + chartHeight + ')')
    .style('stroke-width', '2px')
    .call(bottomAxis);

  bottomAxisGroup.selectAll('text')
    .style('fill', '#293241')
    .style('font-size', '10pt');

  chartG.append('text')
    .text('Number of Applicants')
    .attr('class', 'y axis-label')
    .attr('transform', 'translate(-70, ' + (chartHeight / 2 + 50) + ') rotate(-90)');

  chartG.append('text')
    .text('Minimum Education')
    .attr('class', 'x axis-label')
    .attr('transform', 'translate(' + (chartWidth / 2 - 50) + ',' + (chartHeight + 50) + ')');

  chartG.append('text')
    .text('Minimum Education Requirement & ETA 9089 Applicants Distribution')
    .attr('class', 'x axis-label')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(' + (chartWidth / 2) + ', -30)')
    .style('font-size', '14pt');

  updateChart();
});

function updateChart() {
  d3.selectAll('.bar-group')
    .on("mouseover", function () {
      d3.select(this).select('rect')
        .attr("fill", "#BB3311");
      d3.select(this).select('text')
        .attr('class', 'bar-text-shown')
    })
    .on("mouseout", function (d, i) {
      d3.select(this).select('rect').attr("fill", '#ee6c4d');
      d3.select(this).select('text')
        .attr('class', 'bar-text-none');
    })
}