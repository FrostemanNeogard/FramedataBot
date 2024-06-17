import { EmbedBuilder } from "discord.js";

export const COLORS = {
  success: 0x00ff00,
  warning: 0xffff00,
  danger: 0xff0000,
};

export const EMBED_FIELDS = {
  footer: "Please use the report command to submit any feedback you may have.",
};

export const getDefaultEmbed = () =>
  new EmbedBuilder()
    .setColor(COLORS.success)
    .setFooter({ text: EMBED_FIELDS.footer });
