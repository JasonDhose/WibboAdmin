import * as ip from 'ip'

export const isValidField = (...args: any[]) => args.every(value => value !== undefined && value !== null)

export const isValidNumber = (...args: number[]) => args.every(value => typeof value === 'number' && !Number.isNaN(value))

export const isValidString = (...args: string[]) => args.every(value => typeof value === 'string')

export const isValidBoolean = (...args: boolean[]) => args.every(value => typeof value === 'boolean')

export const isValidBase64 = (...args: string[]) => args.every(value => typeof value === 'string' && value.length > 0 && /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value))

const validDomains = [
    'sfr.fr', 'orange.fr', 'gmail.com', 'live.fr', 'laposte.net', 'hotmail.com', 'hotmail.fr',
    'yahoo.com', 'yahoo.fr', 'outlook.fr', 'outlook.com', 'free.fr', 'icloud.com', 'hotmail.ca',
    'hotmail.be', 'live.com', 'live.be', 'neuf.fr', 'wanadoo.fr', 'numericable.fr', 'aliceadsl.fr',
    'live.ca', 'outlook.be', 'gmx.fr'
]
export const isJunkMail = (mail: string) => !mail.includes('@') || !validDomains.includes(mail.split('@')[1])

export const ipInRange = (ipAddress: string, range: string) => ip.cidrSubnet(range).contains(ipAddress)
