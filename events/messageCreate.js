const Markov = require("js-markov")
const cron = require("cron")
const config = require("../config.json")

const client = require("../events/ready")
const guild = client.guilds.cache.get(config.GuildID)
const consoleLog = guild.channels.cache.get(config.consoleLogID)

const markov = new Markov()

const maxChannels = 30
const minText = 15
const maxText = 100

var sendMarkov = new cron.CronJob("0 0,15,30,45 * * * *", () => {
    markov.train()
    for(i=0; i >= maxChannels; i++){
        let channel = guild.channels.cache.find(channel => channel.name === String(i))
        channel.send(markov.generateRandom(Math.ceil(Math.random() * (maxText - minText)) +  minText))
    }
})

sendMarkov.start()

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