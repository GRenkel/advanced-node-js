let messages = []

function updateState() {
    messages = ["teste"]
}

function printState() {
   console.log("from function: ", messages)
}

console.log("eu")


module.exports = { messages, updateState, printState }