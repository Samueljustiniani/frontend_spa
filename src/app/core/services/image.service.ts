import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
}

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly API_URL: string;
  private readonly TIMEOUT = 60000; // 60 segundos para subida de imágenes

  constructor(private http: HttpClient) {
    // Usar la misma URL base que el resto de la API
    this.API_URL = `${environment.apiUrl}/images`;
  }

  /**
   * Sube una imagen a Cloudinary
   * @param file Archivo de imagen a subir
   * @returns Observable con la respuesta de Cloudinary
   */
  upload(file: File): Observable<CloudinaryResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CloudinaryResponse>(`${this.API_URL}/upload`, formData)
      .pipe(timeout(this.TIMEOUT));
  }

  /**
   * Elimina una imagen de Cloudinary
   * @param publicId ID público de la imagen en Cloudinary
   */
  delete(publicId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/delete`, { params: { public_id: publicId } })
      .pipe(timeout(this.TIMEOUT));
  }
}
