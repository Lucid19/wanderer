//API
const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v9");

//jobs
const cron = require("cron")

module.exports = {
    name : "ready",
    once : true,
    async execute(client, commands){
        console.log("bot is ready!");

        // user
        const CLIENT_ID = client.user.id
        const guild = client.guilds.cache.get(process.env.GUILDID)
        
        // Channels
        const maxChannels = 30
        const category = guild.channels.cache.get(process.env.LEVELID)

        // REST API
        const rest = new REST({
            version : "9"
        }).setToken(process.env.TOKEN)

        // registering commands
        try{
            // for guild
            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILDID), {
                body: commands
            })
            console.log("Commands ready")
        }
        catch(err){
            if(err)console.error(err)
        }

        // starting up jobs
        var autoGenerateChannels =  new cron.CronJob("0 0 0 * * *", async () => {
            const members = await guild.members.fetch()

            category.children.forEach(channel => channel.delete())
            for(let i = 0; i <= maxChannels; i++){
                guild.channels.create(String(i), {
                    type: "GUILD TEXT",
                    parent: process.env.LEVELID,
                    permissionOverwrites: [{id: process.env.GUILDID, deny: ["VIEW_CHANNEL"]}]
            })}

            const channels = await guild.channels.fetch()

            members.forEach((member) => {
                const channelNumber = String(Math.ceil(Math.random() * maxChannels))
                channels.forEach((channel) => {if(channel.name === channelNumber) channel.permissionOverwrites.set([{id: member.user.id, allow: ["VIEW_CHANNEL"]}])})
            })})
        autoGenerateChannels.start()
}
}