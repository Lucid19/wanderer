// filesystem
const fs = require("fs")
const { MongoClient } = require("mongodb")
const Markov = require("js-markov")
const config = require("./config.json")
const cron = require("cron")

const markov = new Markov()


// preset values
const maxChannels = 100

// client
const { Client, Intents, Collection, Message} = require("discord.js")
const { randomBytes } = require("crypto")
const client = new Client({intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]})
const guild = client.guilds.fetch(config.GuildID)

// Database
const clientDB = new MongoClient(config.uri);

// Commands
const commandFiles =  fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
const commands = []
client.commands = new Collection()

// Events
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"))

// loading command files
for(const file of commandFiles){
    const command = require(`./commands/${file}`)
    commands.push(command.data.toJSON())
    client.commands.set(command.data.name, command)
}

// loading event files
for(const file of eventFiles){
    const event = require(`./events/${file}`)

    if(event.once){
        client.once(event.name, (...args) => event.execute(...args, commands))
    }
    else{
        client.on(event.name, (...args) => event.execute(...args, commands))
    }
}

let autoGenerateChannels = new cron.CronJob('00 00 00 * * *', () => {
    var members = guild.members.fetch()

    members.each((member) => {
        let channelNumber = String(Math.ceil(Math.random() * 100))
        var channel = guild.channels.find(channel => channel.name === channelNumber)

        if(!channel){
            guild.channels.create(channelNumber, {
                type: "GUILD TEXT",
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
         
})

client.login(config.token)