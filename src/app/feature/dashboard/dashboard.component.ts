import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { SaleService } from '../../core/services/sale.service';
import { QuoteService } from '../../core/services/quote.service';
import { UserService } from '../../core/services/user.service';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TimeFormatPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalProducts: 0,
    totalSales: 0,
    totalQuotes: 0,
    totalUsers: 0,
    todayQuotes: 0,
    revenue: 0
  };
  loading = true;
  recentSales: any[] = [];
  todayQuotes: any[] = [];

  constructor(
    private productService: ProductService,
    private saleService: SaleService,
    private quoteService: QuoteService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Cargar productos
    this.productService.list().subscribe({
      next: (products) => {
        console.log('[Dashboard] Productos cargados:', products.length);
        this.stats.totalProducts = products.length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('[Dashboard] Error productos:', err)
    });

    // Cargar ventas
    this.saleService.list().subscribe({
      next: (sales) => {
        console.log('[Dashboard] Ventas cargadas:', sales.length);
        this.stats.totalSales = sales.length;
        this.recentSales = sales.slice(0, 5);
        this.stats.revenue = sales
          .filter(s => s.status === 'A')
          .reduce((sum, s) => sum + (s.total || 0), 0);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('[Dashboard] Error ventas:', err)
    });

    // Cargar citas
    const today = new Date().toISOString().split('T')[0];
    this.quoteService.list().subscribe({
      next: (quotes) => {
        console.log('[Dashboard] Citas cargadas:', quotes.length);
        this.stats.totalQuotes = quotes.length;
        this.todayQuotes = quotes.filter(q => q.quoteDate === today);
        this.stats.todayQuotes = this.todayQuotes.length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('[Dashboard] Error citas:', err)
    });

    // Cargar usuarios
    this.userService.list().subscribe({
      next: (users) => {
        console.log('[Dashboard] Usuarios cargados:', users.length);
        this.stats.totalUsers = users.length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Dashboard] Error usuarios:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
