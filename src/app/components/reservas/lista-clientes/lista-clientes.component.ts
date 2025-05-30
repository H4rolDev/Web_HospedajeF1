import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CriterioBusquedaListaReservaDTO } from '../../../dtos/lista-reserva-dto';
import moment from 'moment';
import { Cliente } from '../../../dtos/listado-cliente-dto';
import { ClientService } from '../../../services/client.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalListaClientesComponent } from './modal-lista-clientes/modal-lista-clientes.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrl: './lista-clientes.component.css'
})
export class ListaClientesComponent {
  dataFormGroup: FormGroup;
  criterioBusqueda = new CriterioBusquedaListaReservaDTO();
  textoCriterioBusqueda: string = "";
  fechaActual = moment().toDate();
  clientes: Cliente[] = [];
  cargando: boolean = false;
  error: string = '';

  constructor(
    private clienteService: ClientService,
    private modalService: BsModalService,
    private BsModalRef:BsModalRef,
  ){
    this.dataFormGroup = new FormGroup({
      inputNroReserva: new FormControl(''),
      inputFechaInicio: new FormControl(''),
      inputFechaFin: new FormControl(''),
      documentNumber: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.obtenerListaClientes();
  }

  obtenerListaClientes(): void {
    this.cargando = true;
    this.clienteService.obtenerClientes(0, 50).subscribe({
      next: (response) => {
        this.clientes = response.content;
        this.cargando = false;
      },
      error: (err) => {
        this.MostrarMensajeWarning('Error al cargar clientes', 'No se pudieron cargar los clientes. Intente nuevamente más tarde.');
        this.error = err.message || 'Error al cargar clientes.';
        this.cargando = false;
      }
    });
  }

  AbrirModal(){
    this.BsModalRef = this.modalService.show(ModalListaClientesComponent, {backdrop:'static', class: 'modal-lg'});
    this.BsModalRef.content.clienteCreado?.subscribe(() => {
      this.obtenerListaClientes();
    });
  }

  editarCliente(cliente: Cliente) {
    this.BsModalRef = this.modalService.show(ModalListaClientesComponent, {
      backdrop: 'static',
      class: 'modal-lg',
      initialState: { clienteEditar: cliente }
    });

    this.BsModalRef.content.clienteCreado?.subscribe(() => {
      this.obtenerListaClientes();
    });
  }

  eliminarCliente(id: number) {
    this.MostrarMensajeEliminar(id);
  }

  MostrarMensajeEliminar(id: number){
    Swal.fire({
      title: "Eliminar Cliente",
      text: "¿Seguro de querer eliminar este cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.eliminarCliente(id).subscribe({
            next: () => {
              this.obtenerListaClientes();
            },
            error: (err) => {
              console.error(err);
              this.MostrarMensajeErrorCreacion();
            }
        })
        Swal.fire({
          title: "Eliminado!",
          text: "El cliente fue eliminado exitosamente.",
          icon: "success"
        });
      }
    });
  }

  MostrarMensajeErrorCreacion(){
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al eliminar el cliente. Intente nuevamente en unos minutos.",
    });
  }

  buscarPorDocumento() {
    const numeroDocumento = this.dataFormGroup.controls['documentNumber'].value;

    if (!numeroDocumento || numeroDocumento.trim() === '') {
      this.MostrarMensajeWarning('Sin resultados', 'Ingrese un número de documento para buscar.');
      return;
    }

    this.cargando = true;
    this.clienteService.buscarClientePorDocumento(numeroDocumento.trim()).subscribe({
      next: (cliente) => {
        this.clientes = [cliente];
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.MostrarMensajeWarning('Sin resultados','No se encontró ningún cliente con ese número de documento.');
        this.clientes = [];
        this.cargando = false;
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

  limpiarFiltros() {
    this.dataFormGroup.reset();
    this.obtenerListaClientes();
  }
}
