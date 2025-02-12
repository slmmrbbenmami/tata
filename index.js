const fs = require("fs");
const chalk = require("chalk");
const imghash = require("imghash");
const request = require("request").defaults({ encoding: null });
const express = require("express");
const { Client } = require("discord.js-selfbot-v13");
const client = new Client();
const db = require("./Pokemons.json");

// **TOKENİNİ BURAYA YAZ**
const TOKEN = "hi";

// **Express.js Sunucusu Aç (Uptime Robot İçin)**
const app = express();
app.get("/", (req, res) => {
    res.send("Bot Aktif! ✅");
});
app.listen(3000, () => {
    console.log(chalk.green("🌍 Web sunucusu çalışıyor! Botun kapanmaması için UptimeRobot kullanabilirsin."));
});

client.on("ready", async () => {
    console.log(chalk.green(`✅ Selfbot giriş yaptı: ${client.user.tag}`));
});

client.on("messageCreate", async (message) => {
    try {
        // **Ping Komutu**
        if (message.content.toLowerCase() === "ping") {
            message.channel.send("Pong! ✅");
            console.log(chalk.blue("✅ Ping komutu çalıştı!"));
        }

        // **Pokémon Mesajlarını Dinle**
        if (message.author.id === "669228505128501258") { // Pokémon bot ID
            console.log(chalk.yellow("🔍 Pokémon mesajı tespit edildi!"));

            // **Pokémon Görseli Var mı?**
            if (message.embeds.length > 0) {
                let embed = message.embeds[0];
                if (embed.image) {
                    let imageUrl = embed.image.url;
                    console.log(chalk.cyan(`📸 Pokémon görseli bulundu: ${imageUrl}`));

                    // **Görselin Hash Kodunu Al**
                    request(imageUrl, async (err, res, body) => {
                        if (err) return console.log(chalk.red("❌ Görsel alınamadı."));

                        imghash.hash(body).then((hash) => {
                            let result = db[hash];

                            if (result === undefined) {
                                console.log(chalk.red(`❗ Bilinmeyen Pokémon tespit edildi. Hash: ${hash}`));
                                message.channel.send(`❓ Yeni Pokémon tespit edildi! Hash: ${hash} Lütfen tanımlayın.`);
                                db[hash] = "Bilinmeyen Pokémon";
                                fs.writeFileSync("./Pokemons.json", JSON.stringify(db, null, 2), "utf-8");
                            } else {
                                message.channel.send(`.c ${result}`);
                            }
                        });
                    });
                }
            }
        }
    } catch (error) {
        console.log(chalk.red(`❌ Hata: ${error}`));
    }
});

// **Selfbotu Başlat**
client.login(TOKEN);
