const { MessageEmbed } = require('discord.js');
const emojis = require('../../src/poll.json');

module.exports = {
    name : 'poll',
    description: 'Permet de faire un sondage',
    format: ':round_pushpin: ``!poll`` : Permet de faire sondage\n'+
            '__*Utilisation :*__ !poll "question" ou !poll "question" "reponse 1" .. "reponse 10"\n',
    execute(bot, message){
        const args = message.content.split(" ");
        if(args.length == 1){
            return message.channel.send(':stop_sign: Vous devez renseigner au moins une question ou une question et des réponses (ex : !poll "Question" ou !poll "Question" "Reponse 1" "Reponse 2" etc..) !');
        }

        let regex = /(?<=")(.*?)(?=")|(?<=')(.*?)(?=')/g;
        let value = message.content.match(regex);
        while(value.indexOf(" ")!=-1)
            value.splice(value.indexOf(" "),1);
            
        if(value.length == 1){ // Cas avec réponse "oui"/"non"
            let embed = new MessageEmbed()
                .setTitle(':bar_chart: **'+value[0]+'**')
                .setColor("00e608")
            message.channel.send(embed).then((message) =>{
                message.react('👍');
                message.react('👎');    
            });
        } else if(value.length > 1) { // Cas avec réponses custom
            emojisArray = Object.values(emojis);
            msg = '';
            for(i=1;i<=value.length-1;i++){
                msg += emojisArray[i-1]+' : '+value[i]+'\n';
            }
            let embed = new MessageEmbed()
                .setTitle(':bar_chart: **'+value[0]+'**')
                .setDescription(msg)
                .setColor("00e608")

            message.channel.send(embed).then((message) =>{
                for(i=1;i<=value.length-1;i++){
                    message.react(emojisArray[i-1]);
                }
            });
        } else {
            return message.channel.send(':stop_sign: Vous devez renseigner au moins une question ou une question et des réponses (ex : !poll "Question" ou !poll "Question" "Reponse 1" "Reponse 2" etc..) !');
        }
    },
};