import { ClientService } from './../../../services/client.service';
import { TipoHabitacionService } from './../../../services/tipo-habitacion.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InsertarClienteDTO } from '../../../dtos/insertar-cliente-dto';
import Swal from 'sweetalert2';
import moment from 'moment';
import { HabitacionService } from '../../../services/habitacion.service';
import { Habitacion } from '../../../dtos/lista-habitacion-dto';
import { TipoHabitacion } from '../../../dtos/listado-tipo-habitacion-dto';
import { Cliente } from '../../../dtos/listado-cliente-dto';
import { ReservationService } from '../../../services/reservation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generar-reserva',
  templateUrl: './generar-reserva.component.html',
  styleUrl: './generar-reserva.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-20px)', opacity: 0 }),
        animate('300ms 100ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})

export class GenerarReservaComponent {

  InsertarCliente = new InsertarClienteDTO;
  fechaActual = moment().toDate();
  reservationForm: FormGroup;
  currentStep = 1;
  totalSteps = 4;
  isSubmitting = false;
  documentTypes = ['DNI', 'Pasaporte'];
  clienteEncontrado: Cliente | null = null;

  tiposHabitacion: TipoHabitacion[] = [];

  habitacionesDisponibles: Habitacion[] = [];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private habitacionService: HabitacionService,
    private tipoHabitacionService: TipoHabitacionService,
    private reservaService: ReservationService,
    private router: Router,
  ) {
    this.reservationForm = this.fb.group({
      //Criterios de búsqueda
      startDate: [''],
      endDate: [''],
      roomTypeId: [''],

      // Cliente
      documentNumber: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      documentType: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(15)]],
      email: ['', [Validators.email]],
      nationality: [''],
      clientType: [''],
      clientId: [''],

      // Habitación
      roomIds: [[], Validators.required],
      rateTypeGlobal: ['DIA'],

      // Fechas
      checkInDate: ['', Validators.required],
      checkInTime: ['12:00', Validators.required],
      checkOutDate: ['', Validators.required],
      checkOutTime: ['10:00', Validators.required],

      notes: ['']
    });
  }

  toggleRoomSelection(roomId: number) {
    const roomIds = this.reservationForm.get('roomIds')!.value as number[];
    if (roomIds.includes(roomId)) {
      this.reservationForm.patchValue({
        roomIds: roomIds.filter(id => id !== roomId)
      });
    } else {
      this.reservationForm.patchValue({
        roomIds: [...roomIds, roomId]
      });
    }
  }

  BuscarHabitacionesPorCriterio(): void {
    let startDate = this.reservationForm.get('startDate')?.value;
    let endDate = this.reservationForm.get('endDate')?.value;
    let roomTypeIdRaw = this.reservationForm.get('roomTypeId')?.value;

    let fechasIncompletas = (startDate && !endDate) || (!startDate && endDate);
    let sinCriterios = !roomTypeIdRaw && !startDate && !endDate;

    if (fechasIncompletas) {
      this.MostrarNotificacionWarning('Debe ingresar ambas fechas: inicio y fin.', 'Advertencia');
      return;
    }

    if (sinCriterios) {
      this.MostrarNotificacionWarning('Debe ingresar al menos el tipo de habitación o el rango de fechas.', 'Advertencia');
      return;
    }

    let params: any = {};

    if (startDate && endDate) {
      let formattedStartDate = moment(startDate).format("YYYY-MM-DDTHH:mm:ss");
      let formattedEndDate = moment(endDate).format("YYYY-MM-DDTHH:mm:ss");

      if (formattedStartDate === 'Invalid date' || formattedEndDate === 'Invalid date') {
        this.MostrarNotificacionWarning('Fechas inválidas, por favor verifique.', 'Advertencia');
        return;
      }

      params.startDate = formattedStartDate;
      params.endDate = formattedEndDate;
    }

    if (roomTypeIdRaw) {
      params.roomTypeId = roomTypeIdRaw;
    }

    params.page = 0;
    params.size = 10;

    this.habitacionService.obtenerHabitacionesPorCriterios(params)
      .subscribe({
        next: (response) => {
          this.habitacionesDisponibles = response.content || response;
        },
        error: (error) => {
          console.error('Error al buscar habitaciones:', error);
        }
      });
  }

  ngOnInit(): void {
    this.ObtenerTiposHabitacion();
  }

  ObtenerTiposHabitacion(): void {
    this.tipoHabitacionService.obtenerTipoHabitacion(0, 10)
      .subscribe({
        next: (respuesta) => {
          this.tiposHabitacion = respuesta.content;
          console.log('Tipos de habitación:', this.tiposHabitacion);
        },
        error: (error) => {
          console.error('Error al obtener tipos de habitación', error);
        }
      });
  }

  buscarCliente(): void {
    const numeroDocumento = this.reservationForm.get('documentNumber')?.value;

    if (!numeroDocumento || numeroDocumento.length < 5) {
      this.MostrarNotificacionWarning('Ingrese un número de documento válido', 'Advertencia');
      return;
    }

    this.clientService.buscarClientePorDocumento(numeroDocumento).subscribe({
      next: (cliente: Cliente) => {
        this.clienteEncontrado = cliente;

        this.reservationForm.patchValue({
          clientId: cliente.id,
          documentNumber: cliente.documentNumber,
          documentType: cliente.documentType,
          name: cliente.name,
          phone: cliente.phone,
          email: cliente.email,
          nationality: cliente.nationality,
          clientType: cliente.clientType
        });
      },
      error: (err) => {
        this.clienteEncontrado = null;
        this.MostrarNotificacionWarning('Cliente no encontrado', 'Registre al cliente');
      }
    });
  }

  combineDateTime(date: string, time: string): string {
    const fullDate = new Date(date);
    if (time) {
      const [hours, minutes] = time.split(':');
      fullDate.setHours(Number(hours), Number(minutes));
    } else {
      fullDate.setHours(14, 0);
    }
    return fullDate.toISOString();
  }

  onSubmit() {
    if (this.reservationForm.invalid) {
      this.MostrarNotificacionWarning('Por favor, complete todos los campos requeridos', 'Advertencia');
      return;
    }

    this.isSubmitting = true;

    const form = this.reservationForm.value;

    const startDateTime = this.combineDateTime(form.checkInDate, form.checkInTime);
    const endDateTime = this.combineDateTime(form.checkOutDate, form.checkOutTime);

    const payload = {
      clientId: form.clientId,
      reservationRooms: form.roomIds.map((roomId: number) => ({
        roomId,
        rateType: form.rateTypeGlobal
      })),
      startDate: startDateTime,
      endDate: endDateTime,
      notes: form.notes
    };

    this.reservaService.insertarReserva(payload).subscribe({
      next: (response: any) => {
        this.MostrarNotificacionSuccessModal('Reserva creada exitosamente', 'Éxito');
        this.reservationForm.reset();
        this.isSubmitting = false;
        this.router.navigate(['/pagar-reserva', response.id]);
      },
      error: (error) => {
        console.error(error);
        this.MostrarNotificacionWarning('Error al crear la reserva', 'Error');
        this.isSubmitting = false;
      }
    });
  }

  cambiarRateTypeGlobal(nuevoRateType: string) {
    this.reservationForm.patchValue({ rateTypeGlobal: nuevoRateType });
  }

  LimpiarFiltros(): void {
    this.reservationForm.patchValue({
      roomTypeId: null,
      startDate: null,
      endDate: null
    });

    this.habitacionesDisponibles = [];
  }

  resetForm(): void {
    this.reservationForm.reset({
      checkInTime: '12:00',
      checkOutTime: '10:00'
    });
    this.currentStep = 1;
  }

  MostrarNotificacionWarning(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'warning',
      title: titulo,
      text: mensaje,
    });
  }

  MostrarNotificacionSuccessModal(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje
    });
  }
}
