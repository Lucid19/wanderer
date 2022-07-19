//API
const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v9");
const { Permissions } = require("discord.js");

//jobs
const cron = require("cron")

const config = require("../config.json")

module.exports = {
    name : "ready",
    once : true,
    async execute(client, commands){
        console.log("bot is ready!");

        // user
        const CLIENT_ID = client.user.id
        const guild = client.guilds.cache.get(config.GuildID)
        
        // Channels
        const category = guild.channels.cache.get(config.levelID)
        const maxChannels = 30

        // markov
        const minText = 15
        const maxText = 100

        const {markov} = require("../events/messageCreate")

        // REST API
        const rest = new REST({
            version : "9"
        }).setToken(config.token)

        // registering commands
        try{
            // for guild
            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, config.GuildID), {
                body: commands
            })
            console.log("Commands ready")
        }
        catch(err){
            if(err)console.error(err)
        }

        // starting up jobs
        var autoGenerateChannels =  new cron.CronJob("0 0 0 * * *", async () => {
            var members = await guild.members.fetch()

            category.children.forEach(channel => channel.delete())
            for(let i = 0; i <= maxChannels; i++){
                guild.channels.create(String(i), {
                    type: "GUILD TEXT",
                    parent: config.levelID
            })}
    
            var channels = await guild.channels.fetch()
    
            members.forEach((member) => {
                let channelNumber = String(Math.ceil(Math.random() * maxChannels))
                channels.forEach((channel) => {if(channel.name === channelNumber) return channel.permissionOverwrites.set([{id: member.id, allow: [Permissions.FLAGS.VIEW_CHANNEL]}])})
            })})

        var sendMarkov = new cron.CronJob("0 0,15,30,45 * * * *", async () => {
            markov.train()
            for(i=0; i >= maxChannels; i++){
            let channel = guild.channels.cache.find(channel => channel.name === String(i))
            channel.send(markov.generateRandom(Math.ceil(Math.random() * (maxText - minText)) +  minText))
            }
        })

        sendMarkov.start()
        autoGenerateChannels.start()
}
}
