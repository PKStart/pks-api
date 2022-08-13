import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PkLogger } from '../shared/pk-logger.service'
import { PersonalDataController } from './personal-data.controller'
import { PersonalDataEntity } from './personal-data.entity'
import { PersonalDataService } from './personal-data.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonalDataEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [PersonalDataController],
  providers: [PersonalDataService, PkLogger],
  exports: [PersonalDataService],
})
export class PersonalDataModule {}
