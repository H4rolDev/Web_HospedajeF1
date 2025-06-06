import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from '../../../services/reservation.service';
import { PaymentService } from '../../../services/payment.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-pagar-reserva',
  templateUrl: './pagar-reserva.component.html',
  styleUrls: ['./pagar-reserva.component.css']
})
export class PagarReservaComponent implements OnInit {
  reservationId!: number;
  reservationDetails: any = null;

  amountToPay: number = 0;
  amount: number = 0;
  paymentMethod: string = 'EFECTIVO';

  paymentMethods = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'];

  isPaying = false;

  isCheckingIn = false;
  isCheckingOut = false;
  estaPagado = false;

  checkinDate: Date | null = null;

  extraDescription: string = '';
  extraPrice: number = 0;
  isSavingExtra = false;

  pagos: any[] = [];
  cargosExtra: any[] = [];

  clientName: string = '';

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private paymentService: PaymentService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.reservationId = +id;
        this.cargarDetallesReserva(this.reservationId);
      }
    });
  }

  cargarDetallesReserva(id: number) {
    forkJoin({
      detalles: this.reservationService.getReservationById(id),
      pagos: this.paymentService.getPagosReserva(id),
      cargos: this.paymentService.getCargosExtraReserva(id)
    }).subscribe({
      next: ({ detalles, pagos, cargos }) => {
        this.reservationDetails = detalles;
        this.pagos = pagos;
        this.cargosExtra = cargos;

        this.checkinDate = detalles.checkInDate;
        this.amountToPay = (detalles.totalPrice || 0) - (detalles.totalPaid || 0);
        this.estaPagado = this.amountToPay <= 0;

        this.clientService.getClientePorId(detalles.clientId).subscribe({
          next: (cliente) => {
            this.clientName = cliente.name;
          },
          error: (err) => {
            console.error('Error al obtener nombre del cliente', err);
            this.clientName = 'Nombre no disponible';
          }
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo cargar la reserva', 'error');
      }
    });
  }


  pagarReserva() {
    if (this.amountToPay <= 0) {
      Swal.fire('Info', 'La reserva ya está pagada en su totalidad', 'info');
      return;
    }

    if (!this.paymentMethod) {
      Swal.fire('Advertencia', 'Seleccione un método de pago', 'warning');
      return;
    }

    if (this.amount <= 0) {
      Swal.fire('Advertencia', 'Ingrese un monto válido', 'warning');
      return;
    }

    if (this.amount > this.amountToPay) {
      Swal.fire('Advertencia', 'El monto ingresado no puede ser mayor al total a pagar', 'warning');
      return;
    }

    this.isPaying = true;

    const payload = {
      reservationId: this.reservationId,
      amount: this.amount,
      paymentMethod: this.paymentMethod
    };

    this.paymentService.realizarPago(payload).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Pago realizado correctamente', 'success');
        this.isPaying = false;
        this.cargarDetallesReserva(this.reservationId);
        this.amount = 0;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Error al realizar el pago', 'error');
        this.isPaying = false;
      }
    });
  }

  realizarCheckIn() {
    if (this.reservationDetails.checkIn) {
      Swal.fire('Info', 'El check-in ya fue realizado', 'info');
      return;
    }

    this.isCheckingIn = true;

    this.reservationService.checkInReserva(this.reservationId).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Check-in realizado correctamente', 'success');
        this.cargarDetallesReserva(this.reservationId);
        this.isCheckingIn = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo realizar el check-in', 'error');
        this.isCheckingIn = false;
      }
    });
  }


  realizarCheckOut() {
    if (!this.reservationDetails.checkIn) {
      Swal.fire('Advertencia', 'Primero debe realizar el check-in', 'warning');
      return;
    }

    if (!this.estaPagado) {
      Swal.fire('Advertencia', 'El monto total de la reserva no ha sido pagado', 'warning');
      return;
    }

    if (this.reservationDetails.checkOut) {
      Swal.fire('Advertencia', 'El CheckOut ya fue realizado', 'warning');
      return;
    }

    this.isCheckingOut = true;

    this.reservationService.checkOutReserva(this.reservationId).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Check-out realizado correctamente', 'success');
        this.cargarDetallesReserva(this.reservationId);
        this.isCheckingOut = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo realizar el check-out', 'error');
        this.isCheckingOut = false;
      }
    });
  }

  guardarCargoExtra() {
    if (this.reservationDetails.checkOut) {
      Swal.fire('No permitido', 'El check-out ya fue realizado. No se pueden agregar más cargos extra.', 'warning');
      return;
    }

    if (!this.extraDescription.trim()) {
      Swal.fire('Advertencia', 'Debe ingresar una descripción', 'warning');
      return;
    }

    if (this.extraPrice <= 0) {
      Swal.fire('Advertencia', 'El precio debe ser mayor a 0', 'warning');
      return;
    }

    this.isSavingExtra = true;

    const payload = {
      reservationId: this.reservationId,
      description: this.extraDescription,
      price: this.extraPrice
    };

    this.paymentService.agregarCargoExtra(payload).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Cargo extra agregado', 'success');
        this.cargarDetallesReserva(this.reservationId);
        this.extraDescription = '';
        this.extraPrice = 0;
        this.isSavingExtra = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo agregar el cargo extra', 'error');
        this.isSavingExtra = false;
      }
    });
  }

  adjustDate(dateString: string): Date {
    const date = new Date(dateString);
    date.setHours(date.getHours() - 5);
    return date;
  }

  getFechaAjustada(fecha: string): string {
    return this.adjustDate(fecha).toLocaleString();
  }
}
