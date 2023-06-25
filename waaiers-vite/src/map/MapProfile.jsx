import Chart from "react-apexcharts";

const MulticolorAreaChart = ({ data, extractColor }) => {
    const dataSets = [];
  
    let previousColor = null;
    for (const element of data.sort((a, b) => a.x - b.x)) {
      const color = extractColor(element);
  
      let dataSet;
      if (dataSets.length === 0 || previousColor !== color) {
        const previousDataSet =
          dataSets.length !== 0 ? dataSets[dataSets.length - 1] : null;
        dataSet = {
          name: `${element.veracity} veracity`,
          color: color,
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
        }
      },
      title: {
        text: "Dynamic Area Chart Color Fill",
        align: "center"
      },
      tooltip: {
        shared: true
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
        labels: {
          formatter: (val) => val
        }
      },
      yaxis: {
        labels: {
          formatter: (val) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        axisBorder: {
          show: true
        }
      }
    };
  
    return <Chart type="area" height="240"  options={options} series={dataSets} />;
  };


const MapProfile = (props) => {

    //The segment data must be taken and destructured into point data to make the stage profile
    
    const segmentData = props.pointData;

    //Point data is retrieved
    let pointData = [];
    segmentData.forEach((segment,id)=>pointData.push(...segment.latlon.map(((point)=>[point[2],point[3],segmentData[id].classification]))))

    //Then is is formatted for the graph
    //On the x adxis is the distance y is elevation
    const profileData = pointData.map((item)=> ({x:item[1],y:item[0],classification: item[2]}))
   console.log(profileData)

    //We next want to destructure this data to create a stage profile
    
    
      return (
        <MulticolorAreaChart
          data={profileData}
          extractColor={(element) => {
            switch (element.classification) {
              case "cross":
                return "green";
              case "head":
                return "yellow";
              case "tail":
                return "red";
              default:
                return "black";
            }
          }}
        />
      );
}

export default MapProfile