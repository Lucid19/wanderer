const Markov = require("js-markov")
const markov = new Markov()
const config = require("../config.json")
const cron = require("cron")
const {client} = require("../index")

const guild = client.guilds.cache.get(config.GuildID)


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
        var consoleLog = guild.channels.cache.get(config.consoleLogID)
        console.log("sex")
        try {
            markov.addStates(message.content)
        }
        catch(err){
            consoleLog.send(err)
            markov.clearState()
        }
    }
}