import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SaleService } from '../../core/services/sale.service';
import { SaleResponse } from '../../core/interfaces/sale.interface';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent implements OnInit {
  sales: SaleResponse[] = [];
  loading = false;
  searchTerm = '';

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.loading = true;
    this.saleService.list().subscribe({
      next: (data) => {
        this.sales = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading sales:', err);
        this.loading = false;
      }
    });
  }

  cancelSale(id: number): void {
    if (confirm('¿Estás seguro de cancelar esta venta?')) {
      this.saleService.cancel(id).subscribe({
        next: () => this.loadSales(),
        error: (err) => console.error('Error canceling sale:', err)
      });
    }
  }

  getPaymentTypeLabel(type: string): string {
    return type === 'E' ? 'Efectivo' : type === 'T' ? 'Tarjeta' : type;
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
      case 'A': return 'Completada';
      case 'C': return 'Cancelada';
      case 'P': return 'Pendiente';
      default: return status;
    }
  }

  get filteredSales(): SaleResponse[] {
    if (!this.searchTerm) return this.sales;
    const term = this.searchTerm.toLowerCase();
    return this.sales.filter(s => 
      s.userName?.toLowerCase().includes(term) ||
      s.id?.toString().includes(term)
    );
  }
}
