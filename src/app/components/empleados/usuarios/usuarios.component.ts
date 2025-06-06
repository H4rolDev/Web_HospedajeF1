import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalUsuariosComponent } from './modal-usuarios/modal-usuarios.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

  constructor(
    private BsModalRef:BsModalRef,
    private modalService: BsModalService,
  ){

  }
  AbrirModal(){
    this.BsModalRef = this.modalService.show(ModalUsuariosComponent, {backdrop:'static', class: 'modal-lg'});
  }
}
