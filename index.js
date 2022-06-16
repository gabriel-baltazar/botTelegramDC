require('dotenv').config()
const { Telegraf } = require('telegraf')
const puppeteer = require('puppeteer');

//Initializing bot

const bot = new Telegraf(process.env.BOT_TOKEN)
var code
var status = false

bot.start(content => {
  const from = content.update.message.from
  content.reply(`Bem-vindo, ${from.first_name}`)
})

bot.on('text', (content) => {
  code = (content.update.message.text).toUpperCase()
  acessWebsite(code,content)
})


function acessWebsite(code,content){
  (async () => {
    const browser = await puppeteer.launch({
      headless:false,
      slowMo: 20
    });
    const page = await browser.newPage();
    await page.goto('https://www.nescafe-dolcegusto.com.br/customer/account/login/');
    await page.waitForSelector('[name="login[username]"]')
    await page.type('[name="login[username]"]',process.env.DOLCEGUSTO_EMAIL)
    await page.type('[name="login[password]"]',process.env.DOLCEGUSTO_PASSWORD)
    await page.click('[name="send"]')
    await page.waitForNavigation()
    await page.goto('https://www.nescafe-dolcegusto.com.br/club#code-entry-form')
    await page.type('[name="code"]',code)
    await page.click('[title="Enviar"]')
    await page.waitForSelector('[name="form_key"]')
    await page.screenshot({ path: 'example.png' });
  
    await browser.close();

    await content.telegram.sendPhoto(content.chat.id,{source: "example.png"})
    
  })();
}

bot.startPolling()