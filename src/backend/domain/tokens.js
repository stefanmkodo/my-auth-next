import {generateNewTokens} from "../utils/generate.js";
import * as db from "../utils/db.js";

export function getTokens(clientId, numOfCharacters) {
    
    let tokens = db.getExistingTokensByClientId(clientId, numOfCharacters);
    
    if(!tokens) {
        tokens = generateNewTokens(clientId, numOfCharacters);
        db.setTokensByClient(clientId, tokens);
    }
    
    return tokens;
}
