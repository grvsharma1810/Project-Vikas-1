var lineChart1,
    lineChart2,
    lineChart3,
    lineChart4,
    lineChart5,
    pieChart1;
var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");
var alldata;
var filter;

//Setters
function setdata(data){
    alldata=data;
}
function setfilter(data){
    filter=data;
}


d3.json("/public/data/User.json",function(d){
    return{
        requirement : +d.requirement,       
        received : +d.received,
        onionSP : +d.onionSP,
        date : +d.date
    }    
})
.then(function(data){
    // Prepare and clean data    
    //alldata = data;    
    setdata(data)
    var date = 2017
    var area = "area1"
    //var filterdBydate = filterData_area(date,area); 
    createCharts();
    // alldata = data.map(d=>{
    //     d.requirement = +d.requirement;        
    //     d.received = +d.received;
    //     d.onionSP = +d.onionSP;
    //     d.date = parseTime(d.date);    
    // })        
})
.catch(function(error){console.log("Error is : " + error)})

function filterData_area(date,area){        
    var areabyyear = d3.nest()
    .key(function(d) { return d.address; })
    .key(function(d) { return d.date; })
    .rollup(function(v) { return d3.sum(v, function(d) { return d.requirement; }); })
    .object(alldata);
    //console.log(areabyyear[area]);
    var ob = areabyyear[area];
    var arr = []
        alldata.forEach(function(d){
            var obj = {
                "year" : d.date,
                "value" : ob[d.date]
            }
            flag = 1
            arr.forEach(d=>{
                if(d["year"]==obj["year"]){
                    flag = 0;
                }
            })
            if(flag){
                arr.push(obj);
            }
        })
        return arr;
}
// Add jQuery UI slider
$(document).ready(function(){
    $("select.date-select").change(function(){
        var date = $("select.date-select").children("option:selected").val();
        var area = $("select.var-select").children("option:selected").val();
        //alert("You have selected the country - " + selectedCountry);
        //filterData_area(date,area);
    });
});

$(document).ready(function(){
    $("select.var-select").change(function(){        
        //console.log(arr[0].year);        
        areaChart1.wrangleData();
        
    });
});

function createCharts(){    
    areaChart1 = new AreaChart("#chart-area1");
}
// lineChart1 = new LineChart("#chart-area1", "bitcoin");
// lineChart2 = new LineChart("#chart-area2", "ethereum");
// lineChart3 = new LineChart("#chart-area3", "bitcoin_cash");
// lineChart4 = new LineChart("#chart-area4", "litecoin");
// lineChart5 = new LineChart("#chart-area5", "ripple");
// pieChart1 = new PieChart("#chart-area6");



// function updateCharts(){
//     lineChart1.wrangleData()
//     lineChart2.wrangleData()
//     lineChart3.wrangleData()
//     lineChart4.wrangleData()
//     lineChart5.wrangleData()
// }