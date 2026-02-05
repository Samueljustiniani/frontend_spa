import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/interfaces/product.interface';
import { catchError, finalize, timeout, of } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  errorMsg = '';
  searchTerm = '';
  statusFilter = ''; // '', 'A', 'I'

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMsg = '';
    
    const request$ = this.statusFilter 
      ? this.productService.list(this.statusFilter)
      : this.productService.list();

    request$.pipe(
      timeout(10000),
      catchError((err) => {
        if (err.name === 'TimeoutError') {
          this.errorMsg = 'La carga está tardando demasiado. Verifica tu conexión o intenta más tarde.';
        } else {
          this.errorMsg = 'Ocurrió un error al cargar los productos.';
        }
        console.error('Error loading products:', err);
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((data) => {
      this.products = data;
    });
  }

  onFilterChange(): void {
    this.loadProducts();
  }

  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.delete(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Error deleting product:', err)
      });
    }
  }

  get filteredProducts(): Product[] {
    if (!this.searchTerm) return this.products;
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description?.toLowerCase().includes(term)
    );
  }
}
