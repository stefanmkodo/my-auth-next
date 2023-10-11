import {useEffect, useState} from "react";
import useSWR from "swr";
import fetcher from "../utils/fetcher.js";
import usePassKey from "./usePassKey.js";

export default function useTokens(passKey, numOfCharacters) {
    const [tokens, setTokens] = useState([]);
    
    const passKeyInStorage = usePassKey();
    
    const {data, error, isLoading} = useSWR(passKeyInStorage ? `/tokens?clientId=${passKey}&numOfCharacters=${numOfCharacters}` : null, fetcher);
    
    useEffect(() => {
        if (!data || !data.tokens) return;
        setTokens(data.tokens);
        
    }, [data]);
    
    return tokens;
}
