// API
const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v9");
const { Permissions} = require("discord.js")

const config = require("../config.json")

module.exports = {
    name : "ready",
    once : true,
    async execute(client, commands){
        console.log("bot is ready!");

        // user
        const CLIENT_ID = client.user.id
        const guild = client.guilds.cache.get(config.GuildID)

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
        var members = await guild.members.fetch()

        members.forEach((member) => {
            let channelNumber = String(Math.ceil(Math.random() * 100))
            let channel = false
        
            if(!channel){
                let channel = guild.channels.create(channelNumber, {
                    type: "GUILD TEXT",
                    parent: config.levelID,
                    permissionOverwrite: {
                        id: config.GuildID,
                        deny: [Permissions.FLAGS.VIEW_CHANNEL]
                    }
                })
            }
            console.log(channel)
         
        })
    }
}