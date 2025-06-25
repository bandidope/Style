const handler = async (m, { conn }) => {
  const texto = `
 _*Reclutamiento Style Drift*_

\`\`\`Style Drift :\`\`\`
https://chat.whatsapp.com/GqeWGK3XBD58hdGY1djuKB

🔗 *Grupo oficial del bot:* https://chat.whatsapp.com/JUraAM0lZyB89FXbsywP9m
  `.trim()

  await conn.reply(m.chat, texto, m)
}

handler.help = ['script']
handler.tags = ['info']
handler.command = ['script']

export default handler
