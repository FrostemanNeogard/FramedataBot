import { AttachmentBuilder, EmbedBuilder } from "discord.js";

export type DiscordEmbedResponse = {
  embeds: EmbedBuilder[];
  files?: AttachmentBuilder[];
};
