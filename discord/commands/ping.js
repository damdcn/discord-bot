module.exports = {
    name : 'ping',
    description: 'Répond pong à ping',
    format: ':round_pushpin: ``!ping`` : Répond "pong"\n'+
            '__*Utilisation :*__ !ping\n',
    execute(bot, message){
        message.channel.send('pong');
    },
};