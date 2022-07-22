module.exports = {
    name: "guildMemberAdd",

    async execute(member) {
        const channelNumber = String(Math.ceil(Math.random() * maxChannels))
        channels.forEach((channel) => {if(channel.name === channelNumber) channel.permissionOverwrites.set([{id: member.user.id, allow: ["VIEW_CHANNEL"]}])})
    }
}