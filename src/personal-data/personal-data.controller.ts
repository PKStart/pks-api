import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { apiDocs } from '../shared/api-docs'
import { PkAuthGuard } from '../users/pk-auth-guard'
import { UserEntity } from '../users/user.entity'
import { GetUser } from '../utils'
import {
  CreatePersonalDataRequestDto,
  DeletePersonalDataRequestDto,
  PersonalDataDto,
  PersonalDataIdResponseDto,
  UpdatePersonalDataRequestDto,
} from './personal-data.dto'
import { PersonalDataService } from './personal-data.service'

@ApiTags('Personal Data')
@Controller('personal-data')
export class PersonalDataController {
  constructor(private readonly personalDataService: PersonalDataService) {}

  @Get()
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.personalData.getAll.operation)
  @ApiOkResponse(apiDocs.personalData.getAll.ok)
  @ApiNotFoundResponse(apiDocs.generic.itemNotFound)
  public async getAllForUser(@GetUser() user: UserEntity): Promise<PersonalDataDto[]> {
    return this.personalDataService.getAllForUser(user.id)
  }

  @Post()
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.personalData.create.operation)
  @ApiCreatedResponse(apiDocs.personalData.create.created)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  public async create(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) request: CreatePersonalDataRequestDto
  ): Promise<PersonalDataIdResponseDto> {
    return this.personalDataService.createPersonalData(request, user.id)
  }

  @Put()
  @UseGuards(PkAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.personalData.update.operation)
  @ApiOkResponse(apiDocs.personalData.update.ok)
  @ApiNotFoundResponse(apiDocs.generic.itemNotFound)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  @ApiForbiddenResponse(apiDocs.generic.forbidden)
  public async update(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) request: UpdatePersonalDataRequestDto
  ): Promise<PersonalDataIdResponseDto> {
    return this.personalDataService.updatePersonalData(request, user.id)
  }

  @Delete()
  @UseGuards(PkAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.personalData.delete.operation)
  @ApiOkResponse(apiDocs.personalData.delete.ok)
  @ApiNotFoundResponse(apiDocs.generic.itemNotFound)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  @ApiForbiddenResponse(apiDocs.generic.forbidden)
  public async delete(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) request: DeletePersonalDataRequestDto
  ): Promise<PersonalDataIdResponseDto> {
    return this.personalDataService.deletePersonalData(request, user.id)
  }
}
