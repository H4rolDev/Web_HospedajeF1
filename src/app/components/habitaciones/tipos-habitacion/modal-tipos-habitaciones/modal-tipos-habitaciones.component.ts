import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-tipos-habitaciones',
  templateUrl: './modal-tipos-habitaciones.component.html',
  styleUrl: './modal-tipos-habitaciones.component.css'
})
export class ModalTiposHabitacionesComponent {

  constructor(
        private bsModalTipoHabitacion: BsModalRef,
      ){}

  CerrarModal(){
    this.bsModalTipoHabitacion.hide();
  }

}
