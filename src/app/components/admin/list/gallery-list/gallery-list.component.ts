import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, Subscription, map } from 'rxjs';
import { CoverComponent } from '../../../shared/cover/cover.component';
import { environment } from '../../../../../environments/environments';
import { GalleryService } from '../../../../features/services/gallery.service';
import { DeleteConfirmationModalComponent } from '../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-gallery-list',
  standalone: true,
  imports: [CommonModule, CoverComponent, RouterLink, MatDialogModule],
  templateUrl: './gallery-list.component.html',
  styleUrl: './gallery-list.component.css'
})
export class GalleryListComponent {
  yourTitle: any = 'all Gallery information';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Gallery';
  emptyImg: any = environment.emptyImg;
  loading: boolean = true;
  gallery$?: Observable<any[]>;
  deleteGallerySubscription?: Subscription;
  companyID: any = environment.hospitalCode;
  isModalOpen = false;
  constructor(private galleryService: GalleryService, private dialog: MatDialog) { 
    if (!this.gallery$) {
      this.loading = false;
      this.gallery$ = galleryService.getCompanyGallery().pipe(
        map(doctors => doctors.sort((a, b) => a.galerySerial - b.galerySerial))
      );
    }
  }

  ngOnInit(): void {
    // this.gallery$ = this.galleryService.getCompanyGallery(this.companyID);

    // this.gallery$.subscribe(() => {
    //   this.loading = false;
    // });
  }
  
  onDelete(id: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.confirmDelete(id)
      }
    });
  }

  confirmDelete(id: any): void {
    this.deleteGallerySubscription = this.galleryService.deleteGallery(id).subscribe({
      next: () => {
        this.gallery$ = this.galleryService.getCompanyGallery();
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  ngOnDestroy(): void {
    this.deleteGallerySubscription?.unsubscribe();
  }

}
