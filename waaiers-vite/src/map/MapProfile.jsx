import Chart from "react-apexcharts";
import IntrestSegmentStars from "../segments of intrest/IntrestSegmentStars";

const MulticolorAreaChart = ({ data, extractColor,pointData,setSelectedDatapoint }) => {
    
  //Set up vars that are used to display the axis
  const kmEnd = Math.round(data[data.length-1].x/1000)*1000
  let maxElevation = 0;
  pointData.forEach((item)=>{if(item[2] > maxElevation) maxElevation=item[2]})
    
  const dataSets = [];
  
  let previousColor = null;
  for (const element of data.sort((a, b) => a.x - b.x)) {
    const color = extractColor(element);

    let dataSet;
    if (dataSets.length === 0 || previousColor !== color) {
      const previousDataSet =
        dataSets.length !== 0 ? dataSets[dataSets.length - 1] : null;
      dataSet = {
        windir: element.classification,
        color: color,
        difficulty:element.difficulty,
        name: element.name,
        // copy ending point from previous dataset
        data:
          previousDataSet === null
            ? []
            : [previousDataSet.data[previousDataSet.data.length - 1]]
      };
      dataSets.push(dataSet);
    } else {
      dataSet = dataSets[dataSets.length - 1];
    }

    // add point
    dataSet.data.push([element.x, element.y]);

    // update previous element's color
    previousColor = color;
  }


  
  const options = {
    chart: {
      type: "area",
      toolbar: {
        show: false
      },
      animations: {
        enabled: false
      },
      zoom: {
          enabled:false
        },
      events: {
          mouseMove: function(event, chartContext, config) {
            //We want to get the coresponsing point to the route profile and dispaly it on the map

            //To render multiple colors on graph the data is broken into multiple series.
            //Hence we need to add the datapoints of prior series to each new one
            const seriesIndex = config.seriesIndex;
            let seriesOffset = 0;
            dataSets.forEach((item,index)=>{ if (index < seriesIndex) {seriesOffset += item.data.length}})
          
            //Store the points
            setSelectedDatapoint([pointData[config.dataPointIndex+seriesOffset][0],pointData[config.dataPointIndex+seriesOffset][1]])
          
          }}
    },
    
    tooltip: {
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        
          return '<div class="arrow_box">' +
            '<h4>' + dataSets[seriesIndex].name + '</h4>' + 
            '<p>' + (dataSets[seriesIndex].windir == undefined ? 'No' : dataSets[seriesIndex].windir.charAt(0).toUpperCase() + dataSets[seriesIndex].windir.slice(1)) + ' Wind' + '</p>' +
             '<IntrestSegmentStars difficulty={1}/>'+
            '</div>'
        },
        
   
      
      
    },
    
    
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      curve: "smooth",
      colors: ["silver"],
      width: 2
    },
    fill: {
      colors: [(series) => dataSets[series.seriesIndex]?.color || "black"],
      type: "gradient",
      gradient: {
        stops: [100]
      }
    },
    xaxis: {
      
      type: "numeric",
      min: 0,
      max:kmEnd,
      labels: {
        formatter: (val) => {if (val == kmEnd) {return kmEnd/1000 +'km'} else  return Math.ceil(val/20000)*20 + 'km'}
      },
      tooltip: {
          enabled: false
      }
    
      
    },
    yaxis: {
      min: 0,
      tickAmount:4,
      max:Math.ceil(maxElevation/200)*200,
      labels: {
        formatter: (val) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      },
      axisBorder: {
        show: true
      },
      
    }
  };

  return <Chart type="area" height="240"  options={options} series={dataSets} />;
};


const MapProfile = (props) => {

  //The segment data must be taken and destructured into point data to make the stage profile
  
  const segmentData = props.pointData;

  //Point data is retrieved
  let pointData = [];
  segmentData.forEach((segment,id)=>pointData.push(...segment.latlon.map(((point)=>[...point,segmentData[id].classification,segmentData[id].segmentDifficulty, (segmentData[id].kmStart/1000).toFixed(1) + ' - ' + (segmentData[id].kmEnd/1000).toFixed(1) +'km']))))
 
 
  //Then is is formatted for the graph
  //On the x adxis is the distance y is elevation
  const profileData = pointData.map((item)=> ({x:item[3],y:item[2],classification: item[5],difficulty: item[6], name: item[7]}))
  
  //We next want to destructure this data to create a stage profile
  

    return (
      <MulticolorAreaChart
        data={profileData}
        extractColor={(element) => {
          switch (element.classification) {
            case "cross":
              return "red";
            case "head":
              return "blue";
            case "tail":
              return "green";
            default:
              return "grey";
          }
        }}
        pointData={pointData}
        setSelectedDatapoint={props.setSelectedDatapoint}
      />
    );
}

export default MapProfile