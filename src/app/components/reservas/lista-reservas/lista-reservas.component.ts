import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { ReservationService } from '../../../services/reservation.service';
import { Reserva } from '../../../dtos/lista-reserva-dto';
import { PagarReservaComponent } from '../pagar-reserva/pagar-reserva.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-reservas',
  templateUrl: './lista-reservas.component.html',
  styleUrl: './lista-reservas.component.css'
})
export class ListaReservasComponent {
  form: FormGroup;
  reservas: Reserva[] = [];
  fechaActual = new Date();

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservationService,
    private router: Router
  ) {
    this.form = this.fb.group({
      inputNroReserva: [null],
      inputFechaInicio: [this.fechaActual],
      inputFechaFin: [this.fechaActual]
    });
  }

  ngOnInit(): void {
    this.buscarReservas();
  }

  buscarReservas(): void {
    const { inputNroReserva, inputFechaInicio, inputFechaFin } = this.form.value;

    const params = {
      clientId: 1,
      roomId: 1,
      status: '',
      fromDate: inputFechaInicio?.toISOString(),
      toDate: inputFechaFin?.toISOString(),
      page: 0,
      size: 50,
      sort: ''
    };

    this.reservaService.obtenerReservas(params).subscribe({
      next: (response) => {
        this.reservas = response.content || [];
      },
      error: (err) => {
        console.error('Error al obtener reservas:', err);
      }
    });
  }

  limpiarFormulario(): void {
    this.form.reset({
      inputNroReserva: null,
      inputFechaInicio: this.fechaActual,
      inputFechaFin: this.fechaActual
    });
    this.reservas = [];
  }

  verDetalles(id: number): void {
    this.router.navigate(['/pagar-reserva', id]);
  }
}
