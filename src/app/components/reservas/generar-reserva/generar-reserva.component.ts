import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client.service';
import { InsertarClienteDTO } from '../../../dtos/insertar-cliente-dto';
import Swal from 'sweetalert2';

interface Room {
  id: number;
  number: string;
  type: string;
  price: number;
  image: string;
  description: string;
}

interface ServiceType {
  id: number;
  name: string;
  description: string;
  additionalPrice: number;
}

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

  reservationForm: FormGroup;
  currentStep = 1;
  totalSteps = 4;
  isSubmitting = false;
  documentTypes = [
    { id: '1', name: 'DNIs' },
    { id: '2', name: 'Pasaporte' }
  ];

  rooms: Room[] = [
    {
      id: 1,
      number: '101',
      type: 'Individual',
      price: 85,
      image: 'assets/rooms/room1.jpg',
      description: 'Habitación individual con vistas a la ciudad'
    },
    {
      id: 2,
      number: '201',
      type: 'Doble',
      price: 120,
      image: 'assets/rooms/room2.jpg',
      description: 'Habitación doble con cama king size'
    },
    {
      id: 3,
      number: '301',
      type: 'Suite',
      price: 210,
      image: 'assets/rooms/room3.jpg',
      description: 'Suite de lujo con jacuzzi y vistas panorámicas'
    },
    {
      id: 4,
      number: '401',
      type: 'Familiar',
      price: 180,
      image: 'assets/rooms/room4.jpg',
      description: 'Habitación familiar con dos habitaciones separadas'
    }
  ];

  serviceTypes: ServiceType[] = [
    { id: 1, name: 'Básico', description: 'Incluye limpieza diaria', additionalPrice: 0 },
    { id: 2, name: 'Desayuno incluido', description: 'Desayuno buffet de 7:00 a 10:00', additionalPrice: 15 },
    { id: 3, name: 'Todo incluido', description: 'Todas las comidas y bebidas incluidas', additionalPrice: 45 },
    { id: 4, name: 'Premium', description: 'Todo incluido + spa y servicios exclusivos', additionalPrice: 75 }
  ];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService
  ) {
    this.reservationForm = this.fb.group({
      // Cliente
      documentType: ['', Validators.required],
      documentNumber: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],

      // Habitación
      roomId: ['', Validators.required],

      // Fechas
      checkInDate: ['', Validators.required],
      checkInTime: ['12:00', Validators.required],
      checkOutDate: ['', Validators.required],
      checkOutTime: ['10:00', Validators.required],

      // Servicios y precios
      serviceTypeId: ['', Validators.required],
      basePrice: [{ value: 0, disabled: true }],
      additionalPrice: [{ value: 0, disabled: true }],
      totalPrice: [{ value: 0, disabled: true }],
      comments: ['']
    });
  }

  ngOnInit(): void {
    // Detectar cambios en la habitación seleccionada para actualizar precios
    this.reservationForm.get('roomId')?.valueChanges.subscribe(roomId => {
      this.updatePrices();
    });

    // Detectar cambios en el tipo de servicio para actualizar precios
    this.reservationForm.get('serviceTypeId')?.valueChanges.subscribe(serviceId => {
      this.updatePrices();
    });

    // Detectar cambios en las fechas para calcular duración y precio
    this.reservationForm.get('checkInDate')?.valueChanges.subscribe(() => {
      this.updatePrices();
    });

    this.reservationForm.get('checkOutDate')?.valueChanges.subscribe(() => {
      this.updatePrices();
    });
  }


  getDocumentTypeName(typeId: string | null | undefined): string {
    if (!typeId) return '';
    const docType = this.documentTypes.find(d => d.id === typeId);
    return docType ? docType.name : '';
  }

  updatePrices(): void {
    const roomId = this.reservationForm.get('roomId')?.value;
    const serviceTypeId = this.reservationForm.get('serviceTypeId')?.value;
    const checkInDate = this.reservationForm.get('checkInDate')?.value;
    const checkOutDate = this.reservationForm.get('checkOutDate')?.value;

    // Obtener la habitación seleccionada
    const selectedRoom = this.rooms.find(room => room.id === parseInt(roomId));

    // Obtener el servicio seleccionado
    const selectedService = this.serviceTypes.find(service => service.id === parseInt(serviceTypeId));

    let basePrice = 0;
    let additionalPrice = 0;
    let totalPrice = 0;

    // Calcular precio base por la habitación si hay fechas válidas
    if (selectedRoom && checkInDate && checkOutDate) {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      // Calcular la diferencia en días
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Mínimo 1 día

      // Precio base = precio de habitación * días
      basePrice = selectedRoom.price * diffDays;

      // Adicional por servicios seleccionados
      if (selectedService) {
        additionalPrice = selectedService.additionalPrice * diffDays;
      }

      totalPrice = basePrice + additionalPrice;
    }

    // Actualizar campos de precio
    this.reservationForm.patchValue({
      basePrice,
      additionalPrice,
      totalPrice
    });
  }

  nextStep(): void {
    this.InsertarClientes();
    if (this.currentStep < this.totalSteps) {
      // Validar el paso actual antes de avanzar
      if (this.validateCurrentStep()) {
        this.currentStep++;
      }
    }
  }

  AsignarInformacionClienteDTO() {
    let nuevoItem = new InsertarClienteDTO;
    let tipoDocumento = this.reservationForm.controls['documentType'].value;
    let numeroDocumento = this.reservationForm.controls['documentNumber'].value;
    let nombre = this.reservationForm.controls['name'].value;
    let celular = this.reservationForm.controls['phone'].value;
    let tipoCliente = "";

    nuevoItem.clientType = tipoCliente;
    nuevoItem.documentType = tipoDocumento;
    nuevoItem.documentNumber = numeroDocumento;
    nuevoItem.name = nombre;
    nuevoItem.phone = celular;

    this.InsertarCliente = nuevoItem;
  }

  InsertarClientes() {
    this.AsignarInformacionClienteDTO();
    this.clientService.InsertarCliente(this.InsertarCliente)
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.MostrarNotificacionSuccessModal('Los datos se insertaron correctamente', 'Éxito');
          }
        },
        error: (e) => {
          this.MostrarNotificacionWarning('No se pudo insertar los datos,', 'Error');
          console.log('Error: ', e);
        },
        complete: () => {  }
      });
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateCurrentStep(): boolean {
    let isValid = false;

    switch(this.currentStep) {
      case 1: // Datos del cliente
        const clientControls = ['documentType', 'documentNumber', 'name', 'phone'];
        isValid = clientControls.every(control =>
          !this.reservationForm.get(control)?.invalid
        );
        break;

      case 2: // Selección de habitación
        isValid = !this.reservationForm.get('roomId')?.invalid;
        break;

      case 3: // Fechas y servicios
        const dateControls = ['checkInDate', 'checkInTime', 'checkOutDate', 'checkOutTime', 'serviceTypeId'];
        isValid = dateControls.every(control =>
          !this.reservationForm.get(control)?.invalid
        );

        // Validar que la fecha de salida sea posterior a la de entrada
        const checkIn = new Date(this.reservationForm.get('checkInDate')?.value);
        const checkOut = new Date(this.reservationForm.get('checkOutDate')?.value);

        if (checkOut <= checkIn) {
          isValid = false;
          alert('La fecha de salida debe ser posterior a la fecha de entrada');
        }
        break;

      case 4: // Resumen y confirmación
        isValid = true;
        break;
    }

    return isValid;
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      this.isSubmitting = true;

      // Aquí iría la lógica para enviar la reserva a tu backend
      console.log('Formulario enviado:', this.reservationForm.getRawValue());

      // Simulando una respuesta del servidor
      setTimeout(() => {
        this.isSubmitting = false;
        alert('¡Reserva realizada con éxito!');
        this.resetForm();
      }, 1500);
    } else {
      alert('Por favor complete todos los campos requeridos');
    }
  }

  resetForm(): void {
    this.reservationForm.reset({
      checkInTime: '12:00',
      checkOutTime: '10:00'
    });
    this.currentStep = 1;
  }

  // Obtener la habitación seleccionada
  getSelectedRoom(): Room | undefined {
    const roomId = this.reservationForm.get('roomId')?.value;
    return this.rooms.find(room => room.id === parseInt(roomId));
  }

  // Obtener el servicio seleccionado
  getSelectedService(): ServiceType | undefined {
    const serviceTypeId = this.reservationForm.get('serviceTypeId')?.value;
    return this.serviceTypes.find(service => service.id === parseInt(serviceTypeId));
  }

  // Calcular noches de estancia
  getNights(): number {
    const checkInDate = this.reservationForm.get('checkInDate')?.value;
    const checkOutDate = this.reservationForm.get('checkOutDate')?.value;

    if (checkInDate && checkOutDate) {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    }

    return 0;
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
