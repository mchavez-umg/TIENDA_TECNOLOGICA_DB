import { Component, inject, Injectable } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { map } from 'rxjs';

export interface DatosConfirmacion {
  titulo: string;
  mensaje: string;
  accion: string;
  peligro?: boolean;
}

@Component({
  selector: 'app-confirmacion-dialogo',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ datos.titulo }}</h2>
    <mat-dialog-content>{{ datos.mensaje }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close cdkFocusInitial>Cancelar</button>
      <button mat-flat-button [class.boton-peligro]="datos.peligro" [mat-dialog-close]="true">
        {{ datos.accion }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmacionDialogo {
  protected readonly datos = inject<DatosConfirmacion>(MAT_DIALOG_DATA);
}

@Injectable({ providedIn: 'root' })
export class Confirmacion {
  private readonly dialog = inject(MatDialog);

  preguntar(datos: DatosConfirmacion) {
    return this.dialog
      .open(ConfirmacionDialogo, { data: datos, width: '420px' })
      .afterClosed()
      .pipe(map(Boolean));
  }
}
