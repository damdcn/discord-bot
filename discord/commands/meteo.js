const { MessageEmbed } = require('discord.js');
const { JSDOM } = require( "jsdom" );
const { exit } = require('process');
const { getAuthKeys } = require('../../tokens');
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

const apiKey = getAuthKeys().api_key_openweathermap;


function getDateUnix(str){
    var now = new Date();
    var dd = String(now.getDate()).padStart(2, '0');
    var dd1 = String(now.getDate() +1).padStart(2, '0');
    var mm = String(now.getMonth() + 1).padStart(2, '0');
    var yyyy = now.getFullYear();

    if(str==="today"){
        var strDate = yyyy+'-'+mm+'-'+dd+'T00:00:00';
        var today = Date.parse(strDate);
        return today/1000;
    } else {
        var strDate = yyyy+'-'+mm+'-'+dd1+'T00:00:00';
        var today = Date.parse(strDate);
        return today/1000;
    }
}

module.exports = {
    name : 'meteo',
    description: 'Donne la météo selon la ville',
    format: ':round_pushpin: ``!meteo`` : Affiche la météo actuelle d\'une ville\n'+
            '__*Utilisation :*__ !meteo <option> <ville>\n'+
            '\u2004\u2004\u2004\u2004\u2004\u2004\u2004options : NULL => météo actuelle\n'+
            '\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004-d ou -demain => météo de demain\n'+
            '\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004\u2004-s ou -semaine => météo de la semaine\n',
    execute(bot, message){
        
        const args = message.content.split(" ");
        var where = "";
        var when = 0; // 0: now, 1:today, 2: tomorrow, 3: week

        for (i=1; i<args.length;i++) { // check for options
            if(args[i].startsWith('-')){
                if (args[i] === "-a" || args[i] === "-aujourdhui") when = 1;
                if (args[i] === "-d" || args[i] === "-demain") when = 2;
                if (args[i] === "-s" || args[i] === "-semaine") when = 3;
            } else {
                where += args[i].trim();
            }
        }
    
        if(where === "") return message.channel.send(':stop_sign: Veuillez renseignez une ville (ex: !meteo Paris)');

        

        var url;
        switch (when) {
            case 0: // weather now
                url = 'http://api.openweathermap.org/data/2.5/weather?q='+where+'&units=metric&appid='+apiKey+'&lang=fr';
                $.getJSON(url, function(obj){
                    if(obj.cod == 200){
                        var temp = Math.round(obj.main.temp);
                        var condition = obj.weather[0].description[0].toUpperCase()+obj.weather[0].description.slice(1);
                        var icon = obj.weather[0].icon;
                        var name = obj.name;
                        embed = new MessageEmbed()
                            .setColor("00e608")
                            .setAuthor(`Météo de ${bot.user.username}`, 'https://lh3.googleusercontent.com/JMFFqxbuvrYd4Zk1-q49ylH4ymby6OXUTQvVJnleBjOhUXZKFvRCXj5bBVFMu5o5UOk=s180')
                            .setThumbnail("http://openweathermap.org/img/w/"+icon+".png")
                            .setDescription(`En ce moment à **${name}** :
                                            ${condition}, ${temp}°C !\n`)
                        message.channel.send(embed);
                    } else if(obj.cod == 404) {
                        embed = new MessageEmbed()
                            .setColor("00e608")
                            .setAuthor(`Météo de ${bot.user.username}`, 'https://lh3.googleusercontent.com/JMFFqxbuvrYd4Zk1-q49ylH4ymby6OXUTQvVJnleBjOhUXZKFvRCXj5bBVFMu5o5UOk=s180')
                            .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Dialog-error-round.svg/1200px-Dialog-error-round.svg.png")
                            .setDescription(`Désolé, **${where}** est introuvable..\n`)
                        message.channel.send(embed);
                    } else {
                        embed = new MessageEmbed()
                            .setColor("00e608")
                            .setAuthor(`Météo de ${bot.user.username}`, 'https://lh3.googleusercontent.com/JMFFqxbuvrYd4Zk1-q49ylH4ymby6OXUTQvVJnleBjOhUXZKFvRCXj5bBVFMu5o5UOk=s180')
                            .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Dialog-error-round.svg/1200px-Dialog-error-round.svg.png")
                            .setDescription(`Désolé, une erreur est survenue lors de la recherche pour **${where}**\n`)
                        message.channel.send(embed);
                    }
                });
                break;
            case 1: // weather today (not yet implemented)
                url = 'http://api.openweathermap.org/data/2.5/forecast?q='+where+'&units=metric&appid='+apiKey+'&lang=fr';
                embed = new MessageEmbed()
                    .setColor("00e608")
                    .setAuthor(`Météo de ${bot.user.username}`, 'https://lh3.googleusercontent.com/JMFFqxbuvrYd4Zk1-q49ylH4ymby6OXUTQvVJnleBjOhUXZKFvRCXj5bBVFMu5o5UOk=s180')
                    .setDescription(`*not yet implemented*\n`)
                message.channel.send(embed);
                break;
            case 2: // weather tomorrow (+24h from now)
                url = 'http://api.openweathermap.org/data/2.5/forecast?q='+where+'&units=metric&appid='+apiKey+'&lang=fr';
                $.getJSON(url, function(obj){
                    if(obj.cod == 200){
                        var temp = Math.round(obj.list[8].main.temp);
                        var condition = obj.list[8].weather[0].description[0].toUpperCase()+obj.list[8].weather[0].description.slice(1);
                        var icon = obj.list[8].weather[0].icon;
                        var name = obj.city.name;
                        embed = new MessageEmbed()
                            .setColor("00e608")
                            .setAuthor(`Météo de ${bot.user.username}`, 'https://lh3.googleusercontent.com/JMFFqxbuvrYd4Zk1-q49ylH4ymby6OXUTQvVJnleBjOhUXZKFvRCXj5bBVFMu5o5UOk=s180')
                            .setThumbnail("http://openweathermap.org/img/w/"+icon+".png")
                            .setDescription(`Demain à **${name}** :
                                            ${condition}, ${temp}°C !\n`)
                        message.channel.send(embed);
                    } else if(obj.cod == 404) {
                        embed = new MessageEmbed()
                            .setColor("00e608")
                            .setAuthor(`Météo de ${bot.user.username}`, 'https://lh3.googleusercontent.com/JMFFqxbuvrYd4Zk1-q49ylH4ymby6OXUTQvVJnleBjOhUXZKFvRCXj5bBVFMu5o5UOk=s180')
                            .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Dialog-error-round.svg/1200px-Dialog-error-round.svg.png")
                            .setDescription(`Désolé, **${where}** est introuvable..\n`)
                        message.channel.send(embed);
                    } else {
                        embed = new MessageEmbed()
                            .setColor("00e608")
                            .setAuthor(`Météo de ${bot.user.username}`, 'https://lh3.googleusercontent.com/JMFFqxbuvrYd4Zk1-q49ylH4ymby6OXUTQvVJnleBjOhUXZKFvRCXj5bBVFMu5o5UOk=s180')
                            .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Dialog-error-round.svg/1200px-Dialog-error-round.svg.png")
                            .setDescription(`Désolé, une erreur est survenue lors de la recherche pour **${where}**\n`)
                        message.channel.send(embed);
                    }
                });
                break;
            case 3: // weather of the week (7 days from today)
                var lon, lat, name;
                $.getJSON('https://api.openweathermap.org/data/2.5/weather?q='+where+'&units=metric&appid='+apiKey+'&lang=fr', function(data){
                    if(data.cod == 200){
                        lon = data.coord.lon;
                        lat = data.coord.lat;
                        name = data.name;

                        url = 'http://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=current,minutely,hourly&units=metric&appid='+apiKey+'&lang=fr';
                        $.getJSON(url, function(dt){
                            if(dt.daily){
                                var temps = [], conditions = [], icons = [], times = [];
                                for(i=0;i<7;i++){
                                    temps.push(Math.round(dt.daily[i].temp.day));
                                    conditions.push(dt.daily[i].weather[0].description[0].toUpperCase()+dt.daily[i].weather[0].description.slice(1));
                                    icons.push(dt.daily[i].weather[0].icon);
                                    times.push(dt.daily[i].dt);
                                }
                                var days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
                                var embed = new MessageEmbed()
                                    .setColor("00e608")
                                    .setAuthor(`Météo de ${bot.user.username}`, 'https://lh3.googleusercontent.com/JMFFqxbuvrYd4Zk1-q49ylH4ymby6OXUTQvVJnleBjOhUXZKFvRCXj5bBVFMu5o5UOk=s180')
                                    //.setThumbnail("http://openweathermap.org/img/w/"+icon+".png")
                                    .setDescription(`Cette semaine à **${name}** :\n`)
                                    .addField('Aujourd\'hui',`${conditions[0]}, ${temps[0]}°C !\n`)
                                    .addField('Demain',`${conditions[1]}, ${temps[1]}°C !\n`)
                                    for(i=2;i<7;i++){
                                        embed.addField(days[(new Date(times[i]*1000)).getDay()],`${conditions[i]}, ${temps[i]}°C !\n`)
                                    }
                                message.channel.send(embed);
                            } else {
                                embed = new MessageEmbed()
                                    .setColor("00e608")
                                    .setAuthor(`Météo de ${bot.user.username}`, 'https://lh3.googleusercontent.com/JMFFqxbuvrYd4Zk1-q49ylH4ymby6OXUTQvVJnleBjOhUXZKFvRCXj5bBVFMu5o5UOk=s180')
                                    .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Dialog-error-round.svg/1200px-Dialog-error-round.svg.png")
                                    .setDescription(`Désolé, une erreur est survenue lors de la recherche pour **${where}**\n`)
                                message.channel.send(embed);
                            }
                        });
                    } else if(data.cod == 404) {
                        embed = new MessageEmbed()
                            .setColor("00e608")
                            .setAuthor(`Météo de ${bot.user.username}`, 'https://lh3.googleusercontent.com/JMFFqxbuvrYd4Zk1-q49ylH4ymby6OXUTQvVJnleBjOhUXZKFvRCXj5bBVFMu5o5UOk=s180')
                            .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Dialog-error-round.svg/1200px-Dialog-error-round.svg.png")
                            .setDescription(`Désolé, **${where}** est introuvable..\n`)
                        message.channel.send(embed);
                    } else {
                        embed = new MessageEmbed()
                            .setColor("00e608")
                            .setAuthor(`Météo de ${bot.user.username}`, 'https://lh3.googleusercontent.com/JMFFqxbuvrYd4Zk1-q49ylH4ymby6OXUTQvVJnleBjOhUXZKFvRCXj5bBVFMu5o5UOk=s180')
                            .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Dialog-error-round.svg/1200px-Dialog-error-round.svg.png")
                            .setDescription(`Désolé, une erreur est survenue lors de la recherche pour **${where}**\n`)
                        message.channel.send(embed);
                    }
                });
                break;
        }
    },
};