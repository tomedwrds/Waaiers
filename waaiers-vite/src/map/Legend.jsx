import { useEffect } from "react";
import L from "leaflet";
import "./Legend.css";

function Legend({ map }) {
  // console.log(map);
  // useEffect(() => {
  //   if (map) {
  //     const legend = L.control({ position: "bottomright" });
  //     console.log(legend)
  //     legend.onAdd = () => {
  //       const div = L.DomUtil.create("div", "info legend");
  //       div.innerHTML =
  //         "<h4>This is the legend</h4>" +
  //         "<b>Lorem ipsum dolor sit amet consectetur adipiscing</b>";
  //       return div;
  //     };

  //     legend.addTo(map);
  //   }
  // }, [map]);
  // return null;
  return (
    <div className="legend">
      <div className="legend-item">
        <span className="legend-color" style={{ backgroundColor: 'red' }}></span>
        <span className="legend-label">Cross Wind</span>
      </div>
      <div className="legend-item">
        <span className="legend-color" style={{ backgroundColor: 'blue' }}></span>
        <span className="legend-label">Head Wind</span>
      </div>
      <div className="legend-item">
        <span className="legend-color" style={{ backgroundColor: 'green' }}></span>
        <span className="legend-label">Tail Wind</span>
      </div>
      <div className="legend-item">
        <span className="legend-color" style={{ backgroundColor: 'grey' }}></span>
        <span className="legend-label">No Wind</span>
      </div>
    </div>
  );
}

export default Legend;
