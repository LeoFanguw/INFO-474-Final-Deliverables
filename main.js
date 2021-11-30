// popover settings
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

// color gradient settings
const colorGradient = new Gradient();

const pieData = [];

var svg = d3.select('svg');
d3.csv('dataset.CSV').then(function(dataset) {
  // console.log(dataset);
  let filteredStatus = dataset.filter(element => element.CASE_STATUS == "Denied");
  // console.log(filteredStatus);
  renderPie(filteredStatus);
});

function renderPie(d) {
  let filteredArray = d.map(element => element.FOREIGN_WORKER_BIRTH_COUNTRY);
  for (let item of filteredArray) {
    let dataIndex = pieData.findIndex(function (data) {
      return data.name == item;
    })
    if (dataIndex != -1) {
      pieData[dataIndex].value ++;
    } else {
      pieData.push({name: item, value: 1, color: "#0288D1"})
    }
  }

  const color1 = "#0288D1";
  const color2 = "#ffffff";
  colorGradient.setMidpoint(pieData.length);
  colorGradient.setGradient(color1, color2);
  let colorScheme = colorGradient.getArray();

  pieData.sort(function (a, b) {
    return b.value - a.value;
  });

  for (let i = 0; i < pieData.length; i++) {
    pieData[i].color = colorScheme[i];
  }
  bakeDonut(pieData);
}

function bakeDonut(d) {
  let activeSegment;
  // pie chart setting
  const data = d.sort( (a, b) => b['value'] - a['value']),
        viewWidth = 500,
        viewHeight = 200,
        svgWidth = viewHeight,
        svgHeight = viewHeight,
        thickness = 40,
        colorArray = data.map(k => k.color),
        el = d3.select('svg'),
        radius = Math.min(svgWidth, svgHeight) / 2,
        color = d3.scaleOrdinal()
          .range(colorArray);

  const max = d3.max(data, (maxData) => maxData.value );

  const svg = el.append('svg')
  .attr('viewBox', `0 0 ${viewWidth + thickness} ${viewHeight + thickness}`)
  .attr('class', 'pie')
  .attr('width', 1000)
  .attr('height', 500);

  const g = svg.append('g')
  .attr('transform', `translate( ${ (svgWidth / 2) + (thickness / 2) }, ${ (svgHeight / 2) + (thickness / 2)})`);

  const arc = d3.arc()
  .innerRadius(radius - thickness)
  .outerRadius(radius);

  const arcHover = d3.arc()
  .innerRadius(radius - ( thickness + 5 ))
  .outerRadius(radius + 8);

  const pie = d3.pie()
  .value(function(pieData) { return pieData.value; })
  .sort(null);


  const path = g.selectAll('path')
  .attr('class', 'data-path')
  .data(pie(data))
  .enter()
  .append('g')
  .attr('class', 'data-group')
  .each(function(pathData, i) {
    const group = d3.select(this)

    group.append('text')
      .text(`${pathData.data.value}`)
      .attr('class', 'data-text data-text__value')
      .attr('text-anchor', 'middle')

    group.append('text')
      .text(`${pathData.data.name}`)
      .attr('class', 'data-text data-text__name')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.5rem')

    // Set default active segment
    if (pathData.value === max) {
      const textVal = d3.select(this).select('.data-text__value')
      .classed('data-text--show', true);

      const textName = d3.select(this).select('.data-text__name')
      .classed('data-text--show', true);
    }

  })
  .append('path')
  .attr('d', arc)
  .attr('fill', (fillData, i) => color(fillData.data.name))
  .attr('class', 'data-path')
  .on('mouseover', function() {
    const _thisPath = this,
          parentNode = _thisPath.parentNode;

    if (_thisPath !== activeSegment) {

      activeSegment = _thisPath;

      const dataTexts = d3.selectAll('.data-text')
      .classed('data-text--show', false);

      const paths = d3.selectAll('.data-path')
      .transition()
      .duration(250)
      .attr('d', arc);

      d3.select(_thisPath)
        .transition()
        .duration(250)
        .attr('d', arcHover);

      const thisDataValue = d3.select(parentNode).select('.data-text__value')
      .classed('data-text--show', true);
      const thisDataText = d3.select(parentNode).select('.data-text__name')
      .classed('data-text--show', true);
    }


  })
  .each(function(v, i) {
    if (v.value === max) {
      const maxArc = d3.select(this)
      .attr('d', arcHover);
      activeSegment = this;
    }
    this._current = i;
  });

  // label setting
  // const legendRectSize = 10;
  // const legendSpacing = 5;

  // const legend = svg.selectAll('.legend')
  // .data(color.domain())
  // .enter()
  // .append('g')
  // .attr('class', 'legend')
  // .attr('transform', function(legendData, i) {
  //   const itemHeight =    legendRectSize + legendSpacing;
  //   const offset =        legendRectSize * color.domain().length;
  //   const horz =          svgWidth + 60;
  //   const vert =          (i * itemHeight) + legendRectSize + (svgHeight - offset) / 2;
  //   return `translate(${horz}, ${vert})`;
  // });

  // legend.append('circle')
  //   .attr('r', legendRectSize / 2)
  //   .style('fill', color);

  // legend.append('text')
  //   .attr('x', legendRectSize + legendSpacing)
  //   .attr('y', legendRectSize - legendSpacing)
  //   .attr('class', 'legend-text')
  //   .text( (legendData) => legendData )
}