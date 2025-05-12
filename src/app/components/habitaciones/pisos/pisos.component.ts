import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalPisosComponent } from './modal-pisos/modal-pisos.component';

@Component({
  selector: 'app-pisos',
  templateUrl: './pisos.component.html',
  styleUrl: './pisos.component.css'
})
export class PisosComponent {
constructor(
    private BsModalRef:BsModalRef,
    private modalService: BsModalService,
  ){

  }

  AbrirModal(){
    this.BsModalRef = this.modalService.show(ModalPisosComponent, {backdrop:'static', class: 'modal-lg'});
  }
}
