// No authentication. demonstrate POST with data in body

// Note response length limit
// Invalid Result: response >256 bytes

// demo subscription
// https://functions.chain.link/optimism-sepolia/231

// make HTTP request
const direction = args[0];
const url = "https://test.geist.network/game/move";


console.log('Make a move')
console.log(`HTTP POST Request to ${url}`);

// TODO
const idempotentKey = "player-1-demo";


// TODO other directions
//  This payload could come from contract instead
let x = 0;
let y = 0;

if (direction === 'up') {
    y = 1;
}
if (direction === 'down') {
    y = -1;
}
// TODO use header
const payload = {
    idempotentKey,
    "playerKey": "player-1",
    "position": {
        x,
        y
    }
}

const gameRequest = Functions.makeHttpRequest({
    url: url,
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    data: payload,
});


// Execute the API request (Promise)
const gameResponse = await gameRequest;
if (gameResponse.error) {
    console.error(
        gameResponse.response
            ? `${gameResponse.response.status},${gameResponse.response.statusText}`
            : ""
    );
    throw Error("Request failed");
}

const gameResponseData = gameResponse["data"];

if (!gameResponseData) {
    throw Error(`Make sure api is working`);
}

console.log("response", gameResponseData);

// result is in JSON object
// const result = {
//     ...gameResponseData
// };

return Functions.encodeString(gameResponseData)

// // Use JSON.stringify() to convert from JSON object to JSON string
// // Finally, use the helper Functions.encodeString() to encode from string to bytes
// return Functions.encodeString(JSON.stringify(result));