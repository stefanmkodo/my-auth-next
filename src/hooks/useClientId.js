import useSWR from "swr";
import fetcher from "../utils/fetcher.js";
import {useEffect, useState} from "react";

export default function useClientId () {
    const [clientId, setClientId] = useState(null);
    const [passKey, setPassKey] = useState(null);
    const [hashedIP, setHashedIP] = useState(null);

    const {data} = useSWR(!clientId ? '/auth' : null, fetcher);

    useEffect(() => {
        const clientIdFromStorage = localStorage.getItem("clientId");
        const passKeyFromStorage = localStorage.getItem("passKey");
        const hashedIpFromStorage = localStorage.getItem("hashedIP");
        if(clientIdFromStorage) {
            setClientId(clientIdFromStorage);
            setHashedIP(hashedIpFromStorage);
            setPassKey(passKeyFromStorage);
        }
    }, []);
    
    useEffect(() => {
      if(!clientId && data?.clientId) {
        setClientId(data.clientId);
        localStorage.setItem("clientId", data.clientId);
      }
      if (!passKey && data?.passKey) {
          setPassKey(data.passKey);
          localStorage.setItem("passKey", data.passKey);
      }
        if (!hashedIP && data?.hashedIP) {
            setHashedIP(data.hashedIP);
            localStorage.setItem("hashedIP", data.hashedIP);
        }
    }, [clientId, passKey, hashedIP, data])
    
    return { clientId, passKey, hashedIP };
}
