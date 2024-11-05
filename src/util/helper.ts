import {
  Message,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
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

  const select = new StringSelectMenuBuilder()
    .setCustomId("suggested")
    .setPlaceholder("Make a selection");

  for (let i = 0; i < similarMoves.length; i++) {
    select.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel((i + 1).toString())
        .setValue((i + 1).toString())
    );
  }
  const row: any = new ActionRowBuilder().addComponents(select);

  const response = await message.reply({
    embeds: [similarMovesEmbed],
    components: [row],
  });

  const collectorFilter = (i: any) => i.user.id == message.author.id;

  try {
    const confirmation: any = await response.awaitMessageComponent({
      filter: collectorFilter,
      time: 60_000,
    });
    const selectedValue = confirmation.values[0];

    if (selectedValue < 1 || selectedValue > similarMoves.length) {
      confirmation.update({ content: "Invalid selection.", components: [] });
      return;
    }

    const attackData = similarMoves[selectedValue - 1];
    console.log("Attackdata", attackData);

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
  } catch {
    const timeUpEmbed = similarMovesEmbed.setFooter({
      text: `No decision was made by the time this expired.`,
    });
    await response.edit({ embeds: [timeUpEmbed], components: [] });
  }
}
