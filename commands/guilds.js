module.exports = function(bot) {
  bot.registerCommand("guilds", (msg) => {
    var guilds = [];
    bot.guilds.find(guild => {
      guilds.push(guild.name);
    });
    console.log(JSON.stringify(guilds));
  });
};
