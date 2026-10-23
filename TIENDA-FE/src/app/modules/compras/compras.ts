import { Component, inject } from '@angular/core';
import { Proveedor } from '../../data/models/comercial';
import { ProveedorService } from '../../data/services/comercial.service';
import { CrudConfig } from '../../shared/crud/crud';
import { CrudPagina } from '../../shared/crud/crud-pagina';

@Component({
  selector: 'app-proveedores',
  imports: [CrudPagina],
  template: '<app-crud-pagina [config]="config" />',
})
export class Proveedores {
  protected readonly config: CrudConfig<Proveedor> = {
    titulo: 'Proveedores',
    descripcion: 'Empresas que abastecen a la tienda',
    singular: 'proveedor',
    ruta: '/compras/proveedores',
    servicio: inject(ProveedorService),
    id: 'idProveedor',
    columnas: [
      { campo: 'nit', titulo: 'NIT', clase: 'col-fecha' },
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'contacto', titulo: 'Contacto' },
      { campo: 'telefono', titulo: 'Teléfono' },
      { campo: 'correo', titulo: 'Correo' },
      { campo: 'estado', titulo: 'Estado', tipo: 'estado' },
    ],
    campos: [
      { nombre: 'nit', etiqueta: 'NIT', requerido: true, largoMax: 15 },
      { nombre: 'nombre', etiqueta: 'Nombre', requerido: true, largoMax: 120 },
      { nombre: 'contacto', etiqueta: 'Contacto', largoMax: 100 },
      { nombre: 'telefono', etiqueta: 'Teléfono', largoMax: 15 },
      { nombre: 'correo', etiqueta: 'Correo', tipo: 'correo', largoMax: 100, completo: true },
      { nombre: 'direccion', etiqueta: 'Dirección', largoMax: 200, completo: true },
    ],
  };
}
