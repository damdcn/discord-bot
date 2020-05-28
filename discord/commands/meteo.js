const https = require('https'); 

module.exports = {
    name : 'meteo',
    description: 'Donne la météo selon la ville',
    format: ':round_pushpin: ``!meteo`` : Affiche la météo actuelle d\'une ville\n'+
            '__*Utilisation :*__ !meteo <ville>\n',
    execute(bot, message){
        
        const args = message.content.split(" ");
        if(!args[1]) return message.channel.send(':stop_sign: Veuillez renseignez une ville (ex: !meteo Paris)');

        var url = 'https://www.prevision-meteo.ch/services/json/'+args[1].trim();
        var loadMsg = null;
        message.channel.send(':arrows_counterclockwise: Recherche pour la ville : ``'+args[1]+'``').then(sent => {
            loadMsg = sent;
        });
        message.channel.startTyping();
        https.get(url, function(res){
            var body = '';

            res.on('data', function(chunk){
                body += chunk;
            });

            res.on('end', function(){
                var obj = JSON.parse(body);
                if(typeof obj.current_condition != 'undefined'){
                    var temp = obj.current_condition.tmp;
                    var condition = obj.current_condition.condition
                    var name = obj.city_info.name;
                    message.channel.stopTyping();
                    loadMsg.edit(":sun_with_face: Aujourd'hui à "+name+" : "+condition+", "+temp+"°C !");
                } else {
                    message.channel.stopTyping();
                    loadMsg.edit(":sun_with_face: Désolé, "+args[1].trim()+" est introuvable..");
                }
            });
        }).on('error', function(e){
            console.log("Got an error: ", e);
        });
    },
};