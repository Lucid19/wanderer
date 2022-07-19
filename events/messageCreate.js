const Markov = require("js-markov")
const cron = require("cron")
const config = require("../config.json")

const client = require("../events/ready")
const guild = client.guilds.cache.get(config.GuildID)
const consoleLog = guild.channels.cache.get(config.consoleLogID)

const markov = new Markov()

module.exports = {
    name: "messageCreate",
    async execute(message) {
        try {
            markov.addStates(message.content)
        }
        catch(err){
            consoleLog.send(err)
            markov.clearState()
        }
    }
}

module.exports = markov