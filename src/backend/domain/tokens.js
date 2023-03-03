import {generateTokens} from "../utils/generate.js";
import * as db from "../utils/db.js";

export function getTokens(clientId) {
    
    let tokens = db.getTokensByClient(clientId);
    
    if(!tokens) {
        tokens = generateTokens(clientId);
        db.setTokensByClient(clientId, tokens);
    }
    
    return tokens;
}
