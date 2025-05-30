import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalHabitacionesComponent } from '../../../habitaciones/lista-habitaciones/modal-habitaciones/modal-habitaciones.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Empleado } from '../../../../dtos/lista-empleado-dto';
import { EmployeeService } from '../../../../services/employee.service';
import Swal from 'sweetalert2';
import { InsertarEmpleadoDTO } from '../../../../dtos/insertar-empleado-dto';

@Component({
  selector: 'app-modal-lista-personal',
  templateUrl: './modal-lista-personal.component.html',
  styleUrl: './modal-lista-personal.component.css'
})
export class ModalListaPersonalComponent {
  @Output() empleadoCreado = new EventEmitter<void>();
  @Input() empleadoEditar?: Empleado;

  formularioEmpleado: FormGroup;
  cargando: boolean = false;
  error: string = '';
  exito: string = '';

  constructor(
    private bsModalPersonal: BsModalRef,
    private fb: FormBuilder,
    private empleadoService: EmployeeService
  ){
    this.formularioEmpleado = this.fb.group({
      documentType: new FormControl('',[Validators.required]),
      documentNumber: new FormControl('',[Validators.required, Validators.minLength(2)]),
      name: new FormControl('',[Validators.required]),
      lastName: new FormControl('',[Validators.required]),
      phone: new FormControl('',[Validators.required]),
      empresa: new FormControl(''),
      user: new FormControl(''),
      // inputColor: new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
      // inputMicrochip: new FormControl('',[Validators.pattern(/^\d+$/), Validators.minLength(10), Validators.maxLength(12)]),
      // inputFotoMascota: new FormControl(''),
      // inputObservaciones: new FormControl('',[Validators.maxLength(500)]),
    })
  }

  ngOnInit(): void {
    this.formularioEmpleado = this.fb.group({
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      name: ['', [Validators.required]],
      lastName: ['', Validators.required],
      phone: [''],
      empresa_id: [''],
      usuario_id: [''],
    });

    if (this.empleadoEditar) {
      this.formularioEmpleado.patchValue(this.empleadoEditar);
    }
  }

  guardarTrabajador() {
    if (this.formularioEmpleado.invalid) {
      this.formularioEmpleado.markAllAsTouched();
      this.MostrarMensajeError('Error de Registro', 'Por favor complete todos los campos obligatorios de manera correcta.');
      return;
    }

    const datos = this.formularioEmpleado.value;

    if (this.empleadoEditar) {
      this.empleadoService.actualizarEmpleado(this.empleadoEditar.id, datos).subscribe({
        next: () => {
          this.MostrarMensajeExito();
          this.empleadoCreado.emit();
          this.CerrarModal();
        },
        error: (err) => {
          console.error(err);
          this.MostrarMensajeError('Error al actualizar trabajador', 'No se pudo actualizar el trabajador. Intente nuevamente.');
        }
      });
    } else {
      this.empleadoService.InsertarEmpleado(datos).subscribe({
        next: () => {
          this.MostrarMensajeExito();
          this.empleadoCreado.emit();
          this.CerrarModal();
        },
        error: (err) => {
          console.error(err);
          this.MostrarMensajeError('Error al crear trabajador', 'No se pudo crear el trabajador. Intente nuevamente.');
        }
      });
    }
  }

  RegistrarTrabajador(): void {
    if (this.formularioEmpleado.invalid) {
      this.formularioEmpleado.markAllAsTouched();
      return;
    }
     this.cargando = true;
    this.error = '';
    this.exito = '';
     const empleadoData: InsertarEmpleadoDTO = this.formularioEmpleado.value;
     this.empleadoService.InsertarEmpleado(empleadoData).subscribe({
      next: () => {
        this.MostrarMensajeExito();
        this.cargando = false;
        this.CerrarModal();
        this.empleadoCreado.emit();
      },
      error: (err) => {
        if (err.status === 500 && err.error?.message?.includes('Duplicate entry')) {
          this.MostrarMensajeError('Error de Registro', 'Ya existe un trabajador con ese número de documento.');
          this.error = 'Ya existe un trabajador con ese número de documento.';
        } else {
          this.error = err.message || 'Error al registrar el trabajador.';
        }
        this.cargando = false;
      }
    });
  }

  CerrarModal(){
    this.bsModalPersonal.hide();
  }

  MostrarMensajeExito(){
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Trabajador registrado correctamente.",
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
