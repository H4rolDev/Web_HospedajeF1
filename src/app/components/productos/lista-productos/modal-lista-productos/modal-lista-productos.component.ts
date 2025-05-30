import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-lista-productos',
  templateUrl: './modal-lista-productos.component.html',
  styleUrl: './modal-lista-productos.component.css'
})
export class ModalListaProductosComponent {

  constructor(
    private bsModalTipoHabitacion: BsModalRef,
  ){}

  CerrarModal(){
    this.bsModalTipoHabitacion.hide();
  }
}
