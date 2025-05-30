import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClientService } from '../../../../services/client.service';
import { InsertarClienteDTO } from '../../../../dtos/insertar-cliente-dto';
import Swal from 'sweetalert2';
import { Cliente } from '../../../../dtos/listado-cliente-dto';
@Component({
  selector: 'app-modal-lista-clientes',
  templateUrl: './modal-lista-clientes.component.html',
  styleUrl: './modal-lista-clientes.component.css'
})
export class ModalListaClientesComponent {
  @Output() clienteCreado = new EventEmitter<void>();
  @Input() clienteEditar?: Cliente;

  formularioCliente: FormGroup;
  cargando: boolean = false;
  error: string = '';
  exito: string = '';

  constructor(
    private bsModalCliente: BsModalRef,
    private fb: FormBuilder,
    private clientesService: ClientService
  ){
    this.formularioCliente = this.fb.group({
      clientType: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      name: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.formularioCliente = this.fb.group({
      clientType: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      name: ['', Validators.required],
      phone: ['']
    });

    if (this.clienteEditar) {
      this.formularioCliente.patchValue(this.clienteEditar);
    }
  }

  guardarCliente() {
    if (this.formularioCliente.invalid) {
      this.formularioCliente.markAllAsTouched();
      return;
    }

    const datos = this.formularioCliente.value;

    if (this.clienteEditar) {
      this.clientesService.actualizarCliente(this.clienteEditar.id, datos).subscribe({
        next: () => {
          this.MostrarMensajeExito();
          this.clienteCreado.emit();
          this.CerrarModal();
        },
        error: (err) => {
          console.error(err);
          this.MostrarMensajeError('Error al actualizar cliente', 'No se pudo actualizar el cliente. Intente nuevamente más tarde.');
        }
      });
    } else {
      this.clientesService.InsertarCliente(datos).subscribe({
        next: () => {
          this.MostrarMensajeExito();
          this.clienteCreado.emit();
          this.CerrarModal();
        },
        error: (err) => {
          console.error(err);
          this.MostrarMensajeError('Error al registrar cliente', 'No se pudo registrar el cliente. Intente nuevamente más tarde.');
        }
      });
    }
  }

  RegistrarCliente(): void {
    if (this.formularioCliente.invalid) {
      this.formularioCliente.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.error = '';
    this.exito = '';

    const clienteData: InsertarClienteDTO = this.formularioCliente.value;

    this.clientesService.InsertarCliente(clienteData).subscribe({
      next: () => {
        this.MostrarMensajeExito();
        this.cargando = false;
        this.CerrarModal();
        this.clienteCreado.emit();
      },
      error: (err) => {
        if (err.status === 500 && err.error?.message?.includes('Duplicate entry')) {
          this.MostrarMensajeErrorCliente();
          this.error = 'Ya existe un cliente con ese número de documento.';
        } else {
          this.error = err.message || 'Error al registrar el cliente.';
        }
        this.cargando = false;
      }
    });
  }

  CerrarModal(){
    this.bsModalCliente.hide();
  }

  MostrarMensajeErrorCliente(){
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ya existe un cliente con ese número de documento.",
    });
  }

  MostrarMensajeExito(){
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Cliente registrado correctamente.",
    });
  }

  MostrarMensajeError(titulo: string, mensaje: string){
    Swal.fire({
      icon: "error",
      title: titulo,
      text: mensaje,
    });
  }
}
