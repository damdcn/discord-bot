const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name : 'commands',
    description: 'Renvoie la structure de toutes les commandes',
    format: ':round_pushpin: ``!commands`` : Affiche la structure de toutes les commandes\n'+
            '__*Utilisation :*__ !commands\n',
    execute(bot, message){

        const commandFiles = fs.readdirSync('./discord/commands/').filter(file => file.endsWith('.js'));
        const tabCommands = new Array();
        for(const file of commandFiles) {
            const c = require(`./${file}`);
            tabCommands.push(c.format);
        }

        const embed = new MessageEmbed()
            .setColor("00e608")
            .setAuthor(`Commandes du Bot`)
            .setDescription(tabCommands.join("\n"))
            .setFooter("signé le bot,")
            .setTimestamp()

            message.channel.send(embed);
    },
};