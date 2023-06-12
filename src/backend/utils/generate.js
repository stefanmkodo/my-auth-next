import cryto from "crypto";

export function generateNewTokens(clientId, numOfCharacters) {
    return new Array(300).fill("").map((value, index) => {
        if(index % 10 === 0) return clientId;
        return cryto.randomBytes(Math.round(numOfCharacters / 2)).toString('hex')
    });
}

export function generateClientId() {
    return cryto.randomBytes(5).toString('hex');
}
