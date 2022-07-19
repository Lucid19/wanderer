const Markov = require("js-markov")
const markov = new Markov()
const config = require("../config.json")
const cron = require("cron")

var guild
var consoleLog

const maxChannels = 30
const minText = 15
const maxText = 100

module.exports = {
    name: "messageCreate",
    async execute(message) {
        // setting values on interaction
        guild = message.guild
        consoleLog = guild.channels.cache.get(config.consoleLogID)

        try {
            markov.addStates(message.content)
            console.log("help me")
        }
        catch(err){
            consoleLog.send(err)
            markov.clearState()
        }
    }
}

var sendMarkov = new cron.CronJob("0 0,15,30,45 * * * *", () => {
    if(guild) { markov.train()
    for(i=0; i <= maxChannels; i++){
    let channel = guild.channels.cache.find(channel => channel.name === String(i))
    channel.send(markov.generateRandom(Math.ceil(Math.random() * (maxText - minText)) +  minText))}}
})

sendMarkov.start()