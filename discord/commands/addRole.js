const { MessageEmbed } = require('discord.js');

module.exports = {
    name : 'addRole',
    description: 'Donne un role a un utilisateur',
    format: ':round_pushpin: ``!addRole`` : Donne un role à un utilisateur\n'+
            '__*Utilisation :*__ !addRole <role> <utilisateur>\n',
    execute(bot, message){
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(':stop_sign: Vous n\'avez pas la permission d\'éxécuter cette commande !');
        const args = message.content.split(" ");
        if(!args[1] || !args[2]){
            return message.channel.send(':stop_sign: Vous devez renseigner role et un utilisateur (ex: !role Follower @toto) !');
        }
        const to = message.mentions.members.first();
        let role = message.guild.roles.cache.find(role => role.name.toLowerCase() == args[1].toLowerCase());
        if(!role){
            return message.channel.send(':stop_sign: Ce rôle n\'existe pas !');
        }
        to.roles.add(role);
    },
};
