module.exports = {
    name : 'clean',
    description: 'Nettoie les messages dun salon',
    format: ':round_pushpin: ``!clean`` : Supprime les n derniers messages du salon\n'+
            '__*Utilisation :*__ !clean <n> (avec 0 < n < 100)\n',
    execute(bot, message){
        if(message.member.hasPermission("ADMINISTRATOR")){
            const args = message.content.split(" ");
            if(typeof args[1] === 'undefined'){
                return message.channel.send(':stop_sign: Vous devez renseigner un nombre de message à effacer !');
            }
            if(args[1]>=100 || args[1]<=0) return message.channel.send(':stop_sign: Le nombre de message à effacer doit être compris entre 1 et 99 !');
            const nbMsg = parseInt(args[1])+1;
            message.channel.bulkDelete(nbMsg);
        } else {
            message.channel.send(':stop_sign: Vous n\'avez pas la permission d\'éxécuter cette commande !');
        }
    },
};