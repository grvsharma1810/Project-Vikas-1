AreaChart = function(_parentElement,arr){
  this.parentElement = _parentElement;  
  this.data = arr;
  this.initVis();
};

AreaChart.prototype.initVis = function(){
  var vis = this;
  vis.margin = { left:50, right:20, top:50, bottom:20 };
  vis.height = 250 - vis.margin.top - vis.margin.bottom;
  vis.width = 300 - vis.margin.left - vis.margin.right;

  vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

  vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  vis.t = function() { return d3.transition().duration(1000); }
  vis.x = d3.scaleLinear().range([0, vis.width]);
  vis.y = d3.scaleLinear().range([vis.height, 0]);
  
  vis.area = d3.area()
    .x(function(d) { return vis.x(d.year); })
    .y0(vis.y(0))
    .y1(function(d) { return vis.y(d.value); });
  
  vis.yAxisCall = d3.axisLeft()
  vis.xAxisCall = d3.axisBottom()
      .ticks(3);
  vis.xAxis = vis.g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + vis.height +")");
  vis.yAxis = vis.g.append("g")
      .attr("class", "y axis");
  
  vis.wrangleData();    
}

AreaChart.prototype.wrangleData = function(){
  var vis = this;
  var date = $("select.date-select").children("option:selected").val();
  var area = $("select.var-select").children("option:selected").val();      
  vis.data = filter = filterData_area(date,area);        
  vis.updateVis();
}

AreaChart.prototype.updateVis = function(){
  var vis = this;
  a = d3.extent(vis.data, function(d) { return d.year; })
  a[0]=a[0]-1;
  vis.x.domain(a);
  vis.y.domain([0, d3.max(vis.data, function(d) { return d.value; })]);

  vis.g.append("path")
       .datum(vis.data)
       .attr("class", "area")
       .attr("d", vis.area)
       .attr("fill","lightsteelblue");

  vis.xAxisCall.scale(vis.x)
  vis.yAxisCall.scale(vis.y)
  vis.xAxis      
      .call(vis.xAxisCall);
 
  // add the Y Axis
  vis.yAxis
       .call(vis.yAxisCall);
}