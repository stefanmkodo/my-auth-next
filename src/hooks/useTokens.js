import {useEffect, useState} from "react";
import useSWR from "swr";
import fetcher from "../utils/fetcher.js";
import useClientId from "./useClientId.js";

export default function useTokens(numOfCharacters) {
    const [tokens, setTokens] = useState([]);
    
    const clientId = useClientId();
    
    const {data, error, isLoading} = useSWR(clientId ? `/tokens?clientId=${clientId}&numOfCharacters=${numOfCharacters}` : null, fetcher);
    
    useEffect(() => {
        if (!data || !data.tokens) return;
        setTokens(data.tokens);
        
    }, [data]);
    
    return tokens;
}
