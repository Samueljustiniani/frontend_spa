import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SaleService } from '../../core/services/sale.service';
import { SaleResponse } from '../../core/interfaces/sale.interface';
import { catchError, finalize, of } from 'rxjs';

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
  errorMsg = '';

  constructor(
    private saleService: SaleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges();
    
    console.log('[SaleList] Cargando ventas');
    
    this.saleService.list().pipe(
      catchError((err) => {
        console.error('[SaleList] Error:', err);
        if (err.name === 'TimeoutError') {
          this.errorMsg = 'La carga está tardando demasiado.';
        } else if (err.status === 401) {
          this.errorMsg = 'No tienes autorización.';
        } else if (err.status === 0) {
          this.errorMsg = 'No se pudo conectar al servidor.';
        } else {
          this.errorMsg = `Error al cargar las ventas: ${err.message || 'Error desconocido'}`;
        }
        this.cdr.detectChanges();
        return of([]);
      }),
      finalize(() => {
        console.log('[SaleList] Petición completada');
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe((data) => {
      console.log('[SaleList] Datos recibidos:', data.length, 'ventas');
      this.sales = data;
      this.cdr.detectChanges();
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
