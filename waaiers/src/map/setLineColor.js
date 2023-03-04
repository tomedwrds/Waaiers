function setLineColor(classifcation)
{
  if(classifcation == "Tailwind")
  {
    return 'red';
  } else if(classifcation == "Headwind")
  {
    return 'green';
  } else if(classifcation == "Cross Tailwind")
  {
    return 'blue';
  } else if(classifcation == "Cross Headwind")
  {
    return 'yellow';
  } else
  {
    return 'black';
  }
}

export default setLineColor;