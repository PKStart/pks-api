import { Injectable, NotFoundException } from '@nestjs/common'
import { CyclingChoreRequestDto, CyclingDto } from './cycling.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PkLogger } from '../shared/pk-logger.service'
import { CyclingEntity } from './cycling.entity'
import { CustomApiError, UUID } from 'pks-common'
import { v4 as uuid } from 'uuid'

@Injectable()
export class CyclingService {
  constructor(
    @InjectRepository(CyclingEntity)
    private readonly cyclingRepository: Repository<CyclingEntity>,
    private readonly logger: PkLogger
  ) {
    logger.setContext('CyclingService')
  }

  public async getDataForUser(userId: UUID): Promise<CyclingDto> {
    try {
      return await this.cyclingRepository.findOneOrFail({ where: { userId } })
    } catch (e) {
      this.logger.error(`Could not find cycling data for user ${userId}`)
      throw new NotFoundException(CustomApiError.ITEM_NOT_FOUND)
    }
  }

  public async setWeeklyGoal(userId: UUID, goal: number | null): Promise<CyclingDto> {
    return this.setGoal(userId, goal, 'weekly')
  }

  public async setMonthlyGoal(userId: UUID, goal: number | null): Promise<CyclingDto> {
    return this.setGoal(userId, goal, 'monthly')
  }

  public async addChore(userId: UUID, request: CyclingChoreRequestDto): Promise<CyclingDto> {
    const data = await this.getOrCreate(userId)
    await this.cyclingRepository.update(
      { id: data.id },
      {
        ...data,
        chores: [
          {
            id: uuid(),
            ...request,
          },
          ...data.chores,
        ],
      }
    )
    return await this.cyclingRepository.findOne({ where: { id: data.id } })
  }

  public async updateChore(
    userId: UUID,
    choreId: UUID,
    request: CyclingChoreRequestDto
  ): Promise<CyclingDto> {
    const data = await this.getOrCreate(userId)
    const chores = data.chores
    const choreToUpdateIndex = chores.findIndex(({ id }) => id === choreId)
    if (choreToUpdateIndex === -1) {
      throw new NotFoundException(CustomApiError.ITEM_NOT_FOUND)
    }
    const newChores = [...chores]
    newChores.splice(choreToUpdateIndex, 1, {
      id: choreId,
      ...request,
    })

    await this.cyclingRepository.update(
      { id: data.id },
      {
        ...data,
        chores: newChores,
      }
    )
    return await this.cyclingRepository.findOne({ where: { id: data.id } })
  }

  public async deleteChore(userId: UUID, choreId: UUID): Promise<CyclingDto> {
    const data = await this.getOrCreate(userId)
    const chores = data.chores
    const choreToDeleteIndex = chores.findIndex(({ id }) => id === choreId)
    if (choreToDeleteIndex === -1) {
      throw new NotFoundException(CustomApiError.ITEM_NOT_FOUND)
    }
    const newChores = [...chores]
    newChores.splice(choreToDeleteIndex, 1)

    await this.cyclingRepository.update(
      { id: data.id },
      {
        ...data,
        chores: newChores,
      }
    )
    return await this.cyclingRepository.findOne({ where: { id: data.id } })
  }

  private async setGoal(
    userId: UUID,
    goal: number | null,
    type: 'weekly' | 'monthly'
  ): Promise<CyclingDto> {
    const data = await this.getOrCreate(userId)
    let payload: CyclingEntity
    switch (type) {
      case 'weekly':
        payload = { ...data, weeklyGoal: goal }
        break
      case 'monthly':
        payload = { ...data, monthlyGoal: goal }
        break
    }
    await this.cyclingRepository.update({ id: data.id }, payload)
    return await this.cyclingRepository.findOne({ where: { id: data.id } })
  }

  private async getOrCreate(userId: UUID): Promise<CyclingEntity> {
    const data = await this.cyclingRepository.findOne({ where: { userId } })
    if (data) return data

    return await this.cyclingRepository.save(
      this.cyclingRepository.create({
        userId,
        id: uuid(),
        createdAt: new Date(),
        weeklyGoal: null,
        monthlyGoal: null,
        chores: [],
      })
    )
  }
}
