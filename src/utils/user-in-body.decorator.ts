import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { UserEntity } from '../users/user.entity'

export const UserInBody = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserEntity => {
    const idField = data || 'userId'
    const req = ctx.switchToHttp().getRequest()
    if (req.user.id !== req.body[idField]) {
      throw new ForbiddenException()
    }
    return req.user
  }
)
