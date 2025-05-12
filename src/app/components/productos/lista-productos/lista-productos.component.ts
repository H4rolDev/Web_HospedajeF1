import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component } from '@angular/core';
import { ModalListaProductosComponent } from './modal-lista-productos/modal-lista-productos.component';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css'
})
export class ListaProductosComponent {

  constructor(
    private BsModalRef:BsModalRef,
    private modalService: BsModalService,
  ){

  }

  AbrirModal(){
    this.BsModalRef = this.modalService.show(ModalListaProductosComponent, {backdrop:'static', class: 'modal-lg'});
  }
}
