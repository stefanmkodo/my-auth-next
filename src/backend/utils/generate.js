import crypto from "crypto";

export function generateNewTokens(clientId, numOfCharacters) {
    return shuffle(new Array(44).fill("").map((value, index) => {
        const currentPointer = index * numOfCharacters;
        return clientId.substring(currentPointer, currentPointer + +numOfCharacters) + index.toString().padStart(2, "0");
    }));
}

function shuffle(arrayToShuffle) {
    const result = arrayToShuffle;
    arrayToShuffle.forEach((item, index) => {
        const randomIndex = Math.floor(Math.random() * index);
        [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    })

    return result;
}

export function generateClientId() {
    return crypto.randomBytes(60).toString('hex');
}

export function generatePassKey() {
    return crypto.randomUUID();
}
