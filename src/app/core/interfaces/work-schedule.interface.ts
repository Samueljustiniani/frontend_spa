export interface WorkSchedule {
  id?: number;
  dayOfWeek: string;  // "MONDAY", "TUESDAY", etc.
  openingTime: string;
  closingTime: string;
  status: string;  // "A" = Activo, "I" = Inactivo
}
