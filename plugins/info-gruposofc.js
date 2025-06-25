import fetch from 'node-fetch'

let handler = async (m, { conn }) => {

  const namegrupo = 'Grupo Oficial'
  const gp1 = 'https://chat.whatsapp.com/JUraAM0lZyB89FXbsywP9m' // ← tu link real

  const namechannel = 'Reclutamiento Style Drift Sur'
  const channel = 'https://chat.whatsapp.com/GqeWGK3XBD58hdGY1djuKB' // ← tu canal real

  const dev = '👾 Desarrollador: @yallico drift'
  const catalogo = 'https://files.catbox.moe/0mervt.jpeg' // o './media/grupos.jpg'
  const emojis = '📡'

  let grupos = `
╭─⟪ *🌐 GRUPOS OFICIALES * 
│
│ ⚔️ *${namegrupo}*
│ ${gp1}
│
│ ⚡ *${namechannel}*
│ ${channel}
│
│ ${dev}
╰─────────────────╯
`

  await conn.sendFile(m.chat, catalogo, 'grupos.jpg', grupos.trim(), m)
  await m.react(emojis)
}

handler.help = ['grupos']
handler.tags = ['info']
handler.command = ['grupos', 'links', 'groups']

export default handler
