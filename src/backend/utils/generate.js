import crypto from "crypto";

export function generateNewTokens(clientId, numOfCharacters) {
    return new Array(44).fill("").map((value, index) => {
        const currentPointer = index * numOfCharacters;
        return clientId.substring(currentPointer, currentPointer + +numOfCharacters) + index.toString().padStart(2, "0");
    });
}

export function generateClientId() {
    return crypto.randomBytes(60).toString('hex');
}

export function generatePassKey() {
    return crypto.randomUUID();
}
