module.exports = {
	name: 'skip',
	description: 'Skip a song!',
	format: ':round_pushpin: ``!skip`` : Passe à la musique suivante\n'+
            '__*Utilisation :*__ !skip\n',
	execute(bot, message){
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send(':stop_sign: Vous devez être dans un salon vocal pour utiliser cette commande !');
		if (!serverQueue) return message.channel.send(':stop_sign: Il n\'y a aucun son à skip');
		serverQueue.connection.dispatcher.end();
		if(typeof serverQueue.songs[1] != 'undefined'){
			message.channel.send(':next_track: Musique suivante !')
		} else {
			message.channel.send(':next_track: Il n\'y a plus de musique dans la file d\'attente !');
		}
		
	},
};