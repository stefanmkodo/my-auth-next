import {useEffect, useState} from "react";
import getFPS from "../utils/getFPS.js";

function useFPS(){
const [fps, setFPS] = useState(0);

  useEffect(() => {
      const interval = setInterval(async () => {
          setFPS(Math.round(await getFPS()));
      }, 1000);
    
      return () => clearInterval(interval);
  }, []);

  return fps;
}
export default useFPS;
