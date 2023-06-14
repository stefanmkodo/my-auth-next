
const db = {}


export function getExistingTokensByClientId(clientId, numOfCharacters) {
    if (numOfCharacters === db[clientId]?.numOfCharacters) {
        return db[clientId]?.tokens;
    }
    return null;
}

export function setTokensByClient(clientId, tokens, numOfCharacters) {
    if(db[clientId] === undefined) db[clientId] = {};
    db[clientId].tokens = tokens;
    db[clientId].numOfCharacters = numOfCharacters;
}

export function getStatusByClient(clientId) {
    return db[clientId]?.status ?? null;
}

export function setStatus(clientId, status) {
    return db[clientId].status = status;
}

