import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { SaleService } from '../../core/services/sale.service';
import { QuoteService } from '../../core/services/quote.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Cargar productos
    this.productService.list().subscribe({
      next: (products) => this.stats.totalProducts = products.length,
      error: () => {}
    });

    // Cargar ventas
    this.saleService.list().subscribe({
      next: (sales) => {
        this.stats.totalSales = sales.length;
        this.recentSales = sales.slice(0, 5);
        this.stats.revenue = sales
          .filter(s => s.status === 'A')
          .reduce((sum, s) => sum + (s.total || 0), 0);
      },
      error: () => {}
    });

    // Cargar citas
    const today = new Date().toISOString().split('T')[0];
    this.quoteService.list().subscribe({
      next: (quotes) => {
        this.stats.totalQuotes = quotes.length;
        this.todayQuotes = quotes.filter(q => q.quoteDate === today);
        this.stats.todayQuotes = this.todayQuotes.length;
      },
      error: () => {}
    });

    // Cargar usuarios
    this.userService.list().subscribe({
      next: (users) => {
        this.stats.totalUsers = users.length;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
