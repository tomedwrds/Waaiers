


import { useEffect, useState } from 'react';



function FileUploader() 
{

    const [file, setFile] = useState(null);
    const [gpxData, setGPXData] = useState(null);

    const changeHandler = (e) => {
        const file = e.target.files[0];
        //Reading the file is a sideffect so it should be handled in a useEffect
        //This can be done by updating file which a depdendecy of the useffect
        setFile(file);
    }
  
   
    useEffect(()=> {
        //Checks that file is set as useEffect runs on first render
        if (file) 
        {

            const fileReader = new FileReader();
            fileReader.readAsText(file);
            fileReader.onload = (e) => {
                const { result } = e.target;
                setGPXData(result)
            }
            
      }

    },[file])

  console.log(gpxData)
  return (
    <input
        type="file"
        accept='.gpx'
        onChange={changeHandler}
    />
     
  );
}
export default FileUploader;