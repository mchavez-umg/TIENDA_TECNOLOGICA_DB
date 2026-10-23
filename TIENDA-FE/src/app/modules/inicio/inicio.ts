import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-inicio',
  imports: [MatCardModule],
  template: `
    <header class="pagina-encabezado">
      <div>
        <h1>Bienvenido, {{ auth.sesion()?.username }}</h1>
        <p>Seleccione una opción del menú para comenzar.</p>
      </div>
    </header>
  `,
})
export class Inicio {
  protected readonly auth = inject(AuthService);
}
