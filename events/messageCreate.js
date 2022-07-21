const Markov = require("js-markov")
const markov = new Markov()
const config = require("../config.json")
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
        consoleLog = guild.channels.cache.get(config.consoleLogID)
        client = message.client
        author = message.author
        
        console.log(message.content)

        if(author.id != client.user.id){
            try {
                markov.addStates(message.content)
            }
            catch(err){
                console.log(err)
                markov.clearState()
            }}
    }
}

var sendMarkov = new cron.CronJob("0 0,15,30,45 * * * *", () => { 
    if(guild) { 
        let channel = guild.channels.cache.get("999627027147673644")
        channel.send("If upon a time yes")}
})

sendMarkov.start()
