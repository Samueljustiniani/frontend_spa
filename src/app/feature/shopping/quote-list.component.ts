import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuoteService } from '../../core/services/quote.service';
import { QuoteResponse } from '../../core/interfaces/quote.interface';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-quote-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.scss']
})
export class QuoteListComponent implements OnInit {
  quotes: QuoteResponse[] = [];
  loading = false;
  filterDate = '';
  errorMsg = '';

  constructor(
    private quoteService: QuoteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges();
    
    console.log('[QuoteList] Cargando citas');
    
    const request$ = this.filterDate 
      ? this.quoteService.getByDate(this.filterDate)
      : this.quoteService.list();
    
    request$.pipe(
      catchError((err) => {
        console.error('[QuoteList] Error:', err);
        if (err.name === 'TimeoutError') {
          this.errorMsg = 'La carga está tardando demasiado.';
        } else if (err.status === 401) {
          this.errorMsg = 'No tienes autorización.';
        } else if (err.status === 0) {
          this.errorMsg = 'No se pudo conectar al servidor.';
        } else {
          this.errorMsg = `Error al cargar las citas: ${err.message || 'Error desconocido'}`;
        }
        this.cdr.detectChanges();
        return of([]);
      }),
      finalize(() => {
        console.log('[QuoteList] Petición completada');
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe((data) => {
      console.log('[QuoteList] Datos recibidos:', data.length, 'citas');
      this.quotes = data;
      this.cdr.detectChanges();
    });
  }

  cancelQuote(id: number): void {
    if (confirm('¿Estás seguro de cancelar esta cita?')) {
      this.quoteService.updateStatus(id, 'C').subscribe({
        next: () => this.loadQuotes(),
        error: (err) => console.error('Error canceling quote:', err)
      });
    }
  }

  changeStatus(id: number, status: string): void {
    const statusLabel = status === 'A' ? 'confirmar' : status === 'P' ? 'poner pendiente' : 'cambiar';
    if (confirm(`¿Estás seguro de ${statusLabel} esta cita?`)) {
      this.quoteService.updateStatus(id, status).subscribe({
        next: () => this.loadQuotes(),
        error: (err) => console.error('Error changing quote status:', err)
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'A': return 'bg-success';
      case 'C': return 'bg-danger';
      case 'P': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'A': return 'Confirmada';
      case 'C': return 'Cancelada';
      case 'P': return 'Pendiente';
      default: return status;
    }
  }

  onDateChange(): void {
    this.loadQuotes();
  }

  clearFilter(): void {
    this.filterDate = '';
    this.loadQuotes();
  }
}
