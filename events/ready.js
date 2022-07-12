// API
const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v9");

const config = require("../config.json")

module.exports = {
    name : "ready",
    once : true,
    async execute(client, commands){
        console.log("bot is ready!");

        // user
        const CLIENT_ID = client.user.id

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
        client.login(config.token)

        const guild = client.guilds.cache.get(config.GuildID)
        var member = guild.members.fetch()
         
        member.forEach((member) => {
            let channelNumber = String(Math.ceil(Math.random() * 100))
            var channel = guild.channels.find(channel => channel.name === channelNumber)
         
            if(!channel){
                guild.channels.create(channelNumber, {
                    type: "GUILD TEXT",
                    parent: config.levelID,
                    permissionOverwrite: {
                        id: config.GuildID,
                        deny: [Permissions.FLAGS.VIEW_CHANNEL]
                    }
                })
            }
            var channel = guild.channels.find(channel => channel.name === channelNumber)
            channel.updateOverwrite(member, {
                VIEW_CHANNEL : true
            })
         
        })
    }
}