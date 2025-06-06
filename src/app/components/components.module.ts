import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaReservasComponent } from './reservas/lista-reservas/lista-reservas.component';
import { CalendarioComponent } from './reservas/calendario/calendario.component';
import { TiposHabitacionComponent } from './habitaciones/tipos-habitacion/tipos-habitacion.component';
import { PisosComponent } from './habitaciones/pisos/pisos.component';
import { ProductosComponent } from './habitaciones/productos/productos.component';
import { ModalPisosComponent } from './habitaciones/pisos/modal-pisos/modal-pisos.component';
import { ModalTiposHabitacionesComponent } from './habitaciones/tipos-habitacion/modal-tipos-habitaciones/modal-tipos-habitaciones.component';
import { ModalProductoHabitacionComponent } from './habitaciones/productos/modal-producto-habitacion/modal-producto-habitacion.component';
import { ListaHabitacionesComponent } from './habitaciones/lista-habitaciones/lista-habitaciones.component';
import { ModalHabitacionesComponent } from './habitaciones/lista-habitaciones/modal-habitaciones/modal-habitaciones.component';
import { ReportesLimpiezaComponent } from './limpieza/reportes-limpieza/reportes-limpieza.component';
import { IncidenciasLimpiezaComponent } from './limpieza/incidencias-limpieza/incidencias-limpieza.component';
import { ListaPersonalComponent } from './empleados/lista-personal/lista-personal.component';
import { CargosPersonalComponent } from './empleados/cargos-personal/cargos-personal.component';
import { PermisosPersonalComponent } from './empleados/permisos-personal/permisos-personal.component';
import { ListaProductosComponent } from './productos/lista-productos/lista-productos.component';
import { CategoriasProductosComponent } from './productos/categorias-productos/categorias-productos.component';
import { ListaClientesComponent } from './reservas/lista-clientes/lista-clientes.component';
import { DxAutocompleteModule, DxButtonModule, DxChartModule, DxCheckBoxModule, DxDataGridModule, DxDateBoxModule, DxNumberBoxModule, DxRadioGroupModule, DxSchedulerModule, DxSelectBoxModule, DxTagBoxModule, DxTemplateModule } from 'devextreme-angular';
import { ModalListaProductosComponent } from './productos/lista-productos/modal-lista-productos/modal-lista-productos.component';
import { ModalCategoriaProductosComponent } from './productos/categorias-productos/modal-categoria-productos/modal-categoria-productos.component';
import { ModalListaPersonalComponent } from './empleados/lista-personal/modal-lista-personal/modal-lista-personal.component';
import { ModalCargoPersonalComponent } from './empleados/cargos-personal/modal-cargo-personal/modal-cargo-personal.component';
import { SinginComponent } from './auth/singin/singin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GenerarReservaComponent } from './reservas/generar-reserva/generar-reserva.component';
import { ModalListaClientesComponent } from './reservas/lista-clientes/modal-lista-clientes/modal-lista-clientes.component';
import { PagarReservaComponent } from './reservas/pagar-reserva/pagar-reserva.component';
import { RouterModule } from '@angular/router';
import { CompanyComponent } from './empleados/company/company.component';
import { ModalCompanyComponent } from './empleados/company/modal-company/modal-company.component';
import { UsuariosComponent } from './empleados/usuarios/usuarios.component';
import { ModalUsuariosComponent } from './empleados/usuarios/modal-usuarios/modal-usuarios.component';


@NgModule({
  declarations: [
    ListaHabitacionesComponent,
    ModalHabitacionesComponent,
    ListaReservasComponent,
    CalendarioComponent,
    TiposHabitacionComponent,
    PisosComponent,
    ProductosComponent,
    ModalPisosComponent,
    ModalTiposHabitacionesComponent,
    ModalProductoHabitacionComponent,
    ReportesLimpiezaComponent,
    IncidenciasLimpiezaComponent,
    ListaPersonalComponent,
    CargosPersonalComponent,
    PermisosPersonalComponent,
    ListaProductosComponent,
    CategoriasProductosComponent,
    ListaClientesComponent,
    ModalListaProductosComponent,
    ModalCategoriaProductosComponent,
    ModalListaPersonalComponent,
    ModalCargoPersonalComponent,
    SinginComponent,
    GenerarReservaComponent,
    ModalListaClientesComponent,
    PagarReservaComponent,
    CompanyComponent,
    ModalCompanyComponent,
    UsuariosComponent,
    ModalUsuariosComponent
  ],
  imports: [
    CommonModule,
    DxDateBoxModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ]
})
export class ComponentsModule { }
