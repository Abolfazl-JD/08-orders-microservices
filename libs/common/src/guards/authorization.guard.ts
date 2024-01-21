import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { AUTH_SERVICE } from '@app/common'
import { ClientProxy } from '@nestjs/microservices'
import { catchError, Observable, tap } from 'rxjs'

@Injectable()
export class AuthorizationGuard implements CanActivate {

    constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>{
        console.log('\n checking authorization started...')
        const authorization = this.getAuthentication(context)
        console.log('\n authorization is :', authorization)
        if (!authorization || !authorization.startsWith('Bearer ')) return false

        const token = authorization.split(' ')[1]
        console.log('\n token is exported from authorization', token)
        console.log('\n ready to send the validate-user message to auth service')
        return this.authClient.send('validate-user', {
                token
            }).pipe(
                tap((res) => {
                    console.log('\n auth client response is: ', res)
                    console.log('\n adding user to the request')
                    this.addUserToRequest(res, context)
                }),
                catchError(() => {
                    throw new UnauthorizedException()
                }),
            )
    }

    getAuthentication(context: ExecutionContext) {
        let authorization: string
        if(context.getType() === "rpc") 
            authorization = context.switchToRpc().getData().authorization
        else if (context.getType() === "http")
            authorization = context.switchToHttp().getRequest().headers.authorization
        if (!authorization) throw new UnauthorizedException('No token was found')
        return authorization
    }

    addUserToRequest(user: any, context: ExecutionContext) {
        if (context.getType() === "rpc")
            context.switchToRpc().getData().user = user
        else if (context.getType() === "http")
            context.switchToHttp().getRequest().user = user
    }
}
