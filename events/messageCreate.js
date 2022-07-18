const Markov = require("js-markov")
const cron = require("cron")

const markov = new Markov()

var sendMarkov = new cron.CronJob("0 0,15,30,45 * * * *", () => {
    markov.train()
    console.log(markov.generateRandom(100))
})

sendMarkov.start()

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        markov.addStates()
        console.log(client)
    }
}