const Markov = require("js-markov")
const markov = new Markov()
const cron = require("cron")

var guild
var consoleLog
var client
var author

const maxChannels = 30
const minText = 15
const maxText = 100

module.exports = {
    name: "messageCreate",
    async execute(message) {
        // setting values on interaction
        guild = message.guild
        consoleLog = guild.channels.cache.get(process.env.CONSOLELOGID)
        client = message.client
        author = message.author

        if(author.id != client.user.id){
            try {
                markov.addStates(message.content)
            }
            catch(err){
                consoleLog.send(err)
                markov.clearState()
            }}
    }
}

var sendMarkov = new cron.CronJob("0 0,15,30,45 * * * *", () => { 
    if(guild) {
            markov.train()
            for(i=0; i <= maxChannels; i++){
                try{
                    guild.channels.cache.find(channel => {if (channel.name === String(i)) channel.send(markov.generateRandom(Math.ceil(Math.random() * (maxText - minText)) + minText))})
                }
                catch(err){
                    consoleLog.send(err)
                }
            }
        }
    })

sendMarkov.start()
