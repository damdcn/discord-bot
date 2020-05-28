const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./discord/Client');

// Déclaration du bot
const botDiscord = new Client();
// Connextion du bot
botDiscord.login('token');
// Déclaration du tableau de commande
botDiscord.commands = new Discord.Collection();
// Initialisation du tableau de commande
const commandFiles = fs.readdirSync('./discord/commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const c = require(`./discord/commands/${file}`);
    botDiscord.commands.set(c.name, c);
}


botDiscord.on('ready', () => {
    console.log(`Logged in as ${botDiscord.user.tag}!`);
  });

const prefix = "!";

function commandParser(message){
    let prefixEscaped = prefix.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    let regex = new RegExp("^" + prefixEscaped + "([a-zA-Z]+)\s?(.*)");
    return regex.exec(message);
}

// Exécution des commandes
botDiscord.on('message', function(message){

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    let fullCommand = commandParser(message.content);
    
    if(fullCommand){
        let commandName = fullCommand[1];
        let param = fullCommand[2];
        let command = botDiscord.commands.get(commandName);
        
        try {
            command.execute(botDiscord, message);
        } catch(e) {
            console.error(e);
            message.channel.send(':stop_sign: Commande invalide ou erreur lors de l\'exécution de la commande');
        }
    }
})

// Donne un rôle et souhaite bienvenue à chaque nouvel utilisateur
botDiscord.on('guildMemberAdd', function(member){
    const r = member.guild.roles.cache.find(role => role.name === "Membre");
    if(r) member.roles.add(r);
    member.createDM().then(function(channel){
        return channel.send('Salut '+member.displayName+' !\nBienvenue sur le serveur Discord de <votre nom> !');
    });
})