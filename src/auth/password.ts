import { compare, hash } from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
    const pwdHash: string = await hash(password, 8)
    return pwdHash
}

export async function compareHash(dbHash: string, hash: string): Promise<boolean> {
    const result: boolean = await compare(dbHash, hash)
    return result
}