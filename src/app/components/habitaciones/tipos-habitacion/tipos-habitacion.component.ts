import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalTiposHabitacionesComponent } from './modal-tipos-habitaciones/modal-tipos-habitaciones.component';
import moment from 'moment';
import { FormGroup } from '@angular/forms';
import { TipoHabitacion } from '../../../dtos/listado-tipo-habitacion-dto';
import { TipoHabitacionService } from '../../../services/tipo-habitacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipos-habitacion',
  templateUrl: './tipos-habitacion.component.html',
  styleUrl: './tipos-habitacion.component.css'
})
export class TiposHabitacionComponent {
  // criterioBusqueda = new CriterioBusquedaListaReservaDTO();
  textoCriterioBusqueda: string = "";
  fechaActual = moment().toDate();
  tipoHabitacion: TipoHabitacion[] = [];
  cargando: boolean = false;
  error: string = '';

  constructor(
    private BsModalRef:BsModalRef,
    private modalService: BsModalService,
    private tipoHabitacionService: TipoHabitacionService
  ){

  }

  ngOnInit(): void {
    this.obtenerListaTipoHabitacion();
  }

  obtenerListaTipoHabitacion(): void {
    this.cargando = true;
    this.tipoHabitacionService.obtenerTipoHabitacion(0, 50).subscribe({
      next: (response) => {
        this.tipoHabitacion = response.content;
        this.cargando = false;
      },
      error: (err) => {
        this.MostrarMensajeWarning('Error al cargar los tipos habitacion', 'No se pudieron cargar los tipos habitacion. Intente nuevamente más tarde.');
        this.error = err.message || 'Error al cargar los tipos habitacion.';
        this.cargando = false;
      }
    });
  }

  AbrirModal(){
    this.BsModalRef = this.modalService.show(ModalTiposHabitacionesComponent, {backdrop:'static', class: 'modal-lg'});
    this.BsModalRef.content.tipoHabitacionCreado?.subscribe(() => {
      this.obtenerListaTipoHabitacion();
    });
  }

  editarTipoHabitacion(tipoHabitacion: TipoHabitacion) {
    this.BsModalRef = this.modalService.show(ModalTiposHabitacionesComponent, {
      backdrop: 'static',
      class: 'modal-lg',
      initialState: { tipoHabitacionEditar: tipoHabitacion }
    });

    this.BsModalRef.content.tipoHabitacionCreado?.subscribe(() => {
      this.obtenerListaTipoHabitacion();
    });
  }

  eliminarTipoHabitacion(id: number) {
    this.MostrarMensajeEliminar(id);
  }

  MostrarMensajeEliminar(id: number){
    Swal.fire({
      title: "Eliminar Tipo de Habitacion",
      text: "¿Seguro de querer eliminar este Tipo de Habitacion?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoHabitacionService.eliminarTipoHabitacion(id).subscribe({
            next: () => {
              this.obtenerListaTipoHabitacion();
            },
            error: (err) => {
              console.error(err);
              this.MostrarMensajeErrorCreacion();
            }
        })
        Swal.fire({
          title: "Eliminado!",
          text: "El Tipo de Habitacion fue eliminado exitosamente.",
          icon: "success"
        });
      }
    });
  }

  MostrarMensajeWarning(titulo: string,mensaje: string) {
    Swal.fire({
      icon: "warning",
      title: titulo,
      text: mensaje,
    });
  }

  MostrarMensajeErrorCreacion(){
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al eliminar el tipo de habitacion. Intente nuevamente en unos minutos.",
    });
  }
}
