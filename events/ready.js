// API
const {REST} = require("@discordjs/rest")
const {Routes, PermissionFlagsBits} = require("discord-api-types/v9");
const { ReturnDocument } = require("mongodb");

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
        let channelID = []

        category.children.forEach(channel => channel.delete())
        for(let i = 0; i <= maxChannels; i++){
            guild.channels.create(String(i), {
                type: "GUILD TEXT",
                parent: config.levelID,
                permissionOverwrite: {
                    id: config.everyoneID,
                    deny: ["VIEW_CHANNEL"]
                }})
        }
        members.forEach((member) => {
            let channelNumber = String(Math.ceil(Math.random() * maxChannels))
            let channel = guild.channels.cache.find(channel => channel.name === channelNumber)
        })
    }
}