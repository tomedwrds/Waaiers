
import { useEffect, useState } from 'react';
import supabase from './supabase/supabase';


function FileUploader() 
{
    const [countries, setCountries] = useState([]);

    useEffect(() => {
      getCountries();
    }, []);

    async function getCountries() {
      const { data } = await supabase.from("Routes").select();
      setCountries(data);
      console.log(data)
        
    }

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
            //Read the file
            const fileReader = new FileReader();
            fileReader.readAsText(file);

            //Wait till the read is finished
            fileReader.onload = (e) => {
                const { result } = e.target;
                setGPXData(result)
            }
            
      }

    },[file])

    console.log(countries)

    return (
        <div>
    <input
        type="file"
        accept='.gpx'
        onChange={changeHandler}
    />
  
       
        </div>
    
     
  );
}

export default FileUploader;