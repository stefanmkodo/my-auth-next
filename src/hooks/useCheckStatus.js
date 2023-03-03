import useSWR from "swr";
import fetcher from "../utils/fetcher.js";
import {useEffect, useState} from "react";
import useClientId from "./useClientId.js";

export default function useCheckStatus() {
    const [status, setStatus] = useState(null);
    const clientId = useClientId();
    
    const {data} = useSWR(clientId && status !== "passed" ? `/check-status?clientId=${clientId}` : null, fetcher, {refreshInterval: 1000});
    
    useEffect(() => {
        if (typeof data?.status !== "undefined") {
            setStatus(data.status);
        }
    }, [data])
    
    return status;
}
