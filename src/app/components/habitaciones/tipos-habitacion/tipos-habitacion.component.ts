import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalTiposHabitacionesComponent } from './modal-tipos-habitaciones/modal-tipos-habitaciones.component';

@Component({
  selector: 'app-tipos-habitacion',
  templateUrl: './tipos-habitacion.component.html',
  styleUrl: './tipos-habitacion.component.css'
})
export class TiposHabitacionComponent {
  constructor(
    private BsModalRef:BsModalRef,
    private modalService: BsModalService,
  ){

  }

  AbrirModal(){
    this.BsModalRef = this.modalService.show(ModalTiposHabitacionesComponent, {backdrop:'static', class: 'modal-lg'});
  }
}
