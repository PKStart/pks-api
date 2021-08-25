import { Component, Output, EventEmitter } from '@angular/core'
import { ShortcutCategory } from '@pk-start/common'

@Component({
  selector: 'pk-shortcuts-menu',
  template: `
    <div class="shortcuts-menu">
      <button
        (click)="clickMenu.emit(category.TOP)"
        (mouseenter)="enterMenu.emit(category.TOP)"
        (mouseleave)="mouseLeave.emit()"
      >
        <mat-icon>star</mat-icon>
      </button>
      <button
        (click)="clickMenu.emit(category.CODING)"
        (mouseenter)="enterMenu.emit(category.CODING)"
        (mouseleave)="mouseLeave.emit()"
      >
        <mat-icon>code</mat-icon>
      </button>
      <button
        (click)="clickMenu.emit(category.GOOGLE)"
        (mouseenter)="enterMenu.emit(category.GOOGLE)"
        (mouseleave)="mouseLeave.emit()"
      >
        <mat-icon svgIcon="google" class="google"></mat-icon>
      </button>
      <button
        (click)="clickMenu.emit(category.FUN)"
        (mouseenter)="enterMenu.emit(category.FUN)"
        (mouseleave)="mouseLeave.emit()"
      >
        <mat-icon>mood</mat-icon>
      </button>
      <button
        (click)="clickMenu.emit(category.OTHERS)"
        (mouseenter)="enterMenu.emit(category.OTHERS)"
        (mouseleave)="mouseLeave.emit()"
      >
        <mat-icon>more_horiz</mat-icon>
      </button>
    </div>
  `,
  styles: [
    // language=scss
    `
      .shortcuts-menu {
        width: 318px;
        height: 58px;
        position: absolute;
        bottom: 0;
        left: calc(100vw / 2 - 318px / 2);
        background-color: var(--color-bg-alt);
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        z-index: 2;

        button {
          border: none;
          background: none;
          color: var(--color-text);
          display: flex;
          align-items: center;

          &:hover {
            color: var(--color-primary);
            cursor: pointer;
          }
        }

        mat-icon:not(.google) {
          font-size: 40px;
          width: 40px;
          height: 40px;
        }

        mat-icon.google {
          font-size: 34px;
          width: 34px;
          height: 34px;
        }
      }
    `,
  ],
})
export class ShortcutsMenuComponent {
  @Output() public mouseLeave = new EventEmitter<void>()
  @Output() public clickMenu = new EventEmitter<ShortcutCategory>()
  @Output() public enterMenu = new EventEmitter<ShortcutCategory>()

  public category = ShortcutCategory

  constructor() {}
}
