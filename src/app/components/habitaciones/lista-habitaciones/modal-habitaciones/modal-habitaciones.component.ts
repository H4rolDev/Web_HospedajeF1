import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HabitacionDTO } from '../../../../dtos/habitacion-dto';

@Component({
  selector: 'app-modal-habitaciones',
  templateUrl: './modal-habitaciones.component.html',
  styleUrl: './modal-habitaciones.component.css'
})
export class ModalHabitacionesComponent {

  dataFormGroup: FormGroup;
  habitaciones: HabitacionDTO[] = []

  constructor(
    private bsModalHabitaciones: BsModalRef,
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

  AsignarInformacionAControles(mascota: HabitacionDTO) {
    // this.dataFormGroup.controls['inputPropietario'].setValue(mascota.idCliente);
    // this.dataFormGroup.controls['inputNombreMascota'].setValue(mascota.nombreMascota);
    // this.dataFormGroup.controls['inputEspecie'].setValue(mascota.idEspecie);
    // this.dataFormGroup.controls['inputRaza'].setValue(mascota.idRaza);
    // this.dataFormGroup.controls['inputFechaNacimiento'].setValue(mascota.fechaNacimiento);
    // this.dataFormGroup.controls['inputSexo'].setValue(mascota.idSexo);
    // this.dataFormGroup.controls['inputColor'].setValue(mascota.color);
    // this.dataFormGroup.controls['inputMicrochip'].setValue(mascota.nroMicrochip);
  }

  CerrarModal(){
    this.bsModalHabitaciones.hide();
  }
}
