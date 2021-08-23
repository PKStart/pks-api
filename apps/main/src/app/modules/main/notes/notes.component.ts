import { Component, OnDestroy } from '@angular/core'
import { Note, UUID } from '@pk-start/common'
import { parse } from 'date-fns'
import { Subscription } from 'rxjs'
import { filter, switchMap } from 'rxjs/operators'
import { ConfirmationService } from '../../shared/services/confirmation.service'
import { SnackbarService } from '../../shared/services/snackbar.service'
import { AppBarService } from '../app-bar/app-bar.service'
import { NotesService } from './notes.service'
import { NoteToggleEvent } from './notes.types'

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
      <div class="notes" *ngIf="(loading$ | async) === false && notes.length">
        <pk-note-card
          *ngFor="let note of notes"
          [note]="note"
          (edit)="onEdit($event)"
          (pin)="onPin($event)"
          (archive)="onArchive($event)"
          (delete)="onDelete($event)"
        ></pk-note-card>
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

  constructor(
    private notesService: NotesService,
    public appBarService: AppBarService,
    private confirmationService: ConfirmationService,
    private snackbarService: SnackbarService
  ) {
    this.subscription.add(
      notesService.notes$.subscribe(notes => {
        this.notes = notes
          .sort((a, b) => parse(b.createdAt).getTime() - parse(a.createdAt).getTime())
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

  public onEdit(id: UUID): void {
    const note = this.notes.find(n => n.id === id)
    if (!note) return
    console.log('edit', note)
  }

  public onPin(e: NoteToggleEvent): void {
    const note = this.notes.find(n => n.id === e.id)
    if (!note) return
    this.updateNote({ ...note, pinned: e.newValue })
  }

  public onArchive(e: NoteToggleEvent): void {
    const note = this.notes.find(n => n.id === e.id)
    if (!note) return
    this.updateNote({ ...note, archived: e.newValue })
  }

  public onDelete(id: UUID): void {
    this.confirmationService
      .question('Do you really want to delete this note?')
      .pipe(
        filter(isConfirmed => isConfirmed),
        switchMap(() => this.notesService.deleteNote(id))
      )
      .subscribe({
        next: () => this.notesService.fetchNotes(),
        error: e => this.snackbarService.showError('Could not delete note. ' + e.error.message),
      })
  }

  private updateNote(note: Note): void {
    this.notesService.updateNote(note).subscribe({
      next: () => this.notesService.fetchNotes(),
      error: e => this.snackbarService.showError('Could not update note. ' + e.error.message),
    })
  }
}
