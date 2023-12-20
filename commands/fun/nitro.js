module.exports = {
  name: "nitro",
  category: "fun",
  permissions: [],
  devCommand: false,
  run: async ({ client, msg, args }) => {
    const axios = require("axios");

    const url = "https://api.discord.gx.games/v1/direct-fulfillment";
    const payload = {
      partnerUserId:
        "2df0165dc6654f768a1f5fc8e2d8d732cf49beb01c3cbcded769a130594fc1cf",
    };

    const gxResponse = await axios.post(url, payload);
    const token = gxResponse.data.token;

    const nitroUrl = `https://discord.com/billing/partner-promotions/1180231712274387115/${token}`;

    return msg.reply(
      `WARNING: Always be INCREDIBLY careful when clicking links like this and ALWAYS be suspicious, no matter who it's from. Take all necessary precations to make sure you are not getting scammed. Discord will ask for payment details as they will bill you after the free period if you have not cancelled the subscription by then. After you've accepted the free nitro, immediately go into your discord settings and cancel the subscription. ${nitroUrl}`
    );
  },
};
