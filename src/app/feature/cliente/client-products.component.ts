import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/interfaces/product.interface';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-client-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Page Header -->
    <section class="page-header py-5 bg-light">
      <div class="container text-center">
        <h1 class="fw-bold">Nuestros Productos</h1>
        <p class="text-muted lead">Los mejores productos para tu cuidado personal</p>
      </div>
    </section>

    <!-- Filters -->
    <section class="py-4">
      <div class="container">
        <div class="row g-3 align-items-center">
          <div class="col-md-6">
            <input type="text" class="form-control form-control-lg" 
                   placeholder="Buscar producto..." [(ngModel)]="searchTerm">
          </div>
          <div class="col-md-6 text-md-end">
            <span class="text-muted">{{ filteredProducts.length }} productos encontrados</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Products Grid -->
    <section class="py-4 pb-5">
      <div class="container">
        <!-- Loading -->
        <div *ngIf="loading" class="text-center py-5">
          <div class="spinner-border" role="status" style="width: 3rem; height: 3rem; color: #6B9080;"></div>
          <p class="mt-3 text-muted">Cargando productos...</p>          <small class=\"text-muted d-block mt-2\">El servidor puede tardar unos segundos en responder</small>        </div>

        <!-- Error Message -->
        <div *ngIf="!loading && errorMsg" class="alert alert-danger text-center" role="alert">
          {{ errorMsg }}
          <button class="btn btn-sm btn-outline-danger ms-2" (click)="loadProducts()">Reintentar</button>
        </div>

        <!-- Products List -->
        <div class="row g-4" *ngIf="!loading && !errorMsg">
          <div class="col-6 col-md-4 col-lg-3" *ngFor="let product of filteredProducts">
            <div class="card product-card h-100 border-0 shadow-sm">
              <div class="product-image">
                <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.name">
                <i *ngIf="!product.imageUrl" class="material-icons no-image">inventory_2</i>
              </div>
              <div class="card-body">
                <h6 class="card-title mb-2">{{ product.name }}</h6>
                <p class="card-text text-muted small mb-2">
                  {{ (product.description | slice:0:60) || 'Producto de calidad para tu bienestar.' }}
                  {{ product.description && product.description.length > 60 ? '...' : '' }}
                </p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="price">S/. {{ product.price | number:'1.2-2' }}</span>
                  <span class="badge" [class]="product.stock > 0 ? 'bg-success' : 'bg-danger'">
                    {{ product.stock > 0 ? 'Disponible' : 'Agotado' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12" *ngIf="filteredProducts.length === 0">
            <div class="text-center py-5">
              <i class="material-icons text-muted" style="font-size: 64px;">search_off</i>
              <h5 class="mt-3">No se encontraron productos</h5>
              <p class="text-muted">Intenta con otros términos de búsqueda</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-header {
      background: linear-gradient(135deg, rgba(107, 144, 128, 0.15) 0%, rgba(164, 195, 178, 0.15) 100%);
    }
    .product-card {
      border-radius: 12px;
      transition: all 0.3s ease;
      overflow: hidden;
    }
    .product-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
    }
    .product-image {
      height: 180px;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .product-image img {
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
    }
    .product-image .no-image {
      font-size: 48px;
      color: #ddd;
    }
    .price {
      color: #6B9080;
      font-weight: 700;
      font-size: 1.1rem;
    }
  `]
})
export class ClientProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  errorMsg = '';
  searchTerm = '';

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
    
    this.productService.listActivos().pipe(
      catchError((err) => {
        this.errorMsg = err.name === 'TimeoutError' 
          ? 'La carga está tardando demasiado. El servidor puede estar iniciando, intenta de nuevo en unos segundos.'
          : 'Ocurrió un error al cargar los productos. Verifica tu conexión.';
        this.cdr.detectChanges();
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe((data) => {
      console.log('[ClientProducts] Productos recibidos:', data.length);
      this.products = data;
      this.cdr.detectChanges();
    });
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
