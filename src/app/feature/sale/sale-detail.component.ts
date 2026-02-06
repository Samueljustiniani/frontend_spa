import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SaleService } from '../../core/services/sale.service';
import { SaleResponse } from '../../core/interfaces/sale.interface';

@Component({
  selector: 'app-sale-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="card">
          <div class="card-header d-flex justify-content-between">
            <h5 class="mb-0"><i class="material-icons me-2" style="vertical-align: middle;">receipt</i>Detalle de Venta #{{ sale?.id }}</h5>
            <a routerLink="/admin/sales" class="btn btn-outline-secondary btn-sm">
              <i class="material-icons me-1" style="font-size: 18px; vertical-align: middle;">arrow_back</i>Volver
            </a>
          </div>
          <div class="card-body" *ngIf="sale">
            <div class="row mb-4">
              <div class="col-md-6">
                <p><strong>Cliente:</strong> {{ sale.userName }}</p>
                <p><strong>Fecha:</strong> {{ sale.saleDate | date:'dd/MM/yyyy HH:mm' }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Tipo de Pago:</strong> 
                  <span class="badge" [class]="sale.paymentType === 'E' ? 'bg-success' : 'bg-primary'">
                    {{ sale.paymentType === 'E' ? 'Efectivo' : 'Tarjeta' }}
                  </span>
                </p>
                <p><strong>Estado:</strong> 
                  <span class="badge" [class]="sale.status === 'A' ? 'bg-success' : 'bg-danger'">
                    {{ sale.status === 'A' ? 'Completada' : 'Cancelada' }}
                  </span>
                </p>
              </div>
            </div>

            <h6>Productos</h6>
            <table class="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>P. Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let detail of sale.details">
                  <td>{{ detail.productName }}</td>
                  <td>{{ detail.quantity }}</td>
                  <td>S/. {{ detail.unitPrice | number:'1.2-2' }}</td>
                  <td class="fw-bold">S/. {{ detail.subtotal | number:'1.2-2' }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-end fw-bold">Total:</td>
                  <td class="text-success fw-bold fs-5">S/. {{ sale.total | number:'1.2-2' }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SaleDetailComponent implements OnInit {
  sale?: SaleResponse;

  constructor(
    private saleService: SaleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.saleService.getById(id).subscribe(s => this.sale = s);
  }
}
