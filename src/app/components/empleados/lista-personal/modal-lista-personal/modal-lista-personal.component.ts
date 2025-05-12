import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalHabitacionesComponent } from '../../../habitaciones/lista-habitaciones/modal-habitaciones/modal-habitaciones.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-lista-personal',
  templateUrl: './modal-lista-personal.component.html',
  styleUrl: './modal-lista-personal.component.css'
})
export class ModalListaPersonalComponent {
  dataFormGroup: FormGroup;

  constructor(
    private bsModalPersonal: BsModalRef,
  ){
    this.dataFormGroup = new FormGroup({
      // inputPropietario: new FormControl('',[Validators.required]),
      // inputNombreMascota: new FormControl('',[Validators.required, Validators.minLength(2)]),
      // inputEspecie: new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
      // inputRaza: new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
      // inputFechaNacimiento: new FormControl('',[Validators.required]),
      // inputEdad: new FormControl('',[Validators.required]),
      // inputSexo: new FormControl('',[Validators.required]),
      // inputColor: new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
      // inputMicrochip: new FormControl('',[Validators.pattern(/^\d+$/), Validators.minLength(10), Validators.maxLength(12)]),
      // inputFotoMascota: new FormControl(''),
      // inputObservaciones: new FormControl('',[Validators.maxLength(500)]),
    })
  }

  get Controls(){
    return this.dataFormGroup.controls;
  }

  CerrarModal(){
    this.bsModalPersonal.hide();
  }
}
