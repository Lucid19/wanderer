const Markov = require("js-markov")
const cron = require("cron")
const config = require("../config.json")

const markov = new Markov()
const { client } = require("../index")

var sendMarkov = new cron.CronJob("0 0,15,30,45 * * * *", () => {
    markov.train()
    console.log(markov.generateRandom(100))
})

sendMarkov.start()

module.exports = {
    name: "messageCreate",
    async execute(message) {
        try {
            markov.addStates(message.content)
        }
        catch(err){
            console.log(err)
            markov.clearState()
        }
    }
}