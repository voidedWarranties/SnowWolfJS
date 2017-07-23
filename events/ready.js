module.exports = function(bot) {
	console.log("Hello, Discord! Currently logged in as: " + bot.user.username + "#" + bot.user.discriminator + ".\n" + "Serving " + bot.guilds.size + " guilds and " + bot.users.size + " users.");
};
