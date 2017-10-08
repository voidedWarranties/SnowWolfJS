module.exports = function(bot) {
	bot.registerCommand("audit", (msg, amount) => {
		if(amount <= 5 && amount != "") {
			msg.channel.guild.getAuditLogs(amount).then((results) => {
				// console.log(results.entries);
				for(var i = 0; i < results.entries.length; i++) {
					var entry = results.entries[i];
					let entry_fields = [
						{
							name: "id",
							value: `${entry.id}`,
							inline: true
						},
						{
							name: "type",
							value: `${entry.actionType}`,
							inline: true
						},
						{
							name: "user",
							value: `${entry.user.username}#${entry.user.discriminator}`,
							inline: true
						},
						{
							name: "target",
							value: `${entry.target.id}`,
							inline: true
						},
						{
							name: "before",
							value: `${JSON.stringify(entry.before)}`,
							inline: true
						},
						{
							name: "after",
							value: `${JSON.stringify(entry.after)}`,
							inline: true
						}
					];
					msg.channel.createMessage({
						embed: {
							title: "GuildAuditLogEntry",
							color: 0x3366FF,
							fields: entry_fields,
							image: {
								url: "http://i.voidedXD.xyz/i/LIbFe-17-10-07--16-04-06.png"
							}
						}
					});
				}
			}).catch(function(error) {
				console.log("Some error happened :(");
			});
		} else {
			msg.channel.createMessage("Request Too Large!");
		}
	});
};
