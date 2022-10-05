
import { DiscordAlerts, DiscordAlertsChannel } from './apis/discordalerts'
import { ApiMonitor } from './monitors/api-monitor'

process.on('unhandledRejection', async (error: any) => {
    if (typeof error !== 'object') {
        console.error(error)
        return
    }
    console.error(error)
})

async function initApiMon (alerts: DiscordAlertsChannel, url: string) {

    const apiMonitor = new ApiMonitor(alerts, url)
    await apiMonitor.init()
}

async function main () {

    const discordAlerts = new DiscordAlerts()
    // const url = 'http://api.robo-vault.com/vaults'
    const url = 'http://localhost:8080/vaults'
    discordAlerts.on('connect', async () => {
        const apiAlerts = await discordAlerts.channel('1024896275902124092')
        Promise.all([
            initApiMon(apiAlerts,url)
        ])
    })

}

export default main()
