import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-producto-habitacion',
  templateUrl: './modal-producto-habitacion.component.html',
  styleUrl: './modal-producto-habitacion.component.css'
})
export class ModalProductoHabitacionComponent {
constructor(
        private bsModalProductosHabitaciones: BsModalRef,
      ){}

  CerrarModal(){
    this.bsModalProductosHabitaciones.hide();
  }
}
