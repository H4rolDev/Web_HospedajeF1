import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalListaPersonalComponent } from './modal-lista-personal/modal-lista-personal.component';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { Empleado } from '../../../dtos/lista-empleado-dto';
import { EmployeeService } from '../../../services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-personal',
  templateUrl: './lista-personal.component.html',
  styleUrl: './lista-personal.component.css'
})
export class ListaPersonalComponent {

  dataFormGroup: FormGroup;
  textoCriterioBusqueda: string = "";
  fechaActual = moment().toDate();
  empleados: Empleado[] = [];
  cargando: boolean = false;
  error: string = '';

  constructor(
    private BsModalRef:BsModalRef,
    private modalService: BsModalService,
    private empleadoService: EmployeeService,
  ){
    this.dataFormGroup = new FormGroup({
      documentNumber: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.obtenerListaEmpleado();
  }

  obtenerListaEmpleado(): void {
    this.cargando = true;
    this.empleadoService.obtenerEmpleados(0, 50).subscribe({
      next: (response) => {
        this.empleados = response.content;
        this.cargando = false;
      },
      error: (err) => {
        this.MostrarMensajeWarning('Error al cargar trabajadores', 'No se pudieron cargar los trabajadores. Intente nuevamente más tarde.');
        this.error = err.message || 'Error al cargar trabajadores.';
        this.cargando = false;
      }
    });
  }

  AbrirModal(){
    this.BsModalRef = this.modalService.show(ModalListaPersonalComponent, {backdrop:'static', class: 'modal-lg'});
    this.BsModalRef.content.empleadoCreado?.subscribe(() => {
      this.obtenerListaEmpleado();
    });
  }

  editarEmpleado(empleado: Empleado) {
    this.BsModalRef = this.modalService.show(ModalListaPersonalComponent, {
      backdrop: 'static',
      class: 'modal-lg',
      initialState: { empleadoEditar: empleado }
    });

    this.BsModalRef.content.empleadoCreado?.subscribe(() => {
      this.obtenerListaEmpleado();
    });
  }

  eliminarEmpleado(id: number) {
    this.MostrarMensajeEliminar(id);
  }

  MostrarMensajeEliminar(id: number){
    Swal.fire({
      title: "Eliminar Empleado",
      text: "¿Seguro de querer eliminar este trabajador?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.empleadoService.eliminarEmpleado(id).subscribe({
            next: () => {
              this.obtenerListaEmpleado();
            },
            error: (err) => {
              console.error(err);
              this.MostrarMensajeErrorCreacion();
            }
        })
        Swal.fire({
          title: "Eliminado!",
          text: "El trabajador fue eliminado exitosamente.",
          icon: "success"
        });
      }
    });
  }

  buscarPorDocumento() {
    const numeroDocumento = this.dataFormGroup.controls['documentNumber'].value;

    if (!numeroDocumento || numeroDocumento.trim() === '') {
      this.MostrarMensajeWarning('Sin resultados', 'Ingrese un número de documento para buscar.');
      return;
    }

    this.cargando = true;
    this.empleadoService.buscarEmpleadoPorDocumento(numeroDocumento.trim()).subscribe({
      next: (empleado) => {
        this.empleados = [empleado];
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.MostrarMensajeWarning('Sin resultados','No se encontró ningún trabajadior con ese número de documento.');
        this.empleados = [];
        this.cargando = false;
      }
    });
  }

  MostrarMensajeErrorCreacion(){
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al eliminar el empleado. Intente nuevamente en unos minutos.",
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
    this.obtenerListaEmpleado();
  }
}
