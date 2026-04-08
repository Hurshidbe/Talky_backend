import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwt: JwtService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('invalid auth header')
        }
        const token = authHeader.split(' ')[1]
        try {
            const payload = await this.jwt.verifyAsync(token)
            req.user = payload
        } catch (error) {
            throw new UnauthorizedException('invalid token')
        }

        return true
    }
}