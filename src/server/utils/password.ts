import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export const hash = (plainPassword: string) => bcrypt.hash(plainPassword, 10)

export const verify = (plainPassword: string, hash: string) => {
    if (hash.startsWith('$2') && hash.length === 60) {
        return bcrypt.compare(plainPassword, hash);
    }

    if (hash.length === 32) {
        const md5Hash = crypto.createHash('md5').update(plainPassword).digest('hex');
        return md5Hash === hash;
    }

    return false
}
