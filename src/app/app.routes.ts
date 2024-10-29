import { Routes } from '@angular/router';
import { MainComponent } from './pages/layouts/main/main.component';
import { HomeComponent } from './pages/main/home/home.component';
import { AllDoctorsComponent } from './pages/main/all-doctors/all-doctors.component';
import { DoctorComponent } from './pages/main/doctor/doctor.component';
import { AdminComponent } from './pages/layouts/admin/admin.component';
import { AboutComponent } from './pages/main/about/about.component';
import { ContactComponent } from './pages/main/contact/contact.component';
import { InstrumentGalleryComponent } from './pages/main/gallery/instrument-gallery/instrument-gallery.component';
import { HospitalGalleryComponent } from './pages/main/gallery/hospital-gallery/hospital-gallery.component';
import { AboutUsComponent } from './pages/serial/MIS/about-us/about-us.component';
import { ContactUsComponent } from './pages/serial/MIS/contact-us/contact-us.component';
import { CarouselListComponent } from './pages/serial/MIS/list/carousel-list/carousel-list.component';
import { AddCarouselComponent } from './pages/serial/MIS/add/add-carousel/add-carousel.component';
import { EditCarouselComponent } from './pages/serial/MIS/all-edit/edit-carousel/edit-carousel.component';
import { InstrumentListComponent } from './pages/serial/MIS/list/instrument-list/instrument-list.component';
import { AddInstrumentComponent } from './pages/serial/MIS/add/add-instrument/add-instrument.component';
import { EditInstrumentComponent } from './pages/serial/MIS/all-edit/edit-instrument/edit-instrument.component';
import { GalleryListComponent } from './pages/serial/MIS/list/gallery-list/gallery-list.component';
import { AddGalleryComponent } from './pages/serial/MIS/add/add-gallery/add-gallery.component';
import { EditGalleryComponent } from './pages/serial/MIS/all-edit/edit-gallery/edit-gallery.component';
import { HealthNewsListComponent } from './pages/serial/MIS/list/health-news-list/health-news-list.component';
import { AddHealthNewsComponent } from './pages/serial/MIS/add/add-health-news/add-health-news.component';
import { EditHealthNewsComponent } from './pages/serial/MIS/all-edit/edit-health-news/edit-health-news.component';
import { HospitalNewsListComponent } from './pages/serial/MIS/list/hospital-news-list/hospital-news-list.component';
import { AddHospitalNewsComponent } from './pages/serial/MIS/add/add-hospital-news/add-hospital-news.component';
import { EditHospitalNewsComponent } from './pages/serial/MIS/all-edit/edit-hospital-news/edit-hospital-news.component';
import { HospitalNewsComponent } from './pages/main/news/hospital-news/hospital-news.component';
import { HealthNewsComponent } from './pages/main/news/health-news/health-news.component';
import { SerialMainComponent } from './pages/layouts/serial-main/serial-main.component';
import { SerialAdminComponent } from './pages/layouts/serial-admin/serial-admin.component';
import { DepartmentsComponent } from './pages/serial/departments/departments.component';
import { AppointmentFormComponent } from './pages/serial/appointment-form/appointment-form.component';
import { MyAppointmentsComponent } from './pages/serial/my-appointments/my-appointments.component';
import { DoctorListComponent } from './components/serial/doctors-list/doctors-list.component';
import { SerialDoctorComponent } from './pages/serial/doctor/doctor.component';
import { AllDepartmentComponent } from './pages/serial/all-department/all-department.component';
import { SerialAllDoctorsComponent } from './pages/serial/all-doctors/all-doctors.component';
import { RedirectComponent } from './pages/serial/redirect.component';
import { AllUsersComponent } from './pages/serial/all-users/all-users.component';
import { AllAppointmentComponent } from './pages/serial/all-appointment/all-appointment.component';
import { DepartmentComponent } from './pages/main/department/department.component';
import { MainDoctorListComponent } from './pages/main/doctors-list/doctors-list.component';
import { ServicesListComponent } from './pages/serial/MIS/list/services-list/services-list.component';
import { AddServicesComponent } from './pages/serial/MIS/add/add-services/add-services.component';
import { EditServicesComponent } from './pages/serial/MIS/all-edit/edit-services/edit-services.component';
import { ReportLayoutComponent } from './pages/layouts/report-layout/report-layout.component';
import { CareerComponent } from './pages/main/career/career.component';
import { CareerListComponent } from './pages/serial/MIS/list/career-list/career-list.component';
import { AddCareerComponent } from './pages/serial/MIS/add/add-career/add-career.component';
import { EditCareerComponent } from './pages/serial/MIS/all-edit/edit-career/edit-career.component';
import { DeleteComponent } from './pages/serial/MIS/delete/delete.component';

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
        path: 'career',
        component: CareerComponent
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
        path: 'sd-hospital-news',
        component: HospitalNewsComponent
      },
      {
        path: 'digital-diagnostic-news',
        component: HealthNewsComponent
      },
      { path: 'departments', component: DepartmentComponent },
      {
        path: 'department/:department',
        component: MainDoctorListComponent
      },
    ],
  },
  {
    path: 'serial',
    component: SerialMainComponent,
    children: [
      {
        path: '',
        component: DepartmentsComponent
      },
      {
        path: 'appointment-form',
        component: AppointmentFormComponent
      },
      {
        path: 'my-appointments',
        component: MyAppointmentsComponent
      },
      {
        path: 'department/:department',
        component: DoctorListComponent
      },
      {
        path: 'doctor/:id',
        component: SerialDoctorComponent
      },
    ],
  },
  {
    path: 'serial/admin',
    component: SerialAdminComponent,
    children: [
      { path: '', component: AllDepartmentComponent },
      { path: 'department-list', component: AllDepartmentComponent },
      { path: 'doctors', component: SerialAllDoctorsComponent },
      { path: 'all-appointment', component: RedirectComponent },
      { path: 'all-user', component: AllUsersComponent },
      {
        path: 'all-mis',
        component: AdminComponent,
        children: [
          { path: '', component: CarouselListComponent },
          { path: 'add', component: AddCarouselComponent },
          { path: 'edit/:id', component: EditCarouselComponent },
          { path: 'about-us/:id', component: AboutUsComponent },
          { path: 'contact-us/:id', component: ContactUsComponent },
          { path: 'carousel', component: CarouselListComponent },
          { path: 'carousel/add', component: AddCarouselComponent },
          { path: 'carousel/edit/:id', component: EditCarouselComponent },
          { path: 'instrument-list', component: InstrumentListComponent },
          { path: 'instrument-list/add', component: AddInstrumentComponent },
          { path: 'instrument-list/edit/:id', component: EditInstrumentComponent },
          { path: 'service-list', component: ServicesListComponent },
          { path: 'service-list/add', component: AddServicesComponent },
          { path: 'service-list/edit/:id', component: EditServicesComponent },
          { path: 'gallery-list', component: GalleryListComponent },
          { path: 'gallery-list/add', component: AddGalleryComponent },
          { path: 'gallery-list/edit/:id', component: EditGalleryComponent },
          { path: 'healthNews-list', component: HealthNewsListComponent },
          { path: 'healthNews-list/add', component: AddHealthNewsComponent },
          { path: 'healthNews-list/edit/:id', component: EditHealthNewsComponent },
          { path: 'hospitalNews-list', component: HospitalNewsListComponent },
          { path: 'hospitalNews-list/add', component: AddHospitalNewsComponent },
          { path: 'hospitalNews-list/edit/:id', component: EditHospitalNewsComponent },
          { path: 'career-list', component: CareerListComponent },
          { path: 'career-list/add', component: AddCareerComponent },
          { path: 'career-list/edit/:id', component: EditCareerComponent },
          { path: 'delete-all', component: DeleteComponent },
        ],
      },
    ],
  },
  {
    path: 'all-appointment',
    component: AllAppointmentComponent,
  },
  {
    path: 'report',
    component: ReportLayoutComponent,
  },
];
