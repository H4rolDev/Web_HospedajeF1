import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalCategoriaProductosComponent } from './modal-categoria-productos/modal-categoria-productos.component';

@Component({
  selector: 'app-categorias-productos',
  templateUrl: './categorias-productos.component.html',
  styleUrl: './categorias-productos.component.css'
})
export class CategoriasProductosComponent {
  constructor(
      private BsModalRef:BsModalRef,
      private modalService: BsModalService,
    ){

    }

  AbrirModal(){
    this.BsModalRef = this.modalService.show(ModalCategoriaProductosComponent, {backdrop:'static', class: 'modal-lg'});
  }
}
