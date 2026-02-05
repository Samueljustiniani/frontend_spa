export interface ServiceEntity {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  gender: string;  // "M" = Masculino, "F" = Femenino, "U" = Unisex
  status: string;  // "A" = Activo, "I" = Inactivo
}

export interface ServiceDTO {
  id?: number;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  gender: string;
  status: string;
}
