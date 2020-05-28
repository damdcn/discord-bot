const { MessageEmbed } = require('discord.js');

module.exports = {
    name : 'role',
    description: 'Donne les utilisateurs avec un role',
    format: ':round_pushpin: ``!role`` : Affiche tous les utilisateurs possédant ce rôle\n'+
            '__*Utilisation :*__ !role <role>\n',
    execute(bot, message){
        const args = message.content.split(" ");
        if(typeof args[1] === 'undefined'){
            return message.channel.send(':stop_sign: Vous devez renseigner role (ex: !role Follower) !');
        }
        let role = message.guild.roles.cache.find(role => role.name.toLowerCase() == args[1].toLowerCase());
        if(!role){
            return message.channel.send(':stop_sign: Ce rôle n\'existe pas !');
        }
        
        const RoleId = message.guild.roles.cache.find(role => role.name.toLowerCase() === args[1].toLowerCase()).id;
        const roleName = message.guild.roles.cache.find(role => role.name.toLowerCase() === args[1].toLowerCase()).name;
        const membersWithRole = message.guild.members.cache.filter(member=>member.roles.cache.has(RoleId)).map(m=>m.displayName);

        let embed = new MessageEmbed()
            .setTitle(`Utilisateurs avec le role __${roleName}__ :`)
            .setDescription(membersWithRole.join("\n"))
            .setColor("00e608")

        message.channel.send(embed);
    },
};
