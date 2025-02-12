const Discord = require('discord.js-selfbot-v13');

module.exports.run = async (client, message, args) => {   
  const embed = new Discord.MessageEmbed()
        .setTitle("Reboot")
        .setDescription("Yeniden başlatılıyor...")
        .setColor(0xFF4500);

  let owners = process.env.OWNER.split(',');

  if (!owners.includes(message.author.id))  {
    embed
      .setTitle("Reboot")
      .setDescription("Bot tekrar aktif hale geldi!");

    return message.channel.send(embed);
  }

  await message.channel.send(embed);

  process.exit(1);
};

exports.help = {
  name: "reboot",
  category: "Staff",
  description: "Reboot the bot.",
  usage: "~reboot"
};