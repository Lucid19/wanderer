const {markov} = require("ready.js")

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        markov.addStates("norm")
        markov.train()
        console.log(markov.generaetRandom(100))
    }
}