import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TipoHabitacion } from '../../../../dtos/listado-tipo-habitacion-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoHabitacionService } from '../../../../services/tipo-habitacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-tipos-habitaciones',
  templateUrl: './modal-tipos-habitaciones.component.html',
  styleUrl: './modal-tipos-habitaciones.component.css'
})
export class ModalTiposHabitacionesComponent {
  @Output() tipoHabitacionCreado = new EventEmitter<void>();
  @Input() tipoHabitacionEditar?: TipoHabitacion;

  formularioTipoHabitacion: FormGroup;
  cargando: boolean = false;
  error: string = '';
  exito: string = '';
  constructor(
    private bsModalTipoHabitacion: BsModalRef,
    private fb: FormBuilder,
    private tipoHabitacionService: TipoHabitacionService
  ){
    this.formularioTipoHabitacion = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.formularioTipoHabitacion = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    if (this.tipoHabitacionEditar) {
      this.formularioTipoHabitacion.patchValue(this.tipoHabitacionEditar);
    }
  }

  guardarTipoHabitacion() {
    if (this.formularioTipoHabitacion.invalid) {
      this.MostrarMensajeError('Formulario inválido', 'Por favor, complete todos los campos requeridos.');
      this.formularioTipoHabitacion.markAllAsTouched();
      return;
    }

    const datos = this.formularioTipoHabitacion.value;

    if (this.tipoHabitacionEditar) {
      this.tipoHabitacionService.actualizarTipoHabitacion(this.tipoHabitacionEditar.id, datos).subscribe({
        next: () => {
          this.MostrarMensajeExito('Tipo de habitación actualizado', 'El tipo de habitación se ha actualizado correctamente.');
          this.tipoHabitacionCreado.emit();
          this.CerrarModal();
        },
        error: (err) => {
          console.error(err);
          this.MostrarMensajeError('Error al actualizar tipo de habitacion', 'No se pudo actualizar el tipo de habitacion. Intente nuevamente más tarde.');
        }
      });
    } else {
      this.tipoHabitacionService.InsertarTipoHabitacion(datos).subscribe({
        next: () => {
          this.MostrarMensajeExito('Tipo de habitación creado', 'El tipo de habitación se ha creado correctamente.');
          this.tipoHabitacionCreado.emit();
          this.CerrarModal();
        },
        error: (err) => {
          console.error(err);
          this.MostrarMensajeError('Error al registrar tipo de habitacion', 'No se pudo registrar el tipo de habitacion. Intente nuevamente más tarde.');
        }
      });
    }
  }

  CerrarModal(){
    this.bsModalTipoHabitacion.hide();
  }

  MostrarMensajeExito(title: string, mensaje: string) {
    Swal.fire({
      icon: "success",
      title: title,
      text: mensaje,
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
