import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-cargo-personal',
  templateUrl: './modal-cargo-personal.component.html',
  styleUrl: './modal-cargo-personal.component.css'
})
export class ModalCargoPersonalComponent {
  constructor(
    private bsModalTipoHabitacion: BsModalRef,
  ){}

  CerrarModal(){
    this.bsModalTipoHabitacion.hide();
  }
}
