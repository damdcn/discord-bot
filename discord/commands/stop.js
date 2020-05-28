module.exports = {
	name: 'stop',
	description: 'Stop all songs in the queue!',
	format: ':round_pushpin: ``!stop`` : Arrête la lecture, vide la file d\'attente et déconnecte le bot\n'+
            '__*Utilisation :*__ !stop\n',
	execute(bot, message){
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send(':stop_sign: Vous devez être dans un channel vocal pour utiliser cette commande !');
		if (!serverQueue) return message.channel.send(':stop_sign: Il n\'y a aucun son dans la file d\'attente');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
		message.channel.send(':notepad_spiral: Liste d\'attente vidée !\n'+
							 ':mute: Déconnexion..');
	},
};