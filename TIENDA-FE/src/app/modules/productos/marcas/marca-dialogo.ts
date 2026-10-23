import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';
import { Marca } from '../../../data/models/marca';
import { MarcaService } from '../../../data/services/marca.service';
import { Notificacion } from '../../../shared/notificacion.service';

@Component({
  selector: 'app-marca-dialogo',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ marca ? 'Editar marca' : 'Nueva marca' }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-dialog-content>
        <mat-form-field class="campo-completo">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" maxlength="60" cdkFocusInitial />
          <mat-hint align="end">{{ form.controls.nombre.value.length }}/60</mat-hint>
          @if (form.controls.nombre.hasError('required')) {
            <mat-error>El nombre es obligatorio</mat-error>
          }
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancelar</button>
        <button mat-flat-button type="submit" [disabled]="guardando()">
          {{ guardando() ? 'Guardando…' : 'Guardar' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
})
export class MarcaDialogo {
  protected readonly marca = inject<Marca | null>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<MarcaDialogo>);
  private readonly servicio = inject(MarcaService);
  private readonly notificacion = inject(Notificacion);

  protected readonly guardando = signal(false);
  protected readonly form = inject(FormBuilder).nonNullable.group({
    nombre: [this.marca?.nombre ?? '', [Validators.required, Validators.maxLength(60)]],
  });

  protected guardar() {
    const nombre = this.form.controls.nombre.value.trim();
    if (this.form.invalid || !nombre) {
      this.form.controls.nombre.setErrors({ required: true });
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    const peticion = this.marca
      ? this.servicio.actualizar(this.marca.idMarca, { nombre })
      : this.servicio.crear({ nombre });
    peticion.pipe(finalize(() => this.guardando.set(false))).subscribe({
      next: () => {
        this.notificacion.exito(this.marca ? 'Marca actualizada' : 'Marca creada');
        this.ref.close(true);
      },
      error: (error) => this.notificacion.error(error),
    });
  }
}
