const { MessageEmbed } = require('discord.js');
const { JSDOM } = require( "jsdom" );
const { getAuthKeys } = require('../../tokens');
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

const authorization = getAuthKeys().api_key_twitch_authorization;
const clientId = getAuthKeys().api_key_twitch_client_id;

// add zero (ex: 8 -> 08, 4 -> 04, 12 -> 12)
function az(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

// format thousands and millions (ex: 1 500 -> 1.5K, 2 356 846 -> 2.3M)
function kFormatter(num) {
    return Math.abs(num) > 999999 ?
            Math.sign(num)*((Math.abs(num)/1000000).toFixed(1)) + 'M' :
            Math.abs(num) > 999 ?
                Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' :
                Math.sign(num)*Math.abs(num)
}

module.exports = {
    name : 'live',
    description: 'Renvoie le status d\'un live Twitch',
    format: ':round_pushpin: ``!live`` : Affiche les status d\'un live twitch\n'+
            '__*Utilisation :*__ !live <pseudo_twitch>\n',
    execute(bot, message){
        const args = message.content.split(" ");
        if(!args[1]) return message.channel.send(':stop_sign: Veuillez renseignez un pseudo (ex: !live JeanMi55)');

        let user_login = args[1].toLowerCase();
        /* Requête numéro 1 : infos stream */
        $.ajax({
            type : "GET",
            url : "https://api.twitch.tv/helix/streams?user_login="+user_login,
            headers : {
                'Authorization' : authorization,
                'Client-Id' : clientId
            },
            success: function(data){
                if(data.data[0]){
                    /* Requête numéro 2 : infos user */
                    $.ajax({
                        type : "GET",
                        url : "https://api.twitch.tv/helix/users?login="+user_login,
                        headers : {
                            'Authorization' : authorization,
                            'Client-Id' : clientId
                        },
                        success: function(data2){

                            let user_id = data2.data[0].id;
                            /* Requête numéro 3 : infos followers */
                            $.ajax({
                                type : "GET",
                                url : "https://api.twitch.tv/helix/users/follows?to_id="+user_id+"&first=1",
                                headers : {
                                    'Authorization' : authorization,
                                    'Client-Id' : clientId
                                },
                                success: function(data3){
                                    //pp_url = data2.data[0].profile_image_url;
                                    let followCount = kFormatter(data3.total);
                                    let d = new Date(data.data[0].started_at);
                                    let day = az(d.getDate());
                                    let month = az(d.getMonth()+1);
                                    let year = az(d.getFullYear());
                                    let hour = az(d.getHours());
                                    let minute = az(d.getMinutes());
                                    let second = az(d.getSeconds());
                                    let dateFr = day+"/"+month+"/"+year+" à "+hour+":"+minute+":"+second;
                                    const notificationMsgEmbeded = new MessageEmbed()
                                        .setColor('00e608')
                                        .setTitle(data.data[0].title)
                                        .setURL('https://twitch.tv/'+data.data[0].user_login)
                                        .setAuthor(data.data[0].user_name, data2.data[0].profile_image_url)
                                        //.setDescription('Some description here')
                                        .setThumbnail(data2.data[0].profile_image_url)
                                        .addFields(
                                            { name: '\u200B', value: '**Catégorie**\n'+data.data[0].game_name, inline: true },
                                            { name: '\u200B', value: '**Début**\n'+dateFr, inline: true },
                                            { name: '\u200B', value: '**Followers**\n'+followCount, inline: true },
                                            //{ name: 'Inline field title', value: 'Some value here', inline: true },
                                        )
                                        .setImage(data.data[0].thumbnail_url.substring(0, data.data[0].thumbnail_url.length - 20)+'320x180.jpg')
                                        .setFooter(bot.user.username)
                                        .setTimestamp();
                                    message.channel.send(notificationMsgEmbeded);
                                }
                            });
                        }
                    });
                } else {
                    return message.channel.send(':stop_sign: Cette chaîne n\'est pas en live..');
                }
            },
            error: function(errMsg){console.log(errMsg);}
        });        
    },
};