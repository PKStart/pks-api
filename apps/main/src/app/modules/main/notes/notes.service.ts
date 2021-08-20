import { Injectable } from '@angular/core'
import { Note } from '@pk-start/common'
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

  private fetchNotes(): void {
    this.setState({ loading: true })
    this.apiService.get<Note[]>(ApiRoutes.NOTES).subscribe({
      next: res => {
        console.log(res)
        this.setState({
          notes: res,
        })
      },
      error: err => this.snackbarService.showError('Could not fetch notes. ' + err.message),
      complete: () => this.setState({ loading: false }),
    })
  }
}
