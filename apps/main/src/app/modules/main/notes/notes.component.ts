import { Component, OnDestroy } from '@angular/core'
import { Note } from '@pk-start/common'
import { Subscription } from 'rxjs'
import { AppBarService } from '../app-bar/app-bar.service'
import { NotesService } from './notes.service'

@Component({
  selector: 'pk-notes',
  template: ` <div class="main-box">
    <header class="main-box-header">
      <h1 class="main-box-title">Notes</h1>
      <div class="main-box-actions">
        <button
          mat-icon-button
          matTooltip="Add note"
          matTooltipPosition="left"
          (click)="onAddNote()"
        >
          <mat-icon>playlist_add</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Close" (click)="appBarService.toggleNotes()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </header>
    <main class="main-box-content">
      <div *ngIf="loading$ | async" class="main-box-loading">
        <mat-spinner diameter="32" color="accent"></mat-spinner>
      </div>
      <div *ngIf="(loading$ | async) === false && !notes.length" class="main-box-message">
        No notes.
      </div>
      <div class="notes" *ngIf="notes.length">
        <pk-note-card *ngFor="let note of notes" [note]="note"></pk-note-card>
      </div>
    </main>
  </div>`,
  styles: [
    `
      .notes {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    `,
  ],
})
export class NotesComponent implements OnDestroy {
  public notes: Note[] = []
  public loading$ = this.notesService.loading$

  private subscription = new Subscription()

  constructor(private notesService: NotesService, public appBarService: AppBarService) {
    this.subscription.add(
      notesService.notes$.subscribe(notes => {
        this.notes = notes
          .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
          .sort((a, b) => (a.archived === b.archived ? 0 : a.archived ? 1 : -1))
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  public onAddNote(): void {
    console.log('Add note')
  }
}
