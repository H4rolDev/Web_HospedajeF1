import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalListaPersonalComponent } from './modal-lista-personal/modal-lista-personal.component';

@Component({
  selector: 'app-lista-personal',
  templateUrl: './lista-personal.component.html',
  styleUrl: './lista-personal.component.css'
})
export class ListaPersonalComponent {

  constructor(
    private BsModalRef:BsModalRef,
    private modalService: BsModalService,
  ){

  }

  AbrirModal(){
    this.BsModalRef = this.modalService.show(ModalListaPersonalComponent, {backdrop:'static', class: 'modal-lg'});
  }
}
