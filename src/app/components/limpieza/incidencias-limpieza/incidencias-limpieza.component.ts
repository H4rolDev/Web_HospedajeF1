import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { CriterioBusquedaListaIncidenciasDTO } from '../../../dtos/criterio-busqueda-lista-incidencias';

@Component({
  selector: 'app-incidencias-limpieza',
  templateUrl: './incidencias-limpieza.component.html',
  styleUrl: './incidencias-limpieza.component.css'
})
export class IncidenciasLimpiezaComponent {
  dataFormGroup: FormGroup;

    criterioBusqueda = new CriterioBusquedaListaIncidenciasDTO();
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
      this.criterioBusqueda = new CriterioBusquedaListaIncidenciasDTO();
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
