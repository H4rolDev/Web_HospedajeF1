import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component } from '@angular/core';
import { ModalListaProductosComponent } from './modal-lista-productos/modal-lista-productos.component';
import { Producto } from '../../../dtos/listado-producto-dto';
import { ProductService } from '../../../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css'
})
export class ListaProductosComponent {
  textoCriterioBusqueda: string = "";
  producto: Producto[] = [];
  cargando: boolean = false;
  error: string = '';


  constructor(
    private BsModalRef:BsModalRef,
    private modalService: BsModalService,
    private productoService: ProductService
  ){

  }

  ngOnInit(): void {
    this.obtenerListaProducto();
  }

  obtenerListaProducto(): void {
    this.cargando = true;
    this.productoService.obtenerProducto(0, 50).subscribe({
      next: (response) => {
        this.producto = response.content;
        this.cargando = false;
      },
      error: (err) => {
        this.MostrarMensajeWarning('Error al cargar los productos', 'No se pudieron cargar los productos. Intente nuevamente más tarde.');
        this.error = err.message || 'Error al cargar los productos.';
        this.cargando = false;
      }
    });
  }

  editarProducto(producto: Producto) {
    this.BsModalRef = this.modalService.show(ModalListaProductosComponent, {
      backdrop: 'static',
      class: 'modal-lg',
      initialState: { productoEditar: producto }
    });

    this.BsModalRef.content.productoCreado?.subscribe(() => {
      this.obtenerListaProducto();
    });
  }

  eliminarProducto(id: number) {
    this.MostrarMensajeEliminar(id);
  }

  MostrarMensajeEliminar(id: number){
      Swal.fire({
        title: "Eliminar Producto",
        text: "¿Seguro de querer eliminar este Producto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.productoService.eliminarProducto(id).subscribe({
              next: () => {
                this.obtenerListaProducto();
              },
              error: (err) => {
                console.error(err);
                this.MostrarMensajeErrorCreacion('Error al eliminar el producto', 'No se pudo eliminar el producto. Intente nuevamente más tarde.');
              }
          })
          Swal.fire({
            title: "Eliminado!",
            text: "El Producto fue eliminado exitosamente.",
            icon: "success"
          });
        }
      });
    }

  AbrirModal(){
    this.BsModalRef = this.modalService.show(ModalListaProductosComponent, {backdrop:'static', class: 'modal-lg'});
    this.BsModalRef.content.productoCreado?.subscribe(() => {
      this.obtenerListaProducto();
    });
  }

  MostrarMensajeWarning(titulo: string,mensaje: string) {
    Swal.fire({
      icon: "warning",
      title: titulo,
      text: mensaje,
    });
  }

  MostrarMensajeErrorCreacion(title: string, mensaje: string){
    Swal.fire({
      icon: "error",
      title: title,
      text: mensaje,
    });
  }
}
