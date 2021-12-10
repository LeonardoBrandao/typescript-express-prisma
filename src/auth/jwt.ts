import jwt, { JwtPayload } from 'jsonwebtoken'
import { env } from 'process'
import { v4 as uuidv4 } from 'uuid';

const jwtSecret = env.JWT_SECRET || "fc004e16-d0c4-47c5-9746-eced77789e8c"

export function signJWT(payload: object): string {
    const opts: jwt.SignOptions = {
        algorithm: "HS256",
        expiresIn: "1d",
        audience: 'client-app',
        jwtid: uuidv4()
    }
    const token: string = jwt.sign(payload, jwtSecret, opts)
    return token
}

export function verifyJWT(token: string): any {
    const opts: jwt.VerifyOptions = {
        algorithms: ["HS256"],
        audience: 'client-app',
    }
    const decoded: string | JwtPayload = jwt.verify(token, jwtSecret, opts)
    return decoded
}