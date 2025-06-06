import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Habitacion } from '../../../../dtos/lista-habitacion-dto';
import { HabitacionService } from '../../../../services/habitacion.service';
import Swal from 'sweetalert2';
import { TipoHabitacionService } from '../../../../services/tipo-habitacion.service';
import { TipoHabitacion } from '../../../../dtos/listado-tipo-habitacion-dto';
import { ActualizarHabitacionDTO, InsertarHabitacionDTO } from '../../../../dtos/insertar-habitacion-dto';

@Component({
  selector: 'app-modal-habitaciones',
  templateUrl: './modal-habitaciones.component.html',
  styleUrls: ['./modal-habitaciones.component.css']
})
export class ModalHabitacionesComponent {
  @Output() habitacionCreado = new EventEmitter<void>();
  @Input() habitacionEditar?: Habitacion;

  formularioHabitacion: FormGroup;
  cargando: boolean = false;
  error: string = '';
  exito: string = '';

  tiposHabitacion: TipoHabitacion[] = [];

  constructor(
    private bsModalHabitaciones: BsModalRef,
    private fb: FormBuilder,
    private habitacionService: HabitacionService,
    private tipoHabitacionService: TipoHabitacionService
  ) {
    this.formularioHabitacion = this.fb.group({
      number: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      dailyPrice: new FormControl('', [Validators.required, Validators.min(0)]),
      hourPrice: new FormControl('', [Validators.required, Validators.min(0)]),
      tipo_habitacion_id: new FormControl('', [Validators.required]),
      capacity: new FormControl(1, [Validators.required, Validators.min(1)]),
      floor: new FormControl(1, [Validators.required, Validators.min(1)]),
      status: new FormControl('LIBRE'),
      statusCleaning: new FormControl('LIMPIO'),
    });
  }

  ngOnInit(): void {
    this.cargarTiposHabitacion();
    this.formularioHabitacion = this.fb.group({
      number: [this.habitacionEditar?.number || '', Validators.required],
      description: [this.habitacionEditar?.description || '', Validators.required],
      dailyPrice: [this.getParsedValue(this.habitacionEditar?.dailyPrice), Validators.required],
      hourPrice: [this.getParsedValue(this.habitacionEditar?.hourPrice), Validators.required],
      capacity: [this.habitacionEditar?.capacity || 1, Validators.required],
      floor: [this.habitacionEditar?.floor || 1, Validators.required],
      status: new FormControl('LIBRE'),
      statusCleaning: new FormControl('LIMPIO'),
      tipo_habitacion_id: [this.habitacionEditar?.roomTypeId ?? null, Validators.required]
    });
  }

  cargarTiposHabitacion(): void {
    this.tipoHabitacionService.obtenerTipoHabitacion(0, 100).subscribe({
      next: (response) => {
        this.tiposHabitacion = response.content;

        console.log('Tipos cargados:', this.tiposHabitacion);
        console.log('ID seleccionado', this.habitacionEditar?.roomTypeId);
      },
      error: (err) => {
        console.error('Error al cargar tipos de habitación', err);
      }
    });
  }

  guardarHabitacion(): void {
    if (this.formularioHabitacion.invalid) {
      let camposInvalidos: string[] = [];

      Object.keys(this.formularioHabitacion.controls).forEach(campo => {
        let control = this.formularioHabitacion.get(campo);
        if (control && control.invalid) {
          camposInvalidos.push(campo);
        }
        control?.markAsTouched();
      });

      let mensaje = `Los siguientes campos son inválidos: ${camposInvalidos.join(', ')}`;
      this.MostrarMensajeError('Formulario inválido', mensaje);
      return;
    }

    let datos = this.formularioHabitacion.value;

    if (this.habitacionEditar?.id != null) {
      let datosActualizar: ActualizarHabitacionDTO = {
        id: this.habitacionEditar.id,
        number: datos.number,
        description: datos.description,
        dailyPrice: datos.dailyPrice,
        hourPrice: datos.hourPrice,
        capacity: datos.capacity,
        floor: datos.floor,
        status: 'LIBRE',
        statusCleaning: 'LIMPIO',
        tipo_habitacion_id: datos.tipo_habitacion_id
      };

      this.habitacionService.actualizarHabitacion(this.habitacionEditar.id, datosActualizar).subscribe({
        next: () => {
          this.MostrarMensajeSucces('Habitación actualizada', 'La habitación se ha actualizado correctamente.');
          this.habitacionCreado.emit();
          this.CerrarModal();
        },
        error: (err) => {
          console.error(err);
          this.MostrarMensajeError('Error al actualizar habitación', 'No se pudo actualizar la habitación.');
        }
      });

    } else {
      const datosInsertar: InsertarHabitacionDTO = {
        number: datos.number,
        description: datos.description,
        dailyPrice: datos.dailyPrice,
        hourPrice: datos.hourPrice,
        capacity: datos.capacity,
        floor: datos.floor,
        status: 'LIBRE',
        statusCleaning: 'LIMPIO',
        tipo_habitacion_id: datos.tipo_habitacion_id
      };

      this.habitacionService.InsertarHabitacion(datosInsertar).subscribe({
        next: () => {
          this.MostrarMensajeSucces('Habitación creada', 'La habitación se ha creado correctamente.');
          this.habitacionCreado.emit();
          this.CerrarModal();
        },
        error: (err) => {
          console.error(err);
          this.MostrarMensajeError('Error al crear habitación', 'No se pudo crear la habitación.');
        }
      });
    }
  }

  CerrarModal() {
    this.bsModalHabitaciones.hide();
  }

  MostrarMensajeSucces(title: string, mensaje: string) {
    Swal.fire({
      icon: "success",
      title: title,
      text: mensaje,
    });
  }

  MostrarMensajeError(titulo: string, mensaje: string) {
    Swal.fire({
      icon: "error",
      title: titulo,
      text: mensaje,
    });
  }

  private getParsedValue(obj: any): number {
    if (obj == null) return 0;
    if (typeof obj === 'number') return obj;
    if (typeof obj === 'object' && obj.parsedValue != null) return obj.parsedValue;
    return 0;
  }
}
