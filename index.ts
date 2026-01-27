// Require the necessary discord.js classes
import {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  MessageFlags,
} from "discord.js";
import type { Client as ClientType } from "discord.js";

const fs = require("node:fs");
const path = require("node:path");
const { MongoClient } = require("mongodb");
const { unbanLengthCheckDatabase, getBans } = require("./database-helper");

// Extend Client with commands property
declare module "discord.js" {
  interface Client {
    commands: Collection<string, any>;
    cooldowns: Collection<string, any>;
    db: any;
  }
}

const mongoClient = new MongoClient(Bun.env.DATABASEURL);
await mongoClient.connect();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
// client.once(Events.ClientReady, (readyClient: ClientType<true>) => {
//   console.log(`Ready! Logged in as ${readyClient.user.tag}`);
// });

client.commands = new Collection();
client.cooldowns = new Collection();
client.db = await mongoClient.db(Bun.env.DATABASE_NAME);
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file: any) => file.endsWith(".js") || file.endsWith(".ts"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file: any) => file.endsWith(".js") || file.endsWith(".ts"));
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Log in to Discord with your client's token
setInterval(() => {
  unbanLengthCheckDatabase(client.db);
}, 1000 * 60);

let BANS = null;
setInterval(async () => {
  BANS = await getBans(client.db);
  console.log(BANS);
}, 1000 * 8);

client.login(Bun.env.DISCORD_TOKEN);
