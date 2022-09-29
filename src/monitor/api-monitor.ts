import { DiscordAlertsChannel } from '../apis/discordalerts'
import Axios from 'axios'
import e from 'cors'

export class ApiMonitor {
    private url:string
    private alerts: DiscordAlertsChannel
    private data?: any[]
    private message?: string
    private online?: boolean 


    constructor (alerts: DiscordAlertsChannel, url: string) {
        this.url = url
        this.alerts = alerts   
    }

    async init () {
        setInterval(this.apiCheck.bind(this), 60 * 1000)
        setTimeout(this.apiCheck.bind(this), 2000)
    }

    async apiCheck () {

        if(!this.online){
            try {
                this.data = await Axios.get(this.url).then(v => v.data)
                } catch(e)  {
                    console.log(e)
                    this.message = 'API Is Down Server Maybe downed'
                    this.sendAlert(this.message)
                    this.online = false
                }

            if(!this.data){
                this.message = 'API send empty data'
                this.sendAlert(this.message)
                this.online = false
            }
            else
            {
                this.online = true
                console.log('online')
            }
        }
        else
        {
            this.online = true
            console.log('online')
        }

    }
    
    async checkData(data:any[]) {
        
    }

    async sendAlert (message:string) {
        this.alerts.send(message)
    }
}
