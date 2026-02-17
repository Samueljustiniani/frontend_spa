import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SaleService } from '../../core/services/sale.service';
import { ProductService } from '../../core/services/product.service';
import { UserService } from '../../core/services/user.service';
import { Product } from '../../core/interfaces/product.interface';
import { UserDTO } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss']
})
export class SaleFormComponent implements OnInit {
  form!: FormGroup;
  products: Product[] = [];
  users: UserDTO[] = [];
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private productService: ProductService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.form = this.fb.group({
      userId: [null, Validators.required],
      paymentType: ['E', Validators.required],
      details: this.fb.array([])
    });
    this.addDetail();
  }

  loadData(): void {
    this.loading = true;
    this.productService.list().subscribe(p => this.products = p);
    this.userService.list().subscribe({
      next: (u) => {
        this.users = u;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  get details(): FormArray {
    return this.form.get('details') as FormArray;
  }

  addDetail(): void {
    this.details.push(this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  removeDetail(index: number): void {
    if (this.details.length > 1) {
      this.details.removeAt(index);
    }
  }

  getProductPrice(productId: number): number {
    const product = this.products.find(p => p.id === productId);
    return product?.price || 0;
  }

  getSubtotal(index: number): number {
    const detail = this.details.at(index);
    const productId = detail.get('productId')?.value;
    const quantity = detail.get('quantity')?.value || 0;
    return this.getProductPrice(productId) * quantity;
  }

  getTotal(): number {
    let total = 0;
    for (let i = 0; i < this.details.length; i++) {
      total += this.getSubtotal(i);
    }
    return total;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.saleService.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/admin/sales']),
      error: (err) => {
        console.error('Error creating sale:', err);
        this.submitting = false;
      }
    });
  }
}
