import {generateNewTokens} from "../utils/generate.js";
import * as db from "../utils/db.js";

export function getTokens(clientId) {
    
    let tokens = db.getExistingTokensByClientId(clientId);
    
    if(!tokens) {
        tokens = generateNewTokens(clientId);
        db.setTokensByClient(clientId, tokens);
    }
    
    return tokens;
}
