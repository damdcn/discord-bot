const https = require('https'); 

const apiKey = 'YOUR API KEY HERE';

module.exports = {
    name : 'meteo',
    description: 'Donne la météo selon la ville',
    format: ':round_pushpin: ``!meteo`` : Affiche la météo actuelle d\'une ville\n'+
            '__*Utilisation :*__ !meteo <ville>\n',
    execute(bot, message){
        
        const args = message.content.split(" ");
        if(!args[1]) return message.channel.send(':stop_sign: Veuillez renseignez une ville (ex: !meteo Paris)');

        var url = 'https://api.openweathermap.org/data/2.5/weather?q='+args[1].trim()+'&units=metric&appid='+apiKey+'&lang=fr';

        https.get(url, function(res){
            var body = '';

            res.on('data', function(chunk){
                body += chunk;
            });

            res.on('end', function(){
                var obj = JSON.parse(body);
                if(obj.cod == 200){
                    var temp = Math.round(obj.main.temp);
                    var condition = obj.weather[0].description[0].toUpperCase()+obj.weather[0].description.slice(1);
                    var name = obj.name;
                    message.channel.send(":sun_with_face: Aujourd'hui à "+name+" : "+condition+", "+temp+"°C !");
                } else if (obj.cod == 404) {
                    message.channel.send(":sun_with_face: Désolé, "+args[1].trim()+" est introuvable..");
                } else {
                    message.channel.send(":sun_with_face: Désolé, une erreur est survenue lors de la recherche pour \""+args[1].trim()+"\"");
                }
            });
        }).on('error', function(e){
            console.log("Got an error: ", e);
        });
    },
};