function setLineColor(classifcation)
{
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