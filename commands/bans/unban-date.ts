const { updateUnbanDate } = require("../../database-helper");

const {
  SlashCommandBuilder,
  LabelBuilder,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  TextDisplayBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  WebhookClient,
} = require("discord.js");

module.exports = {
  roleNeeded: "418694554674266113",
  data: new SlashCommandBuilder()
    .setName("unban-date")
    .setDescription("Sets the unban date for a user's ban.")
    .addStringOption((option: any) =>
      option
        .setName("userid")
        .setDescription("Roblox UserID")
        .setRequired(true),
    )
    .addStringOption((option: any) =>
      option
        .setName("unbandate")
        .setDescription(
          "Unbandate format: number followed by D, H, M, Y, S (days, hours, minutes, years, seconds)",
        )
        .setRequired(true),
    ),
  async execute(interaction: any) {
    const userid = interaction.options.getString("userid") ?? undefined;
    let unbandate = interaction.options.getString("unbandate") ?? undefined;
    // Unbandate format: number followed by D, H, M, Y, S (days, hours, minutes, years, seconds)

    if (!userid || !unbandate) {
      await interaction.reply({
        content: "UserID and UnbanDate are required.",
        flags: 1 << 6, // Ephemeral
      });
      return;
    }
    let date = formatUnbanDate(unbandate);
    await updateUnbanDate(interaction.client.db, {
      UserID: userid,
      UnbanDate:
        parseInt(unbandate) === 0
          ? 0
          : new Date(formatUnbanDate(unbandate)).getTime(),
    });
    await interaction.reply({
      content: `Unban date for user ${userid} set to ${formatUnbanDate(
        unbandate,
      )}.`,
      flags: 1 << 6, // Ephemeral
    });
    const webhookClient = new WebhookClient({
      url: Bun.env.DISCORD_BAN_LOG_WEBHOOK_URL,
    });
    await webhookClient.send({
      embeds: [
        {
          title: "Unban Date Updated",
          color: 0x00ff00,
          fields: [
            {
              name: "UserID",
              value: userid,
              inline: true,
            },
            {
              name: "New Unban Date",
              value: formatUnbanDate(unbandate),
              inline: true,
            },
          ],
        },
      ],
      content: `Unban date for user ${userid} set to ${formatUnbanDate(
        unbandate,
      )}. by ${interaction.user.tag} (${interaction.user.id})`,
    });
  },
};
function formatUnbanDate(UnbanDate: any): string {
  if (UnbanDate === 0) return "Permanent";
  const durationRegex = /(\d+)([DHMYS])/;
  const match = UnbanDate.toString().toUpperCase().match(durationRegex);
  if (!match) return "";

  const value = parseInt(match[1]);
  const unit = match[2];

  const now = new Date();
  let unbanDate = new Date(now);

  switch (unit) {
    case "D":
      unbanDate.setDate(now.getDate() + value);
      break;
    case "H":
      unbanDate.setHours(now.getHours() + value);
      break;
    case "M":
      unbanDate.setMinutes(now.getMinutes() + value);
      break;
    case "S":
      unbanDate.setSeconds(now.getSeconds() + value);
      break;
    case "Y":
      unbanDate.setFullYear(now.getFullYear() + value);
      break;
  }

  return unbanDate.toISOString();
  if (!UnbanDate) return "";
  const date = new Date(UnbanDate);
  return date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
}
