import { ReactionCollectorOptions, Message } from "discord.js";
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

  message.edit({ embeds: [similarMovesEmbed] });
  const sentMessage = await message.fetch();

  const reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
  for (let i = 0; i < similarMoves.length; i++) {
    sentMessage.react(reactions[i]);
  }

  const filter: ReactionCollectorOptions = {
    filter: (reaction: any) => {
      return false;
      // return (
      //   reactions.includes(reaction.emoji.name) &&
      //   user.id === interaction.user.id
      // );
    },
  };

  const collector = sentMessage.createReactionCollector(filter);

  setTimeout(async () => {
    const attackData = e.getSimilarMoves()[0];
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

    const postSelectionEmbed = similarMovesEmbed;
    postSelectionEmbed.setFooter({
      text: "A selection has already been made.",
    });
    message.edit({ embeds: [postSelectionEmbed] });

    if (!thumbnailImage) {
      message.reply({
        embeds: [responseEmbed],
      });
      return;
    }

    message.reply({
      embeds: [responseEmbed],
      files: [thumbnailImage],
    });
    return;
  }, 2000);
}
