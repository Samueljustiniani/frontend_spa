import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {
  /**
   * Transforma una hora en formato 24h (HH:mm:ss o HH:mm) a formato 12h con AM/PM
   * Ejemplo: "14:30:00" -> "2:30 PM"
   */
  transform(time: string | null | undefined): string {
    if (!time) return '';
    
    // Extraer horas y minutos
    const parts = time.split(':');
    if (parts.length < 2) return time;
    
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    
    // Determinar AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convertir a formato 12h
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // 0 horas = 12 AM, 12 horas = 12 PM
    
    return `${hours}:${minutes} ${period}`;
  }
}
