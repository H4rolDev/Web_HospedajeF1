import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styleUrl: './siderbar.component.css',
  animations: [
    trigger('desplegar', [
      transition(':enter', [
        // Al aparecer, animar altura y opacidad
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        // Al desaparecer, animar altura y opacidad
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('300ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class SiderbarComponent {

  // Variables para controlar el estado de cada menú
  reservasAbierto: boolean = false;
  habitacionesAbierto: boolean = false;
  productosAbierto: boolean = false;
  empleadosAbierto: boolean = false;
  limpiezaAbierto: boolean = false;

  constructor(private authService: AuthService) {}
  // Función para alternar el menú de Reservas
  toggleReservas() {
    this.reservasAbierto = !this.reservasAbierto;
    this.cerrarOtrosMenus('reservas');
  }

  // Función para alternar el menú de Habitaciones
  toggleHabitaciones() {
    this.habitacionesAbierto = !this.habitacionesAbierto;
    this.cerrarOtrosMenus('habitaciones');
  }

  // Función para alternar el menú de Productos
  toggleProductos() {
    this.productosAbierto = !this.productosAbierto;
    this.cerrarOtrosMenus('productos');
  }

  // Función para alternar el menú de Empleados
  toggleEmpleados() {
    this.empleadosAbierto = !this.empleadosAbierto;
    this.cerrarOtrosMenus('empleados');
  }

  // Función para alternar el menú de Limpieza
  toggleLimpieza() {
    this.limpiezaAbierto = !this.limpiezaAbierto;
    this.cerrarOtrosMenus('limpieza');
  }

  // Función para cerrar los otros menús
  cerrarOtrosMenus(menuActual: string) {
    if (menuActual !== 'reservas') this.reservasAbierto = false;
    if (menuActual !== 'habitaciones') this.habitacionesAbierto = false;
    if (menuActual !== 'productos') this.productosAbierto = false;
    if (menuActual !== 'empleados') this.empleadosAbierto = false;
    if (menuActual !== 'limpieza') this.limpiezaAbierto = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
