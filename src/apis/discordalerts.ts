import { Client, Intents, TextChannel } from 'discord.js'
import { EventEmitter } from 'stream'
import { Settings } from '../util/settings'
import 'dotenv'

export class DiscordAlertsChannel {
    private client: Client
    private channel?: TextChannel

    constructor (client: Client) {
        this.client = client
    }

    async connect (channelId: string): Promise<DiscordAlertsChannel> {
        console.log(`channel connected ${channelId}`)
        let ch = this.client.channels.cache.get(channelId) as TextChannel
        if (!ch) {
            throw new Error('Failed to fetch Channel: ' + channelId)
        }
        this.channel = ch
        return this
    }

    async send (message?: string) {
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

        this.client.login(Settings.get('DISCORD_TOKEN'))
    }

    // Channel factory
    async channel (channelId: string): Promise<DiscordAlertsChannel> {
        const channel = new DiscordAlertsChannel(this.client)
        return channel.connect(channelId)
    }
}
