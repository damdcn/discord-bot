const { Util } = require("discord.js");
module.exports = {
    name : 'report',
    description: 'Signaler un utilisateur',
    format: ':round_pushpin: ``!report`` : Signale un utilisateur au fondateur\n'+
            '__*Utilisation :*__ !report <utilisateur> <raison>\n'+
            '__*Note :*__ Lors de l\'envoi du message, il ne s\'affichera pas dans le salon, vous pouvez donc écrire en toute confidentialité\n',
    execute(bot, message){
        const arg = message.content.split(" ");
        const args = arg.splice(0,2);
        args.push(arg.join(" "));
        if(typeof args[1] === 'undefined' || typeof args[2] === 'undefined'){
            message.channel.bulkDelete(1);
            return message.channel.send(':stop_sign: Vous devez renseigner le \'@\' de la personne à signaler ansi qu\'un motif (ex: !report @user motif)');
        }
        if(!message.mentions.users.first()){
            message.channel.bulkDelete(1);
            return message.channel.send(':stop_sign: Vous devez renseigner le \'@\' de la personne à signaler ansi qu\'un motif (ex: !report @user motif)');
        }
        const from = message.author;
        const sig = message.mentions.users;
        const sigName = sig.first().username;
        const sigFullName = sig.first().username+'#'+sig.first().discriminator;
        const fromFullName = from.username+'#'+from.discriminator;
        if(sig.first().bot){
            message.channel.bulkDelete(1);
            return message.channel.send(':stop_sign: Vous ne pouvez pas signaler un bot !');
        }
        message.channel.bulkDelete(1);

        const idFondateur = message.guild.roles.cache.find(role => role.name === 'Fondateur').id; // rôle à qui signaler (ici Fondateur)
        const memberFondateur = message.guild.members.cache.filter(member=>member.roles.cache.has(idFondateur)).map(m=>m.id);

        memberFondateur.map(user => bot.users.cache.get(user)
                       .send(':no_pedestrians: **'+fromFullName+'** a signalé '+sigFullName+'\n:closed_book: Motif : '+args[2]));

        message.author.createDM().then(function(channel){
            channel.send(':no_pedestrians: Merci d\'avoir signalé '+sigName+'\n:closed_book: Motif : '+args[2]);
        })
    },
};