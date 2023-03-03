import * as db from "../utils/db.js";
import * as tokens from "./tokens.js";

export function checkStatus(clientId) {
    return db.getStatusByClient(clientId);
}


export function validateTokens(reqTokens) {
    
    // find the client in reqTokens
    const maskedClientId = reqTokens.find(token => token.length >= 12);
    
    if (!maskedClientId) return null;
    
    const clientId = maskedClientId.replace("MKD", "");
    
    // get the tokens from db
    const dbTokens = tokens.getTokens(clientId);
    
    if (!dbTokens) return null;
    
    let reqTokensProcessed = reqTokens.map(t => t.replace("MKD", ""));
    
    return checkTokensMatchInDb(clientId, reqTokensProcessed, dbTokens);
}

export function checkTokensMatchInDb(clientId, reqTokens, tokens) {
    console.log("##################################################################");
    const length = reqTokens.length;
    let reqTokensToCheck = reqTokens;
    
    console.log("clientId", clientId);
    console.log("reqTokens", reqTokens);
    console.log("tokens", JSON.stringify(tokens));
    
    // let indexOfFirstToken = 0;
    // if (reqTokens[0] === clientId) {
    //     indexOfFirstToken = tokens.findIndex(t => t === reqTokens[1]);
    //     reqTokensToCheck = reqTokens.slice(1);
    // } else {
    //     indexOfFirstToken = tokens.findIndex(t => t === reqTokens[0]);
    // }
    // console.log("indexOfFirstToken", indexOfFirstToken);
    
    // if (indexOfFirstToken === -1) {
    //     return;
    // }
    
    // const slicedTokens = tokens.slice(indexOfFirstToken, indexOfFirstToken + length);
    const matched = reqTokensToCheck.filter((t, index) => tokens.find(st => st === t));
    console.log("matched", matched.length, "vs", length);
    const result = (matched.length / length) >= 0.7;
    
    if(result) {
        db.setStatus(clientId, "passed");
        console.log("result", "passed");
        return "passed";
    }
    console.log("result", "failed");
    return "failed";
}
