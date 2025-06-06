import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalHabitacionesComponent } from './modal-habitaciones/modal-habitaciones.component';
import moment from 'moment';
import { Habitacion } from '../../../dtos/lista-habitacion-dto';
import { FormControl, FormGroup } from '@angular/forms';
import { HabitacionService } from '../../../services/habitacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-habitaciones',
  templateUrl: './lista-habitaciones.component.html',
  styleUrl: './lista-habitaciones.component.css'
})
export class ListaHabitacionesComponent {
  dataFormGroup: FormGroup;
  textoCriterioBusqueda: string = "";
  fechaActual = moment().toDate();
  habitacion: Habitacion[] = [];
  cargando: boolean = false;
  error: string = '';

  constructor(
    private BsModalRef:BsModalRef,
    private modalService: BsModalService,
    private roomService: HabitacionService
  ){
    this.dataFormGroup = new FormGroup({
      documentNumber: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.obtenerListaHabitacion();
  }

  AbrirModal(){
    this.BsModalRef = this.modalService.show(ModalHabitacionesComponent, {backdrop:'static', class: 'modal-lg'});
    this.BsModalRef.content.habitacionCreado?.subscribe(() => {
      this.obtenerListaHabitacion();
    });
  }

  obtenerListaHabitacion(): void {
    this.cargando = true;
    this.roomService.obtenerHabitaciones(0, 50).subscribe({
      next: (response) => {
        this.habitacion = response.content;
        this.cargando = false;
      },
      error: (err) => {
        this.MostrarMensajeWarning('Error al cargar habitacion', 'No se pudieron cargar las habitaciones. Intente nuevamente más tarde.');
        this.error = err.message || 'Error al cargar habitacion.';
        this.cargando = false;
      }
    });
  }

  editarHabitacion(habitacion: Habitacion) {
    this.BsModalRef = this.modalService.show(ModalHabitacionesComponent, {
      backdrop: 'static',
      class: 'modal-lg',
      initialState: { habitacionEditar: habitacion }
    });

    this.BsModalRef.content.habitacionCreado?.subscribe(() => {
      this.obtenerListaHabitacion();
    });
  }

  eliminarHabitacion(id: number) {
    this.MostrarMensajeEliminar(id);
  }

  MostrarMensajeEliminar(id: number){
    Swal.fire({
      title: "Eliminar Habitacion",
      text: "¿Seguro de querer eliminar esta habitacion?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.roomService.eliminarHabitacion(id).subscribe({
            next: () => {
              this.obtenerListaHabitacion();
            },
            error: (err) => {
              console.error(err);
              this.MostrarMensajeErrorCreacion();
            }
        })
        Swal.fire({
          title: "Eliminado!",
          text: "La habitacion fue eliminada exitosamente.",
          icon: "success"
        });
      }
    });
  }

  MostrarMensajeErrorCreacion(){
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al eliminar la habitacion. Intente nuevamente en unos minutos.",
    });
  }

  MostrarMensajeWarning(titulo: string,mensaje: string) {
    Swal.fire({
      icon: "warning",
      title: titulo,
      text: mensaje,
    });
  }

  limpiarFiltros() {
    this.dataFormGroup.reset();
    this.obtenerListaHabitacion();
  }
}
