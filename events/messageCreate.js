const Markov = require("js-markov")
const markov = new Markov()

module.exports = {
    name: "messageCreate",
    async execute(message) {
        var consoleLog = message.guild.channels.cache.get(config.consoleLogID)
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