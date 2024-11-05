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
