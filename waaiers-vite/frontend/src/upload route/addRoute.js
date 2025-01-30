import { v4 as uuidv4 } from 'uuid';
import { XMLParser } from 'fast-xml-parser';


async function addRoute(routeData,routeGpxData,userAdmin,navigate) {
    //Checks wether the user has filled out all aspects of the form
    if(routeData.route_date && routeData.route_name &&  routeData.route_time  && routeGpxData)
    {    
        let combineDateTime = new Date(Date.parse(routeData.route_date + ' ' + routeData.route_time));
        const options = {
            ignoreAttributes : false,
            attributeNamePrefix: "",
            parseAttributeValue: true
        };
        const gpxParser = new XMLParser(options);
        const gpx = gpxParser.parse(routeGpxData);
        const parsedPoints = gpx.gpx.trk.trkseg.trkpt;

        const routeId = uuidv4()
        try {
            await fetch("https://localhost:7276/api/Route", {
                method: "POST",
                body: JSON.stringify({
                    name:  routeData.route_name,
                    date: combineDateTime,
                    points: parsedPoints
                }),
                headers: {
                    "Content-type": "application/json"
                }
            });
            
        } catch(e) {
            console.error(e)
        }


    }
    else
    {
        alert("Submission error - form not complete")
    }
    
}

export default addRoute