import { xpRange } from '../lib/levelling.js'

const textCyberpunk = (text) => {
  const charset = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ',
    h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ',
    o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ',
    v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
  }
  return text.toLowerCase().split('').map(c => charset[c] || c).join('')
}

let tags = {
  'main': textCyberpunk('sistema'),
  'group': textCyberpunk('grupos'),
}

const defaultMenu = {
  before: `╭─[𝗘𝗦𝗧𝗔𝗗𝗢 𝗗𝗘 𝗨𝗦𝗨𝗔𝗥𝗜𝗢]─╮
│ 📊 𝗡𝗜𝗩𝗘𝗟: %level
│ ⚡ 𝗘𝗫𝗣: %exp / %maxexp
│ 🧮 𝗨𝗦𝗨𝗔𝗥𝗜𝗢𝗦: %totalreg
│ ⏱ 𝗧𝗜𝗘𝗠𝗣𝗢 𝗔𝗖𝗧𝗜𝗩𝗢: %muptime
╰──────────────────╯

🧬 *𝗠𝗢𝗗𝗢 𝗛𝗔𝗖𝗞 𝗔𝗖𝗧𝗜𝗩𝗔𝗗𝗢*
*✦ Elige un comando para ejecutar protocolo :*
*✦ Ejemplo :* .comprarbot
*✦ Operador:* *Yallico Owner 👑*
%readmore`.trimStart(),

  header: '╭─〔 🦠 %category 〕─╮',
  body: '│ ⚙️ %cmd',
  footer: '╰────────────────╯',
  after: '\n⌬ 𝐒𝐓𝐘𝐋𝐄 𝐃𝐑𝐈𝐅𝐓 ☠️ - Sistema ejecutado con éxito.'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let tag = `@${m.sender.split("@")[0]}`
    let { exp, level } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let _uptime = process.uptime() * 1000
    let muptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let mode = global.opts["self"] ? "Privado" : "Público"

    let help = Object.values(global.plugins).filter(p => !p.disabled).map(p => ({
      help: Array.isArray(p.help) ? p.help : [p.help],
      tags: Array.isArray(p.tags) ? p.tags : [p.tags],
      prefix: 'customPrefix' in p,
      limit: p.limit,
      premium: p.premium,
      enabled: !p.disabled,
    }))

    for (let plugin of help) {
      if (plugin.tags) {
        for (let t of plugin.tags) {
          if (!(t in tags) && t) tags[t] = textCyberpunk(t)
        }
      }
    }

    const { before, header, body, footer, after } = defaultMenu

    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        const cmds = help
          .filter(menu => menu.tags.includes(tag))
          .map(menu => menu.help.map(cmd => body.replace(/%cmd/g, menu.prefix ? cmd : _p + cmd)).join('\n'))
          .join('\n')
        return `${header.replace(/%category/g, tags[tag])}\n${cmds}\n${footer}`
      }),
      after
    ].join('\n')

    let replace = {
      '%': '%',
      name,
      level,
      exp: exp - min,
      maxexp: xp,
      totalreg,
      mode,
      muptime,
      readmore: String.fromCharCode(8206).repeat(4001)
    }

    let text = _text.replace(/%(\w+)/g, (_, key) => replace[key] || '')

    await conn.sendMessage(m.chat, {
    text: `⌬ 📡 ᴄʏʙᴇʀ ᴍᴇɴᴜ sʏsᴛᴇᴍ ɪɴɪᴄɪᴀɴᴅᴏ...\n⚙️ Cargando comandos...`,
      mentions: [m.sender]
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/0mervt.jpeg' },
      caption: text,
      footer: '🧠 STYLE DRIFT SYSTEM ☘️',
      buttons: [
        { buttonId: `${_p}grupos`, buttonText: { displayText: '🌐 ＧＲＵＰＯＳ ＳＴＹＬＥ' }, type: 1 },
        { buttonId: `${_p}ventas`, buttonText: { displayText: '☘️ ＳＴＹＬＥ ＶＥＮＴＡＳ' }, type: 1 }
      ],
      viewOnce: true
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❎ Error al generar el menú del sistema.', m)
  }
}

handler.help = ['menu', 'menú']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'ayuda']
handler.register = true
export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
