module.exports = function(bot) {
	console.log(`Hello, Discord! Currently logged in as: ${bot.user.username}#${bot.user.discriminator}.\nServing ${bot.guilds.size} guilds and ${bot.users.size} users.`);
	game = {
		name: "Hello Discord",
		type: 1,
		url: "https://twitch.tv/."
	};
	bot.editStatus("online", game);
};
