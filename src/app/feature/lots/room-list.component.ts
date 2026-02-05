import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../core/interfaces/room.interface';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private roomService: RoomService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges();
    
    console.log('[RoomList] Cargando salas');
    
    this.roomService.list().pipe(
      catchError((err) => {
        console.error('[RoomList] Error:', err);
        if (err.name === 'TimeoutError') {
          this.errorMsg = 'La carga está tardando demasiado.';
        } else if (err.status === 401) {
          this.errorMsg = 'No tienes autorización.';
        } else if (err.status === 0) {
          this.errorMsg = 'No se pudo conectar al servidor.';
        } else {
          this.errorMsg = `Error al cargar las salas: ${err.message || 'Error desconocido'}`;
        }
        this.cdr.detectChanges();
        return of([]);
      }),
      finalize(() => {
        console.log('[RoomList] Petición completada');
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe((data) => {
      console.log('[RoomList] Datos recibidos:', data.length, 'salas');
      this.rooms = data;
      this.cdr.detectChanges();
    });
  }

  deleteRoom(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta sala?')) {
      this.roomService.delete(id).subscribe({
        next: () => this.loadRooms(),
        error: (err) => console.error('Error deleting room:', err)
      });
    }
  }
}
