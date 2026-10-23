import { AfterViewInit, Component, computed, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, finalize, switchMap } from 'rxjs';
import { MenuService } from '../../../core/menu.service';
import { Marca } from '../../../data/models/marca';
import { MarcaService } from '../../../data/services/marca.service';
import { Confirmacion } from '../../../shared/confirmacion/confirmacion';
import { Notificacion } from '../../../shared/notificacion.service';
import { MarcaDialogo } from './marca-dialogo';

@Component({
  selector: 'app-marcas',
  imports: [
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  templateUrl: './marcas.html',
})
export class Marcas implements AfterViewInit {
  private readonly servicio = inject(MarcaService);
  private readonly dialog = inject(MatDialog);
  private readonly notificacion = inject(Notificacion);
  private readonly confirmacion = inject(Confirmacion);
  private readonly sort = viewChild.required(MatSort);
  private readonly paginador = viewChild.required(MatPaginator);

  protected readonly permisos = inject(MenuService).permisos('/productos/marcas');
  protected readonly columnas = computed(() =>
    this.permisos()?.puedeEditar || this.permisos()?.puedeEliminar
      ? ['idMarca', 'nombre', 'estado', 'acciones']
      : ['idMarca', 'nombre', 'estado'],
  );
  protected readonly datos = new MatTableDataSource<Marca>([]);
  protected readonly cargando = signal(false);

  constructor() {
    this.cargar();
  }

  ngAfterViewInit() {
    this.datos.sort = this.sort();
    this.datos.paginator = this.paginador();
  }

  protected filtrar(valor: string) {
    this.datos.filter = valor.trim().toLowerCase();
    this.datos.paginator?.firstPage();
  }

  protected abrir(marca?: Marca) {
    this.dialog
      .open(MarcaDialogo, { data: marca ?? null, width: '440px' })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.cargar());
  }

  protected desactivar(marca: Marca) {
    this.confirmacion
      .preguntar({
        titulo: 'Desactivar marca',
        mensaje: `¿Desea desactivar la marca "${marca.nombre}"?`,
        accion: 'Desactivar',
      })
      .pipe(
        filter(Boolean),
        switchMap(() => this.servicio.desactivar(marca.idMarca)),
      )
      .subscribe({
        next: () => {
          this.notificacion.exito('Marca desactivada');
          this.cargar();
        },
        error: (error) => this.notificacion.error(error),
      });
  }

  private cargar() {
    this.cargando.set(true);
    this.servicio
      .listar()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (marcas) => (this.datos.data = marcas),
        error: (error) => this.notificacion.error(error),
      });
  }
}
