import { Routes } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { HomeComponent } from './pages/home/home.component';
import { AllDoctorsComponent } from './pages/all-doctors/all-doctors.component';
import { DoctorComponent } from './pages/doctor/doctor.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { InstrumentGalleryComponent } from './pages/gallery/instrument-gallery/instrument-gallery.component';
import { HospitalGalleryComponent } from './pages/gallery/hospital-gallery/hospital-gallery.component';
import { DoctorsListComponent } from './components/admin/list/doctors-list/doctors-list.component';
import { AddDoctorComponent } from './components/admin/add/add-doctor/add-doctor.component';
import { EditDoctorComponent } from './components/admin/edit/edit-doctor/edit-doctor.component';
import { AboutUsComponent } from './components/admin/about-us/about-us.component';
import { ContactUsComponent } from './components/admin/contact-us/contact-us.component';
import { CarouselListComponent } from './components/admin/list/carousel-list/carousel-list.component';
import { AddCarouselComponent } from './components/admin/add/add-carousel/add-carousel.component';
import { EditCarouselComponent } from './components/admin/edit/edit-carousel/edit-carousel.component';
import { InstrumentListComponent } from './components/admin/list/instrument-list/instrument-list.component';
import { AddInstrumentComponent } from './components/admin/add/add-instrument/add-instrument.component';
import { EditInstrumentComponent } from './components/admin/edit/edit-instrument/edit-instrument.component';
import { GalleryListComponent } from './components/admin/list/gallery-list/gallery-list.component';
import { AddGalleryComponent } from './components/admin/add/add-gallery/add-gallery.component';
import { EditGalleryComponent } from './components/admin/edit/edit-gallery/edit-gallery.component';
import { HealthNewsListComponent } from './components/admin/list/health-news-list/health-news-list.component';
import { AddHealthNewsComponent } from './components/admin/add/add-health-news/add-health-news.component';
import { EditHealthNewsComponent } from './components/admin/edit/edit-health-news/edit-health-news.component';
import { HospitalNewsListComponent } from './components/admin/list/hospital-news-list/hospital-news-list.component';
import { AddHospitalNewsComponent } from './components/admin/add/add-hospital-news/add-hospital-news.component';
import { EditHospitalNewsComponent } from './components/admin/edit/edit-hospital-news/edit-hospital-news.component';
import { HospitalNewsComponent } from './pages/news/hospital-news/hospital-news.component';
import { HealthNewsComponent } from './pages/news/health-news/health-news.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'doctors',
        component: AllDoctorsComponent
      },
      {
        path: 'doctor/:id',
        component: DoctorComponent
      },
      {
        path: 'gallery/instrument',
        component: InstrumentGalleryComponent
      },
      {
        path: 'gallery/hospital',
        component: HospitalGalleryComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'hospital-news',
        component: HospitalNewsComponent
      },
      {
        path: 'health-news',
        component: HealthNewsComponent
      },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: DoctorsListComponent },
      { path: 'add', component: AddDoctorComponent },
      { path: 'edit/:id', component: EditDoctorComponent },
      { path: 'doctors', component: DoctorsListComponent },
      { path: 'doctors/add', component: AddDoctorComponent },
      { path: 'doctors/edit/:id', component: EditDoctorComponent },
      { path: 'about-us/:id', component: AboutUsComponent },
      { path: 'contact-us/:id', component: ContactUsComponent },
      { path: 'carousel', component: CarouselListComponent },
      { path: 'carousel/add', component: AddCarouselComponent },
      { path: 'carousel/edit/:id', component: EditCarouselComponent },
      { path: 'instrument-list', component: InstrumentListComponent },
      { path: 'instrument-list/add', component: AddInstrumentComponent },
      { path: 'instrument-list/edit/:id', component: EditInstrumentComponent },
      { path: 'gallery-list', component: GalleryListComponent },
      { path: 'gallery-list/add', component: AddGalleryComponent },
      { path: 'gallery-list/edit/:id', component: EditGalleryComponent },
      { path: 'healthNews-list', component: HealthNewsListComponent },
      { path: 'healthNews-list/add', component: AddHealthNewsComponent },
      { path: 'healthNews-list/edit/:id', component: EditHealthNewsComponent },
      { path: 'hospitalNews-list', component: HospitalNewsListComponent },
      { path: 'hospitalNews-list/add', component: AddHospitalNewsComponent },
      { path: 'hospitalNews-list/edit/:id', component: EditHospitalNewsComponent },
    ],
  },
];
