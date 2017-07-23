const eris = require("eris");
const fs = require("fs");

const config = require("./config.json");

var prefix = config.prefix;
var bot = new eris.CommandClient(config.token, {}, {
	defaultHelpCommand: false,
	prefix: prefix
});

bot.on("ready", () => {
	console.log("Hey, that's pretty good");
});

bot.connect();
