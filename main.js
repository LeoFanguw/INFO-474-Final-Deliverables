// Global function called when select element is changed
var category = "all-letters";

function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    updateChart();
}

// recall that when data is loaded into memory, numbers are loaded as strings
// this function helps convert numbers into string during data preprocessing
function dataPreprocessor(row) {
    return {
        letter: row.letter,
        frequency: +row.frequency
    };
}

var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 60, r: 40, b: 30, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Compute the spacing for bar bands based on all 26 letters
var barBand = chartHeight / 26;
var barHeight = barBand * 0.7;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// A map with arrays for each category of letter sets
var lettersMap = {
    'all-letters': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    'only-consonants': 'BCDFGHJKLMNPQRSTVWXZ'.split(''),
    'only-vowels': 'AEIOUY'.split('')
};

var letters = [];
var xScale = d3.scaleLinear()
               .domain([0 , 12.702])
               .range([0, chartWidth]);

var slider =d3.select("#main")
              .append("div")
              .attr("class", "slider")

slider.append("input")
      .attr("id", "sliderSelect")
      .attr("data-provide", "slider")
      .attr("data-slider-min", "0")
      .attr("data-slider-max", "12.71")
      .attr("data-slider-range", "true")
      .attr("data-slider-step", "0.01")
      .attr("data-slider-value", "[0, 12.71]")
      .attr("onchange", "onFrequencyChanged()")

var currentFrequency = [0, 12.71]

function onFrequencyChanged() {
    var mySlider = $("#sliderSelect").slider();
    currentFrequency = mySlider.slider('getValue');
    updateChart();
}

d3.csv('letter_freq.csv', dataPreprocessor).then(function(dataset) {
    // Create global variables here and intialize the chart
    letters = dataset;

    chartG.append("g")
          .attr('class', 'x axis')
          .call(d3.axisTop(xScale).tickFormat(d => d + "%").ticks(6));

    chartG.append("text")
          .attr("class", "x axis-label")
          .attr("transform", 'translate(' + chartWidth / 2+ ',' + "-30" + ')')
          .text("Letter Frequency(%)")

    chartG.append("g")
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + chartHeight + ')')
          .call(d3.axisBottom(xScale).tickFormat(d => d + "%").ticks(6));
    
    // **** Your JavaScript code goes here ****

    // Update the chart for all letters to initialize
    category = "all-letters";
    updateChart();
});


function updateChart() {
    // Create a filtered array of letters based on the filterKey
    var filteredLetters = letters.filter(function(d){
        return lettersMap[category].indexOf(d.letter) >= 0;
    });

    var filteredData = filteredLetters.filter(function(d) {
        return (d.frequency * 100 >= currentFrequency[0] && d.frequency * 100 <= currentFrequency[1])
    })

    console.log(filteredData);
    // **** Draw and Update your chart here ****
    var bars = chartG.selectAll(".bar")
                     .data(filteredData, function(d) {return d.letter;});
    
    var barEnter = bars.enter()
                       .append("g")
                       .attr("class", "bar");
    
    barEnter.merge(bars)
            .attr('transform', function(d,i) {
                return 'translate('+[0, 4 + i * barBand]+')';
            });

    barEnter.append("rect")
            .attr("width", d => d.frequency * 1/0.12702 * chartWidth)
            .attr("height", barHeight);

    barEnter.append("text")
            .attr("x", -20)
            .attr("dy", "0.93em")
            .text(d => d.letter);

    bars.exit().remove();
}


// Remember code outside of the data callback function will run before the data loads