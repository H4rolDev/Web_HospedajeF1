import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-categoria-productos',
  templateUrl: './modal-categoria-productos.component.html',
  styleUrl: './modal-categoria-productos.component.css'
})
export class ModalCategoriaProductosComponent {

  constructor(
    private bsModalTipoHabitacion: BsModalRef,
  ){}

  CerrarModal(){
    this.bsModalTipoHabitacion.hide();
  }
}
