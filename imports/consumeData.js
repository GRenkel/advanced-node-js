const { updateState, printState, messages } = require("./initializeData/initializeData")
const consumeData = require("./initializeData/consumeData")

console.log("C1: ", messages)

setTimeout(() => console.log("from variable: ", messages), 2000)
setTimeout(() => printState(), 2000)