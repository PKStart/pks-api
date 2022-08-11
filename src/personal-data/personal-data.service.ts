import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { CustomApiError, UUID } from 'pks-common'
import { PkLogger } from '../shared/pk-logger.service'
import { omitObjectId } from '../utils'
import {
  CreatePersonalDataRequestDto,
  DeletePersonalDataRequestDto,
  PersonalDataDto,
  PersonalDataIdResponseDto,
  UpdatePersonalDataRequestDto,
} from './personal-data.dto'
import { PersonalDataEntity } from './personal-data.entity'

@Injectable()
export class PersonalDataService {
  constructor(
    @InjectRepository(PersonalDataEntity)
    private readonly personalDataRepository: Repository<PersonalDataEntity>,
    private readonly logger: PkLogger
  ) {
    logger.setContext('PersonalDataService')
  }

  public async getAllForUser(userId: UUID): Promise<PersonalDataDto[]> {
    const results = await this.personalDataRepository.find({ where: { userId } })
    if (!results.length) {
      throw new NotFoundException(CustomApiError.ITEM_NOT_FOUND)
    }
    return results.map(omitObjectId)
  }

  public async createPersonalData(
    request: CreatePersonalDataRequestDto,
    userId: UUID
  ): Promise<PersonalDataIdResponseDto> {
    const personalData: PersonalDataEntity = await this.personalDataRepository.save(
      this.personalDataRepository.create({
        ...request,
        userId,
        id: uuid(),
        createdAt: new Date(),
      })
    )
    return {
      id: personalData.id,
    }
  }

  public async updatePersonalData(
    request: UpdatePersonalDataRequestDto,
    userId: UUID
  ): Promise<PersonalDataIdResponseDto> {
    const personalData = await this.personalDataRepository.findOne({ where: { id: request.id } })
    if (!personalData) {
      throw new NotFoundException(CustomApiError.ITEM_NOT_FOUND)
    }
    if (personalData.userId !== userId) {
      throw new ForbiddenException()
    }
    await this.personalDataRepository.update({ id: request.id }, request)
    return { id: request.id }
  }

  public async deletePersonalData(
    { id }: DeletePersonalDataRequestDto,
    userId: UUID
  ): Promise<PersonalDataIdResponseDto> {
    const item = await this.personalDataRepository.findOne({ where: { id } })
    if (!item) {
      throw new NotFoundException(CustomApiError.ITEM_NOT_FOUND)
    }
    if (item.userId !== userId) {
      throw new ForbiddenException()
    }
    await this.personalDataRepository.delete({ id })
    return { id }
  }
}
