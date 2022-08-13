import { UUID } from 'pks-common'
import { DataSource } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { NoteEntity } from '../../src/notes/note.entity'
import { useSeedData } from '../use-seed-data'

export async function seedNotes(dataSource: DataSource, userId: UUID): Promise<void> {
  try {
    const { notes } = useSeedData()
    const noteRepository = dataSource.getRepository(NoteEntity)
    for (const note of notes) {
      await noteRepository.save(
        noteRepository.create({
          ...note,
          id: uuid(),
          userId,
          createdAt: new Date(note.createdAt),
          pinned: note.pinned || false,
        })
      )
    }
  } catch (error) {
    console.log('[Seed] Error seeding Notes:', error)
  }
}
