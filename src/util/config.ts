import { EmbedBuilder } from "discord.js";

export const COLORS = {
  success: 0x8ef266,
  warning: 0xfada69,
  danger: 0xfa7069,
};

export const EMBED_FIELDS = {
  footer:
    'Please use the "/report" command to submit any feedback you may have.',
};

export const getDefaultEmbed = () =>
  new EmbedBuilder()
    .setColor(COLORS.success)
    .setFooter({ text: EMBED_FIELDS.footer });
