let caseStatus = "Denied";
let pieDataset = [];
let filteredStatus = [];

function toggle() {
  var element = document.getElementById("card-deck");
  element.classList.toggle("invisible");
}

function changeStatus(status) {
  filteredStatus = pieDataset.filter(element => element.CASE_STATUS == status);
  var element = document.getElementById(status);

  var btnEl = document.querySelectorAll('.status');
  for (var i = 0; i < btnEl.length; i++) {
      btnEl[i].classList.remove('active');
  }
  element.classList.add('active');

  d3.select("#canvas")
    .selectAll("svg")
    .remove()

  d3.selectAll("option")
    .remove()

  renderPie(filteredStatus, "#3F2CAF", "#e9446a", "#edc988", "#607D8B", "FOREIGN_WORKER_BIRTH_COUNTRY", 0);
  renderPie(filteredStatus, "#7400b8", "#5390d9", "#56cfe1", "#80ffdb", "FOREIGN_WORKER_EDUCATION", -230);
  renderPie(filteredStatus, "#f72585", "#560bad", "#BCF8EC", "#FF8A5B", "WORKSITE_CITY", -470);
}

function onSelectionChanged(id) {
  let select = d3.select(id).node();
  let selectedValue = select.options[select.selectedIndex].value;
  if (selectedValue != "---") {
    let filteredSelection = [];
    d3.select("#canvas")
      .selectAll("svg")
      .remove()

    if (id == "#countrySelector") {
      filteredSelection = filteredStatus.filter(element => element.FOREIGN_WORKER_BIRTH_COUNTRY == selectedValue);
      d3.select('#educationSelector')
        .selectAll("option")
        .remove()
      d3.select('#citySelector')
        .selectAll("option")
        .remove()
    } else if (id == "#educationSelector") {
      filteredSelection = filteredStatus.filter(element => element.FOREIGN_WORKER_EDUCATION == selectedValue);
      d3.select('#countrySelector')
        .selectAll("option")
        .remove()
      d3.select('#citySelector')
        .selectAll("option")
        .remove()
    } else {
      filteredSelection = filteredStatus.filter(element => element.WORKSITE_CITY == selectedValue);
      d3.select('#educationSelector')
        .selectAll("option")
        .remove()
      d3.select('#countrySelector')
        .selectAll("option")
        .remove()
    }

    renderPie(filteredSelection, "#3F2CAF", "#e9446a", "#edc988", "#607D8B", "FOREIGN_WORKER_BIRTH_COUNTRY", 0);
    renderPie(filteredSelection, "#7400b8", "#5390d9", "#56cfe1", "#80ffdb", "FOREIGN_WORKER_EDUCATION", -230);
    renderPie(filteredSelection, "#f72585", "#560bad", "#BCF8EC", "#FF8A5B", "WORKSITE_CITY", -470);
  }
}

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

  const titlename = [{ location: "40, 450", name: "BIRTH COUNTRY" }, { location: "350, 450", name: "EDUCATION LEVEL" }, { location: "700, 450", name: "WORKSITE CITY" }]

  var svg = d3.select('svg');
  d3.csv('dataset.CSV').then(function (dataset) {
    pieDataset = dataset
    filteredStatus = pieDataset.filter(element => element.CASE_STATUS == caseStatus);


    // pie color
    renderPie(filteredStatus, "#3F2CAF", "#e9446a", "#edc988", "#607D8B", "FOREIGN_WORKER_BIRTH_COUNTRY", 0);
    renderPie(filteredStatus, "#7400b8", "#5390d9", "#56cfe1", "#80ffdb", "FOREIGN_WORKER_EDUCATION", -230);
    renderPie(filteredStatus, "#f72585", "#560bad", "#BCF8EC", "#FF8A5B", "WORKSITE_CITY", -470);
    const titles = svg.selectAll(".title")
      .data(titlename)
      .enter()
      .append("text")
      .attr("transform", function (d) { return "translate(" + d.location + ")" })
      .attr("class", "title")
      .text(function (d) { return d.name })

    const notice = svg.append("text")
      .text("Notice: to avoid the outliner, value below 30 is erased")
      .attr("transform", "translate(300, 530)")
      .attr("class", "notice")
  });



  function renderPie(d, color1, color2, color3, color4, condition, position) {
    let pieData = [];
    let filteredArray = d.map(element => element[condition]);
    for (let item of filteredArray) {
      let dataIndex = pieData.findIndex(function (data) {
        return data.name == item;
      })
      if (dataIndex != -1) {
        pieData[dataIndex].value++;
      } else if (item != "") {
        pieData.push({ name: item, value: 1, color: "#0288D1" })
      }
    }

    pieData.sort(function (a, b) {
      return b.value - a.value;
    });

    pieData = pieData.slice(0, 20);

    colorGradient.setMidpoint(pieData.length);
    colorGradient.setGradient(color1, color2, color3, color4);
    let colorScheme = colorGradient.getArray();

    for (let i = 0; i < pieData.length; i++) {
      pieData[i].color = colorScheme[i];
    }

    let optionsName = pieData.map(element => element.name);
    optionsName.unshift("---")
    if (condition == "FOREIGN_WORKER_BIRTH_COUNTRY") {
      d3.select("#countrySelector")
        .selectAll("option")
        .data(optionsName)
        .enter()
        .append("option")
        .attr("value", function (d) { return d })
        .text(function (d) { return d });
    } else if (condition == "FOREIGN_WORKER_EDUCATION") {
      d3.select("#educationSelector")
        .selectAll("option")
        .data(optionsName)
        .enter()
        .append("option")
        .attr("value", function (d) { return d })
        .text(function (d) { return d });
    } else {
      d3.select("#citySelector")
        .selectAll("option")
        .data(optionsName)
        .enter()
        .append("option")
        .attr("value", function (d) { return d })
        .text(function (d) { return d });
    }

    bakeDonut(pieData, position);
  }

  function bakeDonut(d, position) {
    let activeSegment;
    // pie chart setting
    const data = d.sort((a, b) => b['value'] - a['value']),
      viewWidth = 680,
      viewHeight = 200,
      svgWidth = viewHeight,
      svgHeight = viewHeight,
      thickness = 40,
      colorArray = data.map(k => k.color),
      el = d3.select('svg'),
      radius = Math.min(svgWidth, svgHeight) / 2,
      color = d3.scaleOrdinal()
        .range(colorArray);

    const max = d3.max(data, (maxData) => maxData.value);

    const svg = el.append('svg')
      .attr('viewBox', position + ` 30 ${viewWidth + thickness} ${viewHeight + thickness}`)
      .attr('class', 'pie')
      .attr('width', 1000)
      .attr('height', 500);

    const g = svg.append('g')
      .attr('transform', `translate(${(svgWidth / 2) + (thickness / 2)}, ${(svgHeight / 2) + (thickness / 2)})`)
      .attr('class', "position" + position);

    const arc = d3.arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius);

    const arcHover = d3.arc()
      .innerRadius(radius - (thickness + 5))
      .outerRadius(radius + 8);

    const pie = d3.pie()
      .value(function (pieData) { return pieData.value; })
      .sort(null);


    const path = g.selectAll('path')
      .attr('class', 'data-path')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'data-group')
      .each(function (pathData, i) {
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
      .on('mouseover', function () {
        const _thisPath = this,
          parentNode = _thisPath.parentNode;

        if (_thisPath !== activeSegment) {

          activeSegment = _thisPath;

          const dataTexts = d3.selectAll(".position" + position)
            .selectAll('.data-text')
            .classed('data-text--show', false);

          const paths = d3.selectAll(".position" + position).selectAll('.data-path')
            .transition()
            .duration(200)
            .attr('d', arc);

          d3.select(_thisPath)
            .transition()
            .duration(200)
            .attr('d', arcHover);

          const thisDataValue = d3.select(parentNode).select('.data-text__value')
            .classed('data-text--show', true);
          const thisDataText = d3.select(parentNode).select('.data-text__name')
            .classed('data-text--show', true);
        }


      })
      .each(function (v, i) {
        if (v.value === max) {
          const maxArc = d3.select(this)
            .attr('d', arcHover);
          activeSegment = this;
        }
        this._current = i;
      });
  }