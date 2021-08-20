import { Injectable } from '@angular/core'
import { Note, NoteIdResponse, UpdateNoteRequest } from '@pk-start/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { omit } from '../../../utils/objects'
import { Store } from '../../../utils/store'
import { ApiRoutes } from '../../shared/services/api-routes'
import { ApiService } from '../../shared/services/api.service'
import { SnackbarService } from '../../shared/services/snackbar.service'

interface NotesState {
  notes: Note[]
  loading: boolean
}

const initialState: NotesState = {
  notes: [],
  loading: false,
}

@Injectable({ providedIn: 'root' })
export class NotesService extends Store<NotesState> {
  constructor(private apiService: ApiService, private snackbarService: SnackbarService) {
    super(initialState)

    this.fetchNotes()
  }

  public notes$ = this.select(state => state.notes)
  public loading$ = this.select(state => state.loading)

  public fetchNotes(): void {
    this.setState({ loading: true })
    this.apiService.get<Note[]>(ApiRoutes.NOTES).subscribe({
      next: res => {
        this.setState({
          notes: res,
          loading: false,
        })
      },
      error: err => {
        this.snackbarService.showError('Could not fetch notes. ' + err.message)
        this.setState({ loading: false })
      },
    })
  }

  public updateNote(note: Note): Observable<NoteIdResponse> {
    this.setState({ loading: true })
    const request: UpdateNoteRequest = omit(note, ['createdAt', 'userId'])
    return this.apiService.put<UpdateNoteRequest, NoteIdResponse>(ApiRoutes.NOTES, request).pipe(
      tap(
        () => this.setState({ loading: false }),
        () => this.setState({ loading: false })
      )
    )
  }
}
