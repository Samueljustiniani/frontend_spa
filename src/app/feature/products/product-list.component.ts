import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/interfaces/product.interface';
import { catchError, finalize, of } from 'rxjs';

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
  showImageModal = false;
  selectedImageUrl = '';
  selectedImageName = '';

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges();
    
    console.log('[ProductList] Cargando productos con filtro:', this.statusFilter || 'todos');
    
    const request$ = this.statusFilter 
      ? this.productService.list(this.statusFilter)
      : this.productService.list();

    request$.pipe(
      catchError((err) => {
        console.error('[ProductList] Error:', err);
        if (err.name === 'TimeoutError') {
          this.errorMsg = 'La carga está tardando demasiado. Verifica tu conexión o intenta más tarde.';
        } else if (err.status === 401) {
          this.errorMsg = 'No tienes autorización. Por favor inicia sesión nuevamente.';
        } else if (err.status === 0) {
          this.errorMsg = 'No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.';
        } else {
          this.errorMsg = `Error al cargar los productos: ${err.message || err.statusText || 'Error desconocido'}`;
        }
        this.loading = false;
        this.cdr.detectChanges();
        return of([]);
      }),
      finalize(() => {
        console.log('[ProductList] Petición completada');
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe((data) => {
      console.log('[ProductList] Datos recibidos:', data.length, 'productos');
      this.products = data;
      this.cdr.detectChanges();
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

  viewImage(product: Product): void {
    if (product.imageUrl) {
      this.selectedImageUrl = product.imageUrl;
      this.selectedImageName = product.name;
      this.showImageModal = true;
    }
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.selectedImageUrl = '';
    this.selectedImageName = '';
  }
}
