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
      number: new FormControl('', [Validators.required]),          // number
      description: new FormControl('', [Validators.required]),     // description
      dailyPrice: new FormControl('', [Validators.required, Validators.min(0)]),  // dailyPrice
      hourPrice: new FormControl('', [Validators.required, Validators.min(0)]),   // hourPrice
      roomTypeId: new FormControl('', [Validators.required]),      // ID del tipo de habitación
      capacity: new FormControl(1, [Validators.required, Validators.min(1)]),    // capacidad
      floor: new FormControl(1, [Validators.required, Validators.min(1)]),       // piso
      status: new FormControl('LIBRE'),                        // estado por defecto
      statusCleaning: new FormControl('LIMPIO'),               // estado limpieza por defecto
    });
  }

  ngOnInit(): void {
  this.formularioHabitacion = this.fb.group({
    number: [this.habitacionEditar?.number || '', Validators.required],
    description: [this.habitacionEditar?.description || '', Validators.required],
    dailyPrice: [this.habitacionEditar?.dailyPrice || 0, Validators.required],
    hourPrice: [this.habitacionEditar?.hourPrice || 0, Validators.required],
    capacity: [this.habitacionEditar?.capacity || 1, Validators.required],
    floor: [this.habitacionEditar?.floor || 1, Validators.required],
    status: [this.habitacionEditar?.status || 'LIBRE', Validators.required],
    statusCleaning: [this.habitacionEditar?.statusCleaning || 'LIMPIO', Validators.required],
    roomTypeId: [this.habitacionEditar?.roomTypeId ?? null, Validators.required]
  });

  this.cargarTiposHabitacion(); // no olvides cargar los tipos si estás editando
}

  cargarTiposHabitacion(): void {
    this.tipoHabitacionService.obtenerTipoHabitacion(0, 100).subscribe({
      next: (response) => {
        this.tiposHabitacion = response.content;
      },
      error: (err) => {
        console.error('Error al cargar tipos de habitación', err);
      }
    });
  }

  guardarHabitacion(): void {
  if (this.formularioHabitacion.invalid) return;

  const datos = this.formularioHabitacion.value;

  if (this.habitacionEditar?.id != null) {
    const datosActualizar: ActualizarHabitacionDTO = {
      id: this.habitacionEditar.id,
      number: datos.number,
      description: datos.description,
      dailyPrice: datos.dailyPrice,
      hourPrice: datos.hourPrice,
      capacity: datos.capacity,
      floor: datos.floor,
      status: datos.status,
      statusCleaning: datos.statusCleaning,
      roomTypeId: datos.roomTypeId
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
      status: datos.status,
      statusCleaning: datos.statusCleaning,
      roomTypeId: datos.roomTypeId
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
}
