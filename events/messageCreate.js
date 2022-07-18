const Markov = require("js-markov")

const markov = new Markov()

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        markov.addStates("norm")
        markov.train()
        console.log(markov.generateRandom(100))
    }
}