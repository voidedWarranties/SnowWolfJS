module.exports = function(bot) {
	bot.registerCommand("info", (msg) => {
		bot.createMessage(msg.channel.id, "SnowWolfJS Indev: https://github.com/voidedWarranties/SnowWolfJS");
	});
};
