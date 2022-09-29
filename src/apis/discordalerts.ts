import { Client, Intents, TextChannel} from 'discord.js'
import { EventEmitter } from 'stream'
import { Settings } from '../util/settings'

export class DiscordAlertsChannel {
    private client: Client
    private channel?: TextChannel

    constructor (client: Client) {
        this.client = client
    }

    async connect (channelId: string): Promise<DiscordAlertsChannel> {
        console.log(`channel connected ${channelId}`)
        let ch = await this.client.channels.cache.get(channelId) as TextChannel
        if (!ch) {
            throw new Error('Failed to fetch Channel: ' + channelId)
        }
        this.channel = ch as TextChannel
        return this
    }

    async send (message: string) {
        console.log(message)
        if (!this.channel) {
            throw new Error('Alerts channel not available')
        }

        // find a solution for here or update discord.js
        // @ts-ignore
        this.channel.send(`@everyone\n${message}`)
    }
}

export class DiscordAlerts extends EventEmitter {
    private client: Client
    constructor () {
        super()
        this.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] })

        this.client.once('ready', async () => {
            console.log('Discord API Connected')
            this.emit('connect')
        })
        // console.log(Settings.get('DISCORD_TOKEN'))
        const token1 = 'MTAyNDg5MzA0MzQ2OTQ2MzY3NA.GD2jPZ.zFRXsjuhCmj-q3Y9HHbPCJkf7qtytjPEOOXZPQ'

        this.client.login(token1)
    }

    // Channel factory
    async channel (channelId: string): Promise<DiscordAlertsChannel> {
        const channel = new DiscordAlertsChannel(this.client)
        return channel.connect(channelId)
    }
}
