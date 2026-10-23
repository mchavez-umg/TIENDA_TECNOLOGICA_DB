import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export abstract class CrudService<T, R> {
  protected readonly http = inject(HttpClient);
  protected abstract readonly url: string;

  listar() {
    return this.http.get<T[]>(this.url);
  }

  obtener(id: number) {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  crear(request: R) {
    return this.http.post<T>(this.url, request);
  }

  actualizar(id: number, request: R) {
    return this.http.put<T>(`${this.url}/${id}`, request);
  }

  desactivar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
