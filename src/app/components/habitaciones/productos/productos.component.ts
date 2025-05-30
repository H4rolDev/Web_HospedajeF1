import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalProductoHabitacionComponent } from './modal-producto-habitacion/modal-producto-habitacion.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  constructor(
    private BsModalRef:BsModalRef,
    private modalService: BsModalService,
  ){

  }

  AbrirModal(){
    this.BsModalRef = this.modalService.show(ModalProductoHabitacionComponent, {backdrop:'static', class: 'modal-lg'});
  }
}
