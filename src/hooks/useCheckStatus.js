import useSWR from "swr";
import fetcher from "../utils/fetcher.js";
import {useEffect, useState} from "react";
import usePassKey from "./usePassKey.js";

export default function useCheckStatus() {
    const [status, setStatus] = useState(null);
    const clientId = usePassKey();
    
    const {data} = useSWR(clientId && status !== "passed" ? `/check-status?clientId=${clientId}` : null, fetcher, {refreshInterval: 1000});
    
    useEffect(() => {
        if (typeof data?.status !== "undefined") {
            setStatus(data.status);
        }
    }, [data])
    
    return status;
}
