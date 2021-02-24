var AuthKeys = {};
var DataKeys = {};
try {
    AuthKeys = require("./src/authKeys.json");
} catch (e){
	console.log("Aucun fichier 'authKeys.json' trouvé.. Dupliquez le fichier 'authKeys.json.example' renommez le 'authKeys.json' et remplissez le avec vos valeurs.");
}

try {
    DataKeys = require("./src/dataKeys.json");
} catch (e){
	console.log("Aucun fichier 'dataKeys.json' trouvé.. Dupliquez le fichier 'dataKeys.json.example' renommez le 'authKeys.json' et remplissez le avec vos valeurs.");
}


exports.getAuthKeys = () => {
    return AuthKeys;
}

exports.getDataKeys = () => {
    return DataKeys;
}