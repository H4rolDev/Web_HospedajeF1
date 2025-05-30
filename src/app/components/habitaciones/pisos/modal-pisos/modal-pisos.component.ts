import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-pisos',
  templateUrl: './modal-pisos.component.html',
  styleUrl: './modal-pisos.component.css'
})
export class ModalPisosComponent {

  constructor(
      private bsModalPisos: BsModalRef,
    ){}

  CerrarModal(){
    this.bsModalPisos.hide();
  }
}
