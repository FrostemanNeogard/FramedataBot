module.exports = {
  name: "ready",
  run: async (bot) => {
    const { client } = bot;
    client.user.setPresence({
      activities: [{ name: "!help" }],
      status: "online",
    });

    // Log when bot goes online
    console.log(`${bot.client.user.tag} is now online!`);
  },
};
