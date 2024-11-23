import {
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { MoveNotFoundError } from "../exceptions/similarMoves";
import { FramedataService } from "../service/framedataService";

export function generateInputString(input: string, name: string) {
  return name?.length > 0 ? `${input} (${name})` : input;
}

export function logCommandUsage(
  commandName: string | undefined | null,
  userName: string | undefined | null,
  channelId: string | undefined | null,
  serverName: string | undefined | null
) {
  console.log(
    `\nCommand: "${commandName}"\n\b was run by: "${userName}" \n\b in channel: "${channelId}" \n\b in server: "${serverName}" \n\b at: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`
  );
}

export async function handleSimilarMovesNonInteraction(
  e: MoveNotFoundError,
  message: Message<boolean>
) {
  const framedataService = new FramedataService();
  const similarMovesEmbed = e.getEmbed();
  const similarMoves = e.getSimilarMoves();

  const row: any = new ActionRowBuilder();
  for (let i = 0; i < similarMoves.length; i++) {
    const buttonComponent = new ButtonBuilder()
      .setCustomId((i + 1).toString())
      .setLabel((i + 1).toString())
      .setStyle(ButtonStyle.Primary);
    row.addComponents(buttonComponent);
  }

  const response = await message.reply({
    embeds: [similarMovesEmbed],
    components: [row],
  });

  const collectorFilter = (i: any) => i.user.id == message.author.id;

  const confirmation: any = await response.awaitMessageComponent({
    filter: collectorFilter,
    time: 360_000,
  });
  const selectedValue = Number(confirmation.customId);

  if (selectedValue < 1 || selectedValue > similarMoves.length) {
    confirmation.update({ content: "Invalid selection.", components: [] });
    return;
  }

  const attackData = similarMoves[selectedValue - 1];
  const thumbnailImage = await framedataService.getCharacterThumbnail(
    e.getCharacterCode(),
    e.getGameCode()
  );
  const responseEmbed = framedataService.createFramedataEmbed(
    attackData,
    e.getCharacterCode(),
    thumbnailImage
  );

  await confirmation.update({
    embeds: [responseEmbed],
    files: [thumbnailImage],
    components: [],
  });
}
