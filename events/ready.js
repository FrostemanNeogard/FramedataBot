module.exports = {
  name: "ready",
  run: async (bot) => {
    // Log when bot goes online
    console.log(`${bot.client.user.tag} is now online!`);
  },
};
