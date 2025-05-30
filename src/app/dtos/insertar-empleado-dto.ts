export class InsertarEmpleadoDTO {
  documentType?:string;
  documentNumber?:string;
  name!:string;
  lastName!:string;
  phone!:string;
  empresa_id!:Number;
  usuario_id?:Number = 1;
}
