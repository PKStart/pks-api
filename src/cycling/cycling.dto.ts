import {
  CustomValidationError,
  Cycling,
  CyclingChore as ICyclingChore,
  CyclingChoreRequest,
  SetMonthlyGoalRequest,
  SetWeeklyGoalRequest,
  UUID,
} from 'pks-common'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, Min, MinLength, ValidateIf } from 'class-validator'

export class CyclingChore implements ICyclingChore {
  @ApiProperty()
  id: UUID

  @ApiProperty()
  kmInterval: number

  @ApiProperty()
  lastKm: number

  @ApiProperty()
  name: string
}

export class CyclingDto implements Cycling {
  @ApiProperty()
  id: UUID

  @ApiProperty()
  userId: UUID

  @ApiProperty()
  createdAt: Date

  @ApiProperty({ type: [CyclingChore], nullable: true })
  chores: CyclingChore[] | null

  @ApiProperty({ nullable: true })
  monthlyGoal: number | null

  @ApiProperty({ nullable: true })
  weeklyGoal: number | null
}

export class SetWeeklyGoalRequestDto implements SetWeeklyGoalRequest {
  @ApiProperty({ nullable: true })
  @IsNumber(undefined, { message: CustomValidationError.NUMBER_REQUIRED })
  @Min(0, { message: CustomValidationError.MIN_VALUE })
  @ValidateIf((object, value) => value !== null)
  weeklyGoal: number | null
}

export class SetMonthlyGoalRequestDto implements SetMonthlyGoalRequest {
  @ApiProperty({ nullable: true })
  @IsNumber(undefined, { message: CustomValidationError.NUMBER_REQUIRED })
  @Min(0, { message: CustomValidationError.MIN_VALUE })
  @ValidateIf((object, value) => value !== null)
  monthlyGoal: number | null
}

export class CyclingChoreRequestDto implements CyclingChoreRequest {
  @ApiProperty()
  @IsNumber(undefined, { message: CustomValidationError.NUMBER_REQUIRED })
  @Min(0, { message: CustomValidationError.MIN_VALUE })
  kmInterval: number

  @ApiProperty()
  @IsNumber(undefined, { message: CustomValidationError.NUMBER_REQUIRED })
  @Min(0, { message: CustomValidationError.MIN_VALUE })
  lastKm: number

  @ApiProperty()
  @IsString({ message: CustomValidationError.STRING_REQUIRED })
  @MinLength(2, { message: CustomValidationError.MIN_LENGTH })
  name: string
}
