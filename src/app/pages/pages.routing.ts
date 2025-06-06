import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarioComponent } from '../components/reservas/calendario/calendario.component';
import { GenerarReservaComponent } from '../components/reservas/generar-reserva/generar-reserva.component';
import { ListaReservasComponent } from '../components/reservas/lista-reservas/lista-reservas.component';
import { PisosComponent } from '../components/habitaciones/pisos/pisos.component';
import { TiposHabitacionComponent } from '../components/habitaciones/tipos-habitacion/tipos-habitacion.component';
import { ProductosComponent } from '../components/habitaciones/productos/productos.component';
import { ListaHabitacionesComponent } from '../components/habitaciones/lista-habitaciones/lista-habitaciones.component';
import { IncidenciasLimpiezaComponent } from '../components/limpieza/incidencias-limpieza/incidencias-limpieza.component';
import { ReportesLimpiezaComponent } from '../components/limpieza/reportes-limpieza/reportes-limpieza.component';
import { PermisosPersonalComponent } from '../components/empleados/permisos-personal/permisos-personal.component';
import { CargosPersonalComponent } from '../components/empleados/cargos-personal/cargos-personal.component';
import { ListaPersonalComponent } from '../components/empleados/lista-personal/lista-personal.component';
import { ListaProductosComponent } from '../components/productos/lista-productos/lista-productos.component';
import { CategoriasProductosComponent } from '../components/productos/categorias-productos/categorias-productos.component';
import { ListaClientesComponent } from '../components/reservas/lista-clientes/lista-clientes.component';
import { SinginComponent } from '../components/auth/singin/singin.component';
import { AuthGuard } from '../guards/auth.guard';
import { PagarReservaComponent } from '../components/reservas/pagar-reserva/pagar-reserva.component';

const routes: Routes = [
    { path: 'login', component: SinginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
      path: '',
      component: PagesComponent,
      canActivate: [AuthGuard],
      children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'lista-habitaciones', component: ListaHabitacionesComponent },
        { path: 'generar-reserva', component: GenerarReservaComponent },
        { path: 'calendario', component: CalendarioComponent },
        { path: 'lista-reservas', component: ListaReservasComponent },
        { path: 'lista-pisos', component: PisosComponent },
        { path: 'tipo-habitacion', component: TiposHabitacionComponent },
        { path: 'producto-habitacion', component: ProductosComponent },
        { path: 'incidencias-limpieza', component: IncidenciasLimpiezaComponent},
        { path: 'reportes-limpieza', component: ReportesLimpiezaComponent},
        { path: 'permisos-personal', component: PermisosPersonalComponent},
        { path: 'cargos-personal', component: CargosPersonalComponent},
        { path: 'lista-personal', component: ListaPersonalComponent},
        { path: 'lista-productos', component: ListaProductosComponent},
        { path: 'categoria-productos', component: CategoriasProductosComponent},
        { path: 'lista-clientes', component: ListaClientesComponent },
        { path: 'pagar-reserva/:id', component: PagarReservaComponent },

        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PagesRoutingModule { }
