import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalCargoPersonalComponent } from './modal-cargo-personal/modal-cargo-personal.component';

@Component({
  selector: 'app-cargos-personal',
  templateUrl: './cargos-personal.component.html',
  styleUrl: './cargos-personal.component.css'
})
export class CargosPersonalComponent {
  constructor(
      private BsModalRef:BsModalRef,
      private modalService: BsModalService,
    ){

    }

  AbrirModal(){
    this.BsModalRef = this.modalService.show(ModalCargoPersonalComponent, {backdrop:'static', class: 'modal-lg'});
  }
}
