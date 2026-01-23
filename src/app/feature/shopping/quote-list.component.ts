import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuoteService } from '../../core/services/quote.service';
import { QuoteResponse } from '../../core/interfaces/quote.interface';

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

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.loading = true;
    const request$ = this.filterDate 
      ? this.quoteService.getByDate(this.filterDate)
      : this.quoteService.list();
    
    request$.subscribe({
      next: (data) => {
        this.quotes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading quotes:', err);
        this.loading = false;
      }
    });
  }

  cancelQuote(id: number): void {
    if (confirm('¿Estás seguro de cancelar esta cita?')) {
      this.quoteService.cancel(id).subscribe({
        next: () => this.loadQuotes(),
        error: (err) => console.error('Error canceling quote:', err)
      });
    }
  }

  confirmQuote(id: number): void {
    this.quoteService.updateStatus(id, 'A').subscribe({
      next: () => this.loadQuotes(),
      error: (err) => console.error('Error confirming quote:', err)
    });
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
