const { Util } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function validYoutubeURL(str) {
  var pattern = new RegExp('^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$');
  return !!pattern.test(str);
}

module.exports = {
  name: "play",
  description: "Play a song in your channel!",
  format: ':round_pushpin: ``!play`` : Joue une musique dans un salon vocal\n'+
            '__*Utilisation :*__ !play <nom_de_musique> ou <YoutubeURL>\n',
  async execute(bot, message){
    try {
      const args = message.content.split(" ");
      const args2 = message.content.slice(6);
      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);

      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
        return message.channel.send(
          ":stop_sign: Vous devez être dans un salon vocal pour utiliser cette commande !"
        );
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
          ":stop_sign: J'ai besoin des permissions pour rejoindre et parler dans votre salon"
        );
      }

      if(typeof args[1] === 'undefined'){
        return message.channel.send(':stop_sign: Vous devez renseigner un lien ou une recherche !');
      }

      var songInfo = null;
      var song = null;

      if(validYoutubeURL(args[1])) {
        songInfo = await ytdl.getInfo(args[1]);
        song = {
          title: songInfo.player_response.videoDetails.title,
          url: args[1]
        };
      } else {
        songInfo = await yts(args2);
        if(typeof songInfo.videos[0] === 'undefined' || validURL(args[1])) {
          return message.channel.send(':stop_sign: URL invalide ou Vidéo introuvable..');
        } else {
          message.channel.send(`:mag: Recherche de \`\`${args2}\`\``)
          song = {
            title: songInfo.videos[0].title,
            url: songInfo.videos[0].url
          };
        }
      }      

      if (!serverQueue) {
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          this.play(message, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      } else {
        serverQueue.songs.push(song);
        return message.channel.send(
          `:notepad_spiral: \`\`${song.title}\`\` a été ajouté à la file d'attente !`
        );
      }
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  },

  play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
      })
      .on("error", error => {
        console.log(error);
        if(error.toString().startsWith("Error: input stream: Video unavailable")){
          message.channel.send(':stop_sign: Cette vidéo de ne peux être lu car elle est bloqué pour moi :(');
          serverQueue.songs.shift();
          this.play(message, serverQueue.songs[0]);
        }
      });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`:headphones: En écoute : **${song.title}**`);
  }
};
