const eris = require("eris");
const fs = require("fs");

const config = require("./config.json");

const events = {
	ready: require("./events/ready.js")
};

var prefix = config.prefix;
var bot = new eris.CommandClient(config.token, {}, {
	defaultHelpCommand: false,
	prefix: prefix
});

bot.on("ready", () => {
	console.log("SnowWolf, Copyright © 2017 voidedXD & SnowWolf Team. Licensed under GPL-3.0.");
	events.ready(bot);

	fs.readdir(__dirname + "/./commands/", (err, commands) => {
		if(err) {
			console.log("Error getting commands " + err);
		}
		commands.forEach(commandFile => {
			const command = require(__dirname + "/./commands/" + commandFile);
			command(bot);
		});
	});
});

bot.connect();
