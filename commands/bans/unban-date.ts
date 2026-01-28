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
        .setDescription("Unban date in format, e.g., 5D, 12H, 1Y, etc.")
        .setRequired(true),
    ),
  async execute(interaction: any) {
    const userid = interaction.options.getString("userid") ?? undefined;
    let unbandate = interaction.options.getString("unbandate") ?? undefined;
    // Unbandate format: number followed by D, H, M, Y, S (days, hours, minutes, years, seconds)

    if (!userid || !unbandate) {
      let convertedDate = formatUnbanDate(unbandate);
      console.log("Converted date:", convertedDate);
      await interaction.reply({
        content: "UserID and UnbanDate are required.",
        flags: 1 << 6, // Ephemeral
      });
      return;
    }
    // await updateUnbanDate(interaction.client.db, {
    //   UserID: userid,
    //   UnbanDate: unbandate,
    // });
    await interaction.reply({
      content: `Unban date for user ${userid} set to ${formatUnbanDate(
        unbandate,
      )}.`,
      flags: 1 << 6, // Ephemeral
    });
  },
};
function formatUnbanDate(UnbanDate: any): string {
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
