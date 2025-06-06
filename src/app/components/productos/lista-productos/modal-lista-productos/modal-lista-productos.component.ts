import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Producto } from '../../../../dtos/listado-producto-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-lista-productos',
  templateUrl: './modal-lista-productos.component.html',
  styleUrl: './modal-lista-productos.component.css'
})
export class ModalListaProductosComponent {
  @Output() productoCreado = new EventEmitter<void>();
  @Input() productoEditar?: Producto;

  formularioproducto: FormGroup;
  cargando: boolean = false;
  error: string = '';
  exito: string = '';
  constructor(
    private bsModalproducto: BsModalRef,
    private fb: FormBuilder,
    private productoService: ProductService
  ){
    this.formularioproducto = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.formularioproducto = this.fb.group({
      name: ['', Validators.required],
    });

    if (this.productoEditar) {
      this.formularioproducto.patchValue(this.productoEditar);
    }
  }

  guardarProducto() {
    if (this.formularioproducto.invalid) {
      this.formularioproducto.markAllAsTouched();
      return;
    }

    const datos = this.formularioproducto.value;

    if (this.productoEditar) {
      this.productoService.actualizarProducto(this.productoEditar.id, datos).subscribe({
        next: () => {
          this.MostrarMensajeExito('Producto actualizado', 'El producto se ha actualizado correctamente.');
          this.productoCreado.emit();
          this.CerrarModal();
        },
        error: (err) => {
          console.error(err);
          this.MostrarMensajeError('Error al actualizar producto', 'No se pudo actualizar el producto. Intente nuevamente más tarde.');
        }
      });
    } else {
      this.productoService.InsertarProducto(datos).subscribe({
        next: () => {
          this.MostrarMensajeExito('Producto creado', 'El producto se ha creado correctamente.');
          this.productoCreado.emit();
          this.CerrarModal();
        },
        error: (err) => {
          console.error(err);
          this.MostrarMensajeError('Error al registrar producto', 'No se pudo registrar el producto. Intente nuevamente más tarde.');
        }
      });
    }
  }

  CerrarModal(){
    this.bsModalproducto.hide();
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
