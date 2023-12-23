const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "report",
  category: "misc",
  permissions: [],
  devCommand: false,
  run: async ({ client, msg, args }) => {
    const feedback = msg.content;
    const feedbackUserId = process.env.OWNER_ID;
    const feedbackReciever = await client.users.fetch(feedbackUserId, false);
    feedbackReciever.send(`Feedback recieved by ${msg.author}: ${feedback}`);
    return msg.reply("Your feedback has been sent!");
  },
};
