import useSWR from "swr";
import fetcher from "../utils/fetcher.js";
import {useEffect, useState} from "react";

export default function useClientId () {
    const [clientId, setClientId] = useState(null);
    
    const {data} = useSWR(!clientId ? '/auth' : null, fetcher);
    
    useEffect(() => {
        const clientIdFromStorage = localStorage.getItem("clientId");
        if(clientIdFromStorage) {
            setClientId(clientIdFromStorage);
        }
    }, []);
    
    useEffect(() => {
      if(!clientId && data?.clientId) {
        setClientId(data.clientId);
        localStorage.setItem("clientId", data.clientId);
      }
    }, [clientId, data])
    
    return clientId;
}
