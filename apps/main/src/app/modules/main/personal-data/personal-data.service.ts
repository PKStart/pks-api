import { Injectable } from '@angular/core'
import { PersonalData } from '@pk-start/common'
import { Store } from '../../../utils/store'
import { ApiRoutes } from '../../shared/services/api-routes'
import { ApiService } from '../../shared/services/api.service'
import { NotificationService } from '../../shared/services/notification.service'

interface PersonalDataState {
  loading: boolean
  data: PersonalData[]
}

const initialState: PersonalDataState = {
  loading: false,
  data: [],
}

@Injectable({ providedIn: 'root' })
export class PersonalDataService extends Store<PersonalDataState> {
  public loading$ = this.select(state => state.loading)
  public data$ = this.select(state => state.data)

  constructor(private apiService: ApiService, private notificationService: NotificationService) {
    super(initialState)
    this.fetchData()
  }

  public fetchData(): void {
    this.setState({ loading: true })
    this.apiService.get<PersonalData[]>(ApiRoutes.PERSONAL_DATA).subscribe({
      next: res => {
        this.setState({
          data: res,
          loading: false,
        })
      },
      error: err => {
        this.notificationService.showError('Could not fetch personal data. ' + err.error.message)
        this.setState({ loading: false })
      },
    })
  }
}
