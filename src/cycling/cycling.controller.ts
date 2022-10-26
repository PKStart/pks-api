import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { CyclingService } from './cycling.service'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import {
  CyclingChoreRequestDto,
  CyclingDto,
  SetMonthlyGoalRequestDto,
  SetWeeklyGoalRequestDto,
} from './cycling.dto'
import { GetUser } from '../utils'
import { UserEntity } from '../users/user.entity'
import { PkAuthGuard } from '../users/pk-auth-guard'
import { apiDocs } from '../shared/api-docs'
import { UUID } from 'pks-common'

@ApiTags('Cycling')
@Controller('cycling')
export class CyclingController {
  constructor(private cyclingService: CyclingService) {}

  @Get()
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.cycling.get.operation)
  @ApiOkResponse(apiDocs.cycling.get.ok)
  @ApiNotFoundResponse(apiDocs.generic.itemNotFound)
  public async getForUser(@GetUser() user: UserEntity): Promise<CyclingDto> {
    return this.cyclingService.getDataForUser(user.id)
  }

  @Put('/weekly-goal')
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.cycling.setWeeklyGoal.operation)
  @ApiOkResponse(apiDocs.cycling.setMonthlyGoal.ok)
  public async setWeeklyGoal(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) { weeklyGoal }: SetWeeklyGoalRequestDto
  ): Promise<CyclingDto> {
    return this.cyclingService.setWeeklyGoal(user.id, weeklyGoal)
  }

  @Put('/monthly-goal')
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.cycling.setMonthlyGoal.operation)
  @ApiOkResponse(apiDocs.cycling.setMonthlyGoal.ok)
  public async setMonthlyGoal(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) { monthlyGoal }: SetMonthlyGoalRequestDto
  ): Promise<CyclingDto> {
    return this.cyclingService.setMonthlyGoal(user.id, monthlyGoal)
  }

  @Post('/chore')
  @HttpCode(201)
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.cycling.chore.create.operation)
  @ApiCreatedResponse(apiDocs.cycling.chore.create.created)
  public async createChore(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) request: CyclingChoreRequestDto
  ): Promise<CyclingDto> {
    return this.cyclingService.addChore(user.id, request)
  }

  @Put('/chore/:id')
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.cycling.chore.update.operation)
  @ApiOkResponse(apiDocs.cycling.chore.update.ok)
  public async updateChore(
    @GetUser() user: UserEntity,
    @Param('id') choreId: UUID,
    @Body(ValidationPipe) request: CyclingChoreRequestDto
  ): Promise<CyclingDto> {
    return this.cyclingService.updateChore(user.id, choreId, request)
  }

  @Delete('/chore/:id')
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.cycling.chore.delete.operation)
  @ApiOkResponse(apiDocs.cycling.chore.delete.ok)
  public async removeChore(
    @GetUser() user: UserEntity,
    @Param('id') choreId: UUID
  ): Promise<CyclingDto> {
    return this.cyclingService.deleteChore(user.id, choreId)
  }
}
