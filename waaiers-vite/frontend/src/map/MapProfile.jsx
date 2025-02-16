import Chart from "react-apexcharts";

import { renderToString } from 'react-dom/server';
import MapProfileToolTip from "./MapProfileToolTip";


const MapProfile = ({ segments, routeData }) => {
  const distanceEnd = routeData.distance
  console.log(distanceEnd)
  let maxElevation = 2000;
  let seriesData = []
  segments.forEach(segment => {
    const segmentLength = segment.distanceEnd - segment.distanceStart
    const segmentPoints = []
    segment.points.forEach((point, i) => {
      segmentPoints.push({
        x: segment.distanceStart + segmentLength * (i/segment.points.length), 
        y: point.elevation
      })
    })
    seriesData.push({
      data: segmentPoints
    })
  })
  console.log(segments)

  
  




  
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
      // events: {
      //     mouseMove: function(event, chartContext, config) {
      //       //We want to get the coresponsing point to the route profile and dispaly it on the map

      //       //To render multiple colors on graph the data is broken into multiple series.
      //       //Hence we need to add the datapoints of prior series to each new one
      //       const seriesIndex = config.seriesIndex;
      //       let seriesOffset = 0;
      //       dataSets.forEach((item,index)=>{ if (index < seriesIndex) {seriesOffset += item.data.length}})

      //       //Extra datapoints are added to the areagraph which we need to remove to get same value as data points
      //       seriesOffset -= seriesIndex-1;
      //       //Store the points but first check if point is in valid range for map as users can drag slider out of range
      //       if(config.dataPointIndex+seriesOffset >= 0 && config.dataPointIndex+seriesOffset < pointData.length)
      //       setSelectedDatapoint([pointData[config.dataPointIndex+seriesOffset][0],pointData[config.dataPointIndex+seriesOffset][1]])
          
      //     }}
    },
    
    // tooltip: {
    //   custom: function({series, seriesIndex, dataPointIndex, w}) {
       
    //       return renderToString(<MapProfileToolTip name ={dataSets[seriesIndex].name} winddir = {dataSets[seriesIndex].windir} difficulty= {dataSets[seriesIndex].difficulty}/>)
    //     },
        
   
      
      
    // },
    
    
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
      colors: [(series) => "black"],
      type: "gradient",
      gradient: {
        stops: [100]
      }
    },
    xaxis: {
      
      type: "numeric",
      min: 0,
      max:distanceEnd,
      labels: {
        formatter: (val) => {if (val == distanceEnd) {return distanceEnd/1000 +'km'} else  return Math.ceil(val/20000)*20 + 'km'}
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

  return <Chart type="area" height="240"  options={options} series={seriesData} />;
};


export default MapProfile