import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Page Header -->
    <section class="page-header py-5 bg-light">
      <div class="container text-center">
        <h1 class="fw-bold">Contáctanos</h1>
        <p class="text-muted lead">Estamos aquí para ayudarte</p>
      </div>
    </section>

    <!-- Contact Content -->
    <section class="py-5">
      <div class="container">
        <div class="row g-5">
          <!-- Contact Info -->
          <div class="col-lg-5">
            <h4 class="mb-4">Información de Contacto</h4>
            
            <div class="contact-item d-flex mb-4">
              <div class="icon-box me-3">
                <i class="material-icons">location_on</i>
              </div>
              <div>
                <h6 class="mb-1">Dirección</h6>
                <p class="text-muted mb-0">Av. La Marina 1234, San Miguel<br>Lima, Perú</p>
              </div>
            </div>
            
            <div class="contact-item d-flex mb-4">
              <div class="icon-box me-3">
                <i class="material-icons">phone</i>
              </div>
              <div>
                <h6 class="mb-1">Teléfono</h6>
                <p class="text-muted mb-0">+51 999 888 777<br>+51 (01) 234-5678</p>
              </div>
            </div>
            
            <div class="contact-item d-flex mb-4">
              <div class="icon-box me-3">
                <i class="material-icons">email</i>
              </div>
              <div>
                <h6 class="mb-1">Email</h6>
                <p class="text-muted mb-0">info&#64;spawellness.com<br>reservas&#64;spawellness.com</p>
              </div>
            </div>
            
            <div class="contact-item d-flex mb-4">
              <div class="icon-box me-3">
                <i class="material-icons">schedule</i>
              </div>
              <div>
                <h6 class="mb-1">Horarios</h6>
                <p class="text-muted mb-0">
                  Lunes - Viernes: 9:00 - 20:00<br>
                  Sábado: 9:00 - 18:00<br>
                  Domingo: 10:00 - 14:00
                </p>
              </div>
            </div>
            
            <!-- Social Links -->
            <div class="social-links mt-4">
              <a href="#" class="social-link me-2"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="social-link me-2"><i class="fab fa-instagram"></i></a>
              <a href="#" class="social-link me-2"><i class="fab fa-whatsapp"></i></a>
              <a href="#" class="social-link"><i class="fab fa-tiktok"></i></a>
            </div>
          </div>
          
          <!-- Contact Form -->
          <div class="col-lg-7">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4 p-lg-5">
                <h4 class="mb-4">Envíanos un mensaje</h4>
                
                <form (ngSubmit)="onSubmit()" *ngIf="!submitted">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Nombre</label>
                      <input type="text" class="form-control form-control-lg" [(ngModel)]="form.name" name="name" required>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control form-control-lg" [(ngModel)]="form.email" name="email" required>
                    </div>
                    <div class="col-12">
                      <label class="form-label">Teléfono</label>
                      <input type="tel" class="form-control form-control-lg" [(ngModel)]="form.phone" name="phone">
                    </div>
                    <div class="col-12">
                      <label class="form-label">Asunto</label>
                      <select class="form-select form-select-lg" [(ngModel)]="form.subject" name="subject">
                        <option value="">Seleccionar...</option>
                        <option value="reserva">Consulta sobre reservas</option>
                        <option value="servicios">Información de servicios</option>
                        <option value="productos">Consulta sobre productos</option>
                        <option value="otros">Otros</option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label class="form-label">Mensaje</label>
                      <textarea class="form-control" rows="5" [(ngModel)]="form.message" name="message" required></textarea>
                    </div>
                    <div class="col-12">
                      <button type="submit" class="btn btn-gradient btn-lg w-100">
                        Enviar Mensaje
                      </button>
                    </div>
                  </div>
                </form>
                
                <!-- Success Message -->
                <div *ngIf="submitted" class="text-center py-5">
                  <div class="success-icon mb-4">
                    <i class="material-icons">check_circle</i>
                  </div>
                  <h4>¡Mensaje enviado!</h4>
                  <p class="text-muted">Nos pondremos en contacto contigo pronto.</p>
                  <button class="btn btn-outline-primary" (click)="resetForm()">
                    Enviar otro mensaje
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="ratio ratio-21x9" style="min-height: 300px;">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.5!2d-77.0!3d-12.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDAwJzAwLjAiUyA3N8KwMDAnMDAuMCJX!5e0!3m2!1ses!2spe!4v1234567890"
            style="border:0; border-radius: 12px;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-header {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    }
    .icon-box {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }
    .social-link {
      width: 40px;
      height: 40px;
      background: #f1f3f4;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #333;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    .social-link:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .btn-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      border-radius: 25px;
    }
    .btn-gradient:hover {
      color: white;
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
    .success-icon i {
      font-size: 80px;
      color: #28a745;
    }
  `]
})
export class ContactComponent {
  form = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };
  submitted = false;

  onSubmit(): void {
    // Simulate form submission
    console.log('Form submitted:', this.form);
    this.submitted = true;
  }

  resetForm(): void {
    this.form = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
    this.submitted = false;
  }
}
