const { MessageEmbed } = require('discord.js');
const fortnite = require('fortnite');
const { getAuthKeys } = require('../../tokens');
const client = new fortnite(getAuthKeys().api_key_fortnite);
const fortniteData = require('../../src/fortnite.json');

module.exports = {
    name : 'fortnite',
    description: 'Renvoie les stats fortnite',
    format: ':round_pushpin: ``!fortnite`` : Affiche les stats d\'un joueur\n'+
            '__*Utilisation :*__ !fortnite <pseudo_epic>\n',
    execute(bot, message){
        const args = message.content.split(" ");
        if(!args[1]) return message.channel.send(':stop_sign: Veuillez renseignez votre pseudo (ex: !fortnite MichouDu45)');

        let data = client.user(args[1], 'pc').then(data => {

            const username = data.username;
            const { top_5, top_3, top_6, top_12, top_25, score, matches, wins, kills, kd } = data.stats.lifetime;

            const embed = new MessageEmbed()
            .setColor("00e608")
            .setAuthor(`Stats Fortnite | ${args[1]}`, fortniteData.author_pic)
            .setThumbnail(fortniteData.thumbnail_pic)
            .setDescription(`**Top 1** : ${wins || "??"}
                             **Top 5** : ${top_5 || "??"}
                             **Top 25** : ${top_25 || "??"}
                             **Kills** : ${kills || "??"}
                             **K/D Ratio** : ${kd || "??"}
                             **Parties jouées** : ${matches || "??"}\n`)
            .setFooter(bot.user.username)
            .setTimestamp()

            message.channel.send(embed);

        }).catch(e => {
            console.log(e);
            message.channel.send(':stop_sign: Le joueur '+username+' est introuvable..')
        })        
    },
};