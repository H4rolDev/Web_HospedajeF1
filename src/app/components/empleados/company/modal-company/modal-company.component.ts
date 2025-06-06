import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company } from '../../../../dtos/listado-company-dto';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../../services/company.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-company',
  templateUrl: './modal-company.component.html',
  styleUrl: './modal-company.component.css'
})
export class ModalCompanyComponent {
  @Output() companyCreado = new EventEmitter<void>();
  @Input() companyEditar?: Company;

  formularioCompany: FormGroup;
  cargando: boolean = false;
  error: string = '';
  exito: string = '';
  constructor(
    private bsModalCompany: BsModalRef,
    private fb: FormBuilder,
    private companyService: CompanyService
  ){
    this.formularioCompany = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      ruc: ['', Validators.required],
      location: ['', Validators.required],
      phone: ['', Validators.required],
      logoUrl: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.formularioCompany = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      ruc: ['', Validators.required],
      location: ['', Validators.required],
      phone: ['', Validators.required],
      logoUrl: ['', Validators.required],
    });

    if (this.companyEditar) {
      this.formularioCompany.patchValue(this.companyEditar);
    }
  }

  guardarCompany() {
    if (this.formularioCompany.invalid) {
      this.MostrarMensajeError('Formulario inválido', 'Por favor, complete todos los campos requeridos.');
      this.formularioCompany.markAllAsTouched();
      return;
    }

    const datos = this.formularioCompany.value;

    if (this.companyEditar) {
      this.companyService.actualizarCompany(this.companyEditar.id, datos).subscribe({
        next: () => {
          this.MostrarMensajeExito('Empresa actualizado', 'La empresa se ha actualizado correctamente.');
          this.companyCreado.emit();
          this.CerrarModal();
        },
        error: (err) => {
          console.error(err);
          this.MostrarMensajeError('Error al actualizar empresa', 'No se pudo actualizar la empresa. Intente nuevamente más tarde.');
        }
      });
    } else {
      this.companyService.InsertarCompany(datos).subscribe({
        next: () => {
          this.MostrarMensajeExito('Empresa creada', 'La empresa se ha creado correctamente.');
          this.companyCreado.emit();
          this.CerrarModal();
        },
        error: (err) => {
          console.error(err);
          this.MostrarMensajeError('Error al registrar empresa', 'No se pudo registrar la empresa. Intente nuevamente más tarde.');
        }
      });
    }
  }

  CerrarModal(){
    this.bsModalCompany.hide();
  }

  MostrarMensajeExito(title: string, mensaje: string) {
    Swal.fire({
      icon: "success",
      title: title,
      text: mensaje,
    });
  }

  MostrarMensajeError(titulo: string, mensaje: string){
    Swal.fire({
      icon: "error",
      title: titulo,
      text: mensaje,
    });
  }
}
