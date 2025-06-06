import { Company } from './../../../dtos/listado-company-dto';
import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CompanyService } from '../../../services/company.service';
import Swal from 'sweetalert2';
import { ModalCompanyComponent } from './modal-company/modal-company.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {
  // criterioBusqueda = new CriterioBusquedaListaReservaDTO();
  textoCriterioBusqueda: string = "";
  company: Company[] = [];
  cargando: boolean = false;
  error: string = '';

  constructor(
    private BsModalRef:BsModalRef,
    private modalService: BsModalService,
    private companyService: CompanyService
  ){

  }

  ngOnInit(): void {
    this.obtenerListaCompany();
  }

  obtenerListaCompany(): void {
    this.cargando = true;
    this.companyService.obtenerCompany().subscribe({
      next: (response) => {
        this.company = response;
        this.cargando = false;
      },
      error: (err) => {
        this.MostrarMensajeWarning('Error al cargar las compañias', 'No se pudieron cargar las compañias. Intente nuevamente más tarde.');
        this.error = err.message || 'Error al cargar las compañias.';
        this.cargando = false;
      }
    });
  }

  AbrirModal(){
    this.BsModalRef = this.modalService.show(ModalCompanyComponent, {backdrop:'static', class: 'modal-lg'});
    this.BsModalRef.content.companyCreado?.subscribe(() => {
      this.obtenerListaCompany();
    });
  }

  editarCompany(company: Company) {
    this.BsModalRef = this.modalService.show(ModalCompanyComponent, {
      backdrop: 'static',
      class: 'modal-lg',
      initialState: { companyEditar: company }
    });

    this.BsModalRef.content.companyCreado?.subscribe(() => {
      this.obtenerListaCompany();
    });
  }

  eliminarCompany(id: number) {
    this.MostrarMensajeEliminar(id);
  }

  MostrarMensajeEliminar(id: number){
    Swal.fire({
      title: "Eliminar Compañia",
      text: "¿Seguro de querer eliminar esta compañia?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.companyService.eliminarCompany(id).subscribe({
            next: () => {
              this.obtenerListaCompany();
            },
            error: (err) => {
              console.error(err);
              this.MostrarMensajeErrorCreacion();
            }
        })
        Swal.fire({
          title: "Eliminado!",
          text: "La compañia fue eliminada exitosamente.",
          icon: "success"
        });
      }
    });
  }

  MostrarMensajeWarning(titulo: string,mensaje: string) {
    Swal.fire({
      icon: "warning",
      title: titulo,
      text: mensaje,
    });
  }

  MostrarMensajeErrorCreacion(){
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al eliminar la compañia. Intente nuevamente en unos minutos.",
      });
    }
}
