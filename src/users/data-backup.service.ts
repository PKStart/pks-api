import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CustomApiError, UUID } from 'pks-common'
import { Repository } from 'typeorm'
import { NoteEntity } from '../notes/note.entity'
import { PersonalDataEntity } from '../personal-data/personal-data.entity'
import { EmailService } from '../shared/email.service'
import { PkLogger } from '../shared/pk-logger.service'
import { ShortcutEntity } from '../shortcuts/shortcut.entity'
import { DataBackup } from './user.dto'
import { UserEntity } from './user.entity'
import { CyclingEntity } from '../cycling/cycling.entity'

@Injectable()
export class DataBackupService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ShortcutEntity)
    private readonly shortcutRepository: Repository<ShortcutEntity>,
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
    @InjectRepository(PersonalDataEntity)
    private readonly personalDataRepository: Repository<PersonalDataEntity>,
    @InjectRepository(CyclingEntity)
    private readonly cyclingRepository: Repository<CyclingEntity>,
    private readonly logger: PkLogger,
    private readonly emailService: EmailService
  ) {
    logger.setContext('DataBackupService')
  }

  public async backupDataForUser(id: UUID): Promise<void> {
    const result = {} as DataBackup
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) {
      throw new NotFoundException(CustomApiError.USER_NOT_FOUND)
    }

    this.logger.log(`Data backup requested by user ${user.email} at ${new Date().toISOString()}`)

    result.user = user
    result.shortcuts = await this.shortcutRepository.find({ where: { userId: id } })
    result.notes = await this.noteRepository.find({ where: { userId: id } })
    result.personalData = await this.personalDataRepository.find({ where: { userId: id } })
    result.cycling = await this.cyclingRepository.findOne({ where: { userId: id } })

    this.logger.log(
      `Found ${result.shortcuts.length} shortcuts, ${result.notes.length} notes and ${result.personalData.length} personal data entries.`
    )

    return await this.emailService.sendDataBackup(user.name, user.email, result)
  }
}
