
import * as process from 'process'



export class Settings {

    public static get (setting: string): string {
        console.log(process.env['TEST'])
        if (!process.env[setting]) {
            throw new Error(`ENV: ${setting} not configured`)
        }
        return process.env[setting] as string
    }
}
