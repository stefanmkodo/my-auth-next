import cryto from "crypto";

export function generateNewTokens(clientId) {
    return new Array(300).fill("").map((value, index) => {
        if(index % 10 === 0) return clientId;
        return cryto.randomBytes(3).toString('hex')
    });
}

export function generateClientId() {
    return cryto.randomBytes(5).toString('hex');
}
