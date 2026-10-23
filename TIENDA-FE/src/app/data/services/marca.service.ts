import { Injectable } from '@angular/core';
import { API_URL } from '../../core/api';
import { Marca, MarcaRequest } from '../models/marca';
import { CrudService } from './crud.service';

@Injectable({ providedIn: 'root' })
export class MarcaService extends CrudService<Marca, MarcaRequest> {
  protected readonly url = `${API_URL}/marcas`;
}
