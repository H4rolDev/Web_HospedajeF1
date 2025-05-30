import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CriterioBusquedaListaReservaDTO } from '../../../dtos/lista-reserva-dto';
import moment from 'moment';

@Component({
  selector: 'app-lista-reservas',
  templateUrl: './lista-reservas.component.html',
  styleUrl: './lista-reservas.component.css'
})
export class ListaReservasComponent {
  dataFormGroup: FormGroup;

  criterioBusqueda = new CriterioBusquedaListaReservaDTO();
  textoCriterioBusqueda: string = "";
  fechaActual = moment().toDate();

  constructor(){
    this.dataFormGroup = new FormGroup({
      inputNroReserva: new FormControl(''),
      inputFechaInicio: new FormControl(''),
      inputFechaFin: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.AsignarDatosCriterio();
  }

  AsignarDatosCriterio(){
    this.criterioBusqueda = new CriterioBusquedaListaReservaDTO();
    this.textoCriterioBusqueda = "";

    let fechaInicio = this.dataFormGroup.controls['inputFechaInicio'].value;
    let fechaFin = this.dataFormGroup.controls['inputFechaFin'].value;

    if (fechaInicio != '' && fechaInicio != null) {
      this.criterioBusqueda.fechaInicio = moment(fechaInicio).format('YYYY-MM-DD');
      this.criterioBusqueda.fechaFin = moment().format('YYYY-MM-DD');
    }
    //else
    //  this.criterioBusqueda.fechaInicio = moment().format('YYYY-MM-DD');

    if (fechaFin != '' && fechaFin != null)
      this.criterioBusqueda.fechaFin = moment(fechaFin).format('YYYY-MM-DD');
  }
}
