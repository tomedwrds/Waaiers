
const average = array => array.reduce((a, b) => a + b) / array.length;

function setLineColor(classifcation)
{
  let angle = (average(classifcation.segmentWindAngle) + 360) % 360
  console.log(angle)
  if((angle < 105 && angle > 45) || (angle < 315 && angle > 255) )
  {
    return 'red'
  }
  else
  {
    return 'black'
  }


  return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
  if(classifcation == "Tailwind")
  {
    return 'black';
  } else if(classifcation == "Headwind")
  {
    return 'green';
  } else if(classifcation == "Cross Tailwind")
  {
    return 'blue';
  } else if(classifcation == "Cross Headwind")
  {
    return 'black';
  } else
  {
    return 'black';
  }
}

export default setLineColor;