import { AttachmentBuilder, EmbedBuilder } from "discord.js";

export type DiscordEmbedWithImage = {
  embeds: EmbedBuilder[];
  files?: AttachmentBuilder[];
};
