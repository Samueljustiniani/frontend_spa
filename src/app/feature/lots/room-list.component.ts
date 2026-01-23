import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../core/interfaces/room.interface';

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

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.loading = true;
    this.roomService.list().subscribe({
      next: (data) => {
        this.rooms = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
        this.loading = false;
      }
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
