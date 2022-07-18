//API
const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v9");
const { Permissions } = require("discord.js");
const {Markov} = require("js-markov")

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

        // Markov
        const markov = new Markov()
        
        // Channels
        const category = guild.channels.cache.get(config.levelID)
        const maxChannels = 30

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
            return
        })

        sendMarkov.start()
        autoGenerateChannels.start()
}
}
