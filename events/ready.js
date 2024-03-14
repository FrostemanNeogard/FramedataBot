module.exports = {
  name: "ready",
  run: async (bot) => {
    const { client } = bot;
    client.user.setPresence({
      activities: [{ name: "TEKKEN 9" }],
      status: "online",
    });

    // Log when bot goes online
    await client.guilds.fetch();
    let serverCount = client.guilds.cache.size;
    console.log(`${client.user.tag} is now online, in ${serverCount} servers!`);
  },
};
