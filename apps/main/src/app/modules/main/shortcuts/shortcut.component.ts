import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Shortcut } from '@pk-start/common'
import { SettingsStore } from '../../shared/services/settings.store'

@Component({
  selector: 'pk-shortcut',
  template: `
    <button
      class="shortcut"
      (click)="onOpen()"
      (mouseenter)="hovered = true"
      (mouseleave)="hovered = false"
    >
      <img [src]="iconUrl" [alt]="shortcut.name" />
      <p>{{ shortcut.name }}</p>
    </button>
    <!--    <button *ngIf="hovered" class="menu-trigger" mat-icon-button [matMenuTriggerFor]="shortcutMenu">-->
    <!--      <mat-icon>more_vert</mat-icon>-->
    <!--    </button>-->
    <!--    <mat-menu #shortcutMenu="matMenu">-->
    <!--      <button mat-menu-item>-->
    <!--        <mat-icon>edit</mat-icon>-->
    <!--        <span>Edit shortcut</span>-->
    <!--      </button>-->
    <!--      <button mat-menu-item>-->
    <!--        <mat-icon>delete</mat-icon>-->
    <!--        <span>Delete shortcut</span>-->
    <!--      </button>-->
    <!--    </mat-menu>-->
  `,
  styles: [
    // language=scss
    `
      button.shortcut {
        border: none;
        background: none;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 120px;

        &:hover {
          cursor: pointer;
          background-color: var(--color-bg-opaque-lighter);
          border-radius: 8px;
        }

        img {
          width: 48px;
          height: 48px;
        }

        p {
          margin: 0.65rem 0 0;
          color: var(--color-text-on-dark);
          text-align: center;
          max-width: 100%;
          white-space: pre-wrap;
          text-overflow: ellipsis;
          font-size: 1rem;
        }
      }

      //button.menu-trigger {
      //  width: 24px;
      //  height: 24px;
      //  line-height: 24px;
      //  top: -30px;
      //  right: 0;
      //
      //  mat-icon {
      //    font-size: 18px;
      //    width: 18px;
      //    height: 18px;
      //    line-height: 18px;
      //  }
      //}
    `,
  ],
})
export class ShortcutComponent {
  @Input() shortcut!: Shortcut

  @Output() clicked = new EventEmitter<void>()

  public hovered = false

  constructor(private settingsStore: SettingsStore) {}

  public get iconUrl(): string {
    if (this.shortcut.iconUrl.startsWith('http')) {
      return this.shortcut.iconUrl
    }
    return `${this.settingsStore.shortcutIconBaseUrl}${this.shortcut.iconUrl}`
  }

  public onOpen(): void {
    this.clicked.emit()
    setTimeout(() => {
      window.open(this.shortcut.url, '_blank')
    })
  }
}
