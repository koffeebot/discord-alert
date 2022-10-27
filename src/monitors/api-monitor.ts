import { DiscordAlertsChannel } from '../apis/discordalerts'
import Axios from 'axios'

export class ApiMonitor {
    private url: string
    private alerts: DiscordAlertsChannel
    private data?: any[]
    private message?: string = ''
    // private online?: boolean
    // private alerted?: boolean

    constructor (alerts: DiscordAlertsChannel, url: string) {
        this.url = url
        this.alerts = alerts
        
    }

    async init () {
        //interval of 10 mins
        setInterval(this.apiCheck.bind(this), 60 * 1000 * 10)
        setTimeout(this.apiCheck.bind(this), 2000)
    }

    async apiCheck () {
        console.log('hit')

        try {
            this.data = await Axios.get(this.url).then(v => v.data)
        } catch (e) {
            // console.log(e)
            this.message = 'API Is Down Server Maybe downed'
            this.sendAlert(this.message)

        }

        if (this.data) {
            if (this.data.length === 0) {
                this.message = 'API Is Empty'
                this.sendAlert(this.message)

            } else {
                this.checkData(this.data)
            }

        }

    }

    async checkData (data: any[]) {

        const vaults = data.filter((p) => p.status.toLowerCase() === 'active')
        .map((item) => ({
            chain: item.chain,
            vaultId: item.vaultId,
            tvlUsd: item.tvlUsd,
            apy1d: item.apy1d,
            apy2d: item.apy2d,
            apy3d: item.apy3d,
            apy7d: item.apy7d,
            apy14d: item.apy14d,
            apy28d: item.apy28d,
        }))

        for (const vault of vaults) {

            if (!vault.tvlUsd || vault.tvlUsd === 0) { this.message += `Tvl is empty/no Value on ` + `${vault.chain} ` + `${vault.vaultId} \n` }
            if (!vault.apy1d || vault.apy1d === 0) { this.message += 'apy3d is empty/no Value ' + `${vault.chain} ` + `${vault.vaultId} \n` }
            if (!vault.apy2d || vault.apy2d === 0) { this.message += 'apy3d is empty/no Value ' + `${vault.chain} ` + `${vault.vaultId} \n` }
            if (!vault.apy3d || vault.apy3d === 0) { this.message += 'apy3d is empty/no Value ' + `${vault.chain} ` + `${vault.vaultId} \n` }
            if (!vault.apy7d || vault.apy7d === 0) { this.message += 'apy7d is empty/no Value ' + `${vault.chain} ` + `${vault.vaultId} \n` }
            if (!vault.apy14d || vault.apy14d === 0) { this.message += 'apy14d is empty/no Value ' + `${vault.chain} ` + `${vault.vaultId} \n` }
            if (!vault.apy28d || vault.apy28d === 0) { this.message += 'apy28d is empty/no Value ' + `${vault.chain} ` + `${vault.vaultId} \n` }
        }

        if (this.message !== '') { this.sendAlert(this.message) }

    }

    async sendAlert (message?: string) {
        this.alerts.send(message)
    }

    async log (error: string) {
        this.alerts.send(error)
    }
}
