import useSWR from "swr";
import fetcher from "../utils/fetcher.js";
import {useEffect, useState} from "react";

export default function useClientId () {
    const [clientId, setClientId] = useState(null);
    
    const {data} = useSWR(!clientId ? '/auth' : null, fetcher);
    
    useEffect(() => {
        const clientId = localStorage.getItem("clientId");
        if(clientId) {
            setClientId(clientId);
        }
    }, []);
    
    useEffect(() => {
      if(!clientId && data?.clientId) {
        setClientId(data.clientId);
        localStorage.setItem("clientId", data.clientId);
      }
    }, [data])
    
    return clientId;
}
