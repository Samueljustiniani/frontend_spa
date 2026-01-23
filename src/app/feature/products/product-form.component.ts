import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/interfaces/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  productId?: number;
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.productId = +id;
      this.loadProduct();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      status: ['A']
    });
  }

  loadProduct(): void {
    this.loading = true;
    this.productService.getById(this.productId!).subscribe({
      next: (product) => {
        this.form.patchValue(product);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const product: Product = this.form.value;

    const request$ = this.isEdit
      ? this.productService.update(this.productId!, product)
      : this.productService.create(product);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error saving product:', err);
        this.submitting = false;
      }
    });
  }

  // Helper para mostrar errores
  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
