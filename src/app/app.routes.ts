import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/layouts/main/main.component').then(m => m.MainComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./pages/main/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'doctors',
        loadComponent: () => import('./pages/main/all-doctors/all-doctors.component').then(m => m.AllDoctorsComponent)
      },
      {
        path: 'doctor/:id',
        loadComponent: () => import('./pages/main/doctor/doctor.component').then(m => m.DoctorComponent)
      },
      {
        path: 'gallery/instrument',
        loadComponent: () => import('./pages/main/gallery/instrument-gallery/instrument-gallery.component').then(m => m.InstrumentGalleryComponent)
      },
      {
        path: 'gallery/hospital',
        loadComponent: () => import('./pages/main/gallery/hospital-gallery/hospital-gallery.component').then(m => m.HospitalGalleryComponent)
      },
      {
        path: 'career',
        loadComponent: () => import('./pages/main/career/career.component').then(m => m.CareerComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/main/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/main/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'sd-hospital-news',
        loadComponent: () => import('./pages/main/news/hospital-news/hospital-news.component').then(m => m.HospitalNewsComponent)
      },
      {
        path: 'digital-diagnostic-news',
        loadComponent: () => import('./pages/main/news/health-news/health-news.component').then(m => m.HealthNewsComponent)
      },
      {
        path: 'departments',
        loadComponent: () => import('./pages/main/department/department.component').then(m => m.DepartmentComponent)
      },
      {
        path: 'department/:department',
        loadComponent: () => import('./pages/main/doctors-list/doctors-list.component').then(m => m.MainDoctorListComponent)
      },
    ],
  },
  {
    path: 'serial',
    loadComponent: () => import('./pages/layouts/serial-main/serial-main.component').then(m => m.SerialMainComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/serial/departments/departments.component').then(m => m.DepartmentsComponent)
      },
      {
        path: 'appointment-form',
        loadComponent: () => import('./pages/serial/appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent)
      },
      {
        path: 'my-appointments',
        loadComponent: () => import('./pages/serial/my-appointments/my-appointments.component').then(m => m.MyAppointmentsComponent)
      },
      {
        path: 'department/:department',
        loadComponent: () => import('./components/serial/doctors-list/doctors-list.component').then(m => m.DoctorListComponent)
      },
      {
        path: 'doctor/:id',
        loadComponent: () => import('./pages/serial/doctor/doctor.component').then(m => m.SerialDoctorComponent)
      },
    ],
  },
  {
    path: 'serial/admin',
    loadComponent: () => import('./pages/layouts/serial-admin/serial-admin.component').then(m => m.SerialAdminComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/serial/all-department/all-department.component').then(m => m.AllDepartmentComponent)
      },
      {
        path: 'department-list',
        loadComponent: () => import('./pages/serial/all-department/all-department.component').then(m => m.AllDepartmentComponent)
      },
      {
        path: 'doctors',
        loadComponent: () => import('./pages/serial/all-doctors/all-doctors.component').then(m => m.SerialAllDoctorsComponent)
      },
      {
        path: 'all-appointment',
        loadComponent: () => import('./pages/serial/all-appointment/all-appointment.component').then(m => m.AllAppointmentComponent)
      },
      {
        path: 'all-user',
        loadComponent: () => import('./pages/serial/all-users/all-users.component').then(m => m.AllUsersComponent)
      },
      {
        path: 'all-mis',
        loadComponent: () => import('./pages/layouts/admin/admin.component').then(m => m.AdminComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/serial/MIS/list/carousel-list/carousel-list.component').then(m => m.CarouselListComponent)
          },
          {
            path: 'add',
            loadComponent: () => import('./pages/serial/MIS/add/add-carousel/add-carousel.component').then(m => m.AddCarouselComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./pages/serial/MIS/all-edit/edit-carousel/edit-carousel.component').then(m => m.EditCarouselComponent)
          },
          {
            path: 'about-us/:id',
            loadComponent: () => import('./pages/serial/MIS/about-us/about-us.component').then(m => m.AboutUsComponent)
          },
          {
            path: 'contact-us/:id',
            loadComponent: () => import('./pages/serial/MIS/contact-us/contact-us.component').then(m => m.ContactUsComponent)
          },
          {
            path: 'carousel',
            loadComponent: () => import('./pages/serial/MIS/list/carousel-list/carousel-list.component').then(m => m.CarouselListComponent)
          },
          {
            path: 'carousel/add',
            loadComponent: () => import('./pages/serial/MIS/add/add-carousel/add-carousel.component').then(m => m.AddCarouselComponent)
          },
          {
            path: 'carousel/edit/:id',
            loadComponent: () => import('./pages/serial/MIS/all-edit/edit-carousel/edit-carousel.component').then(m => m.EditCarouselComponent)
          },
          {
            path: 'instrument-list',
            loadComponent: () => import('./pages/serial/MIS/list/instrument-list/instrument-list.component').then(m => m.InstrumentListComponent)
          },
          {
            path: 'instrument-list/add',
            loadComponent: () => import('./pages/serial/MIS/add/add-instrument/add-instrument.component').then(m => m.AddInstrumentComponent)
          },
          {
            path: 'instrument-list/edit/:id',
            loadComponent: () => import('./pages/serial/MIS/all-edit/edit-instrument/edit-instrument.component').then(m => m.EditInstrumentComponent)
          },
          {
            path: 'service-list',
            loadComponent: () => import('./pages/serial/MIS/list/services-list/services-list.component').then(m => m.ServicesListComponent)
          },
          {
            path: 'service-list/add',
            loadComponent: () => import('./pages/serial/MIS/add/add-services/add-services.component').then(m => m.AddServicesComponent)
          },
          {
            path: 'service-list/edit/:id',
            loadComponent: () => import('./pages/serial/MIS/all-edit/edit-services/edit-services.component').then(m => m.EditServicesComponent)
          },
          {
            path: 'gallery-list',
            loadComponent: () => import('./pages/serial/MIS/list/gallery-list/gallery-list.component').then(m => m.GalleryListComponent)
          },
          {
            path: 'gallery-list/add',
            loadComponent: () => import('./pages/serial/MIS/add/add-gallery/add-gallery.component').then(m => m.AddGalleryComponent)
          },
          {
            path: 'gallery-list/edit/:id',
            loadComponent: () => import('./pages/serial/MIS/all-edit/edit-gallery/edit-gallery.component').then(m => m.EditGalleryComponent)
          },
          {
            path: 'healthNews-list',
            loadComponent: () => import('./pages/serial/MIS/list/health-news-list/health-news-list.component').then(m => m.HealthNewsListComponent)
          },
          {
            path: 'healthNews-list/add',
            loadComponent: () => import('./pages/serial/MIS/add/add-health-news/add-health-news.component').then(m => m.AddHealthNewsComponent)
          },
          {
            path: 'healthNews-list/edit/:id',
            loadComponent: () => import('./pages/serial/MIS/all-edit/edit-health-news/edit-health-news.component').then(m => m.EditHealthNewsComponent)
          },
          {
            path: 'hospitalNews-list',
            loadComponent: () => import('./pages/serial/MIS/list/hospital-news-list/hospital-news-list.component').then(m => m.HospitalNewsListComponent)
          },
          {
            path: 'hospitalNews-list/add',
            loadComponent: () => import('./pages/serial/MIS/add/add-hospital-news/add-hospital-news.component').then(m => m.AddHospitalNewsComponent)
          },
          {
            path: 'hospitalNews-list/edit/:id',
            loadComponent: () => import('./pages/serial/MIS/all-edit/edit-hospital-news/edit-hospital-news.component').then(m => m.EditHospitalNewsComponent)
          },
          {
            path: 'career-list',
            loadComponent: () => import('./pages/serial/MIS/list/career-list/career-list.component').then(m => m.CareerListComponent)
          },
          {
            path: 'career-list/add',
            loadComponent: () => import('./pages/serial/MIS/add/add-career/add-career.component').then(m => m.AddCareerComponent)
          },
          {
            path: 'career-list/edit/:id',
            loadComponent: () => import('./pages/serial/MIS/all-edit/edit-career/edit-career.component').then(m => m.EditCareerComponent)
          },
          {
            path: 'delete-all',
            loadComponent: () => import('./pages/serial/MIS/delete/delete.component').then(m => m.DeleteComponent)
          },
        ],
      },
    ],
  },
  {
    path: 'all-appointment',
    loadComponent: () => import('./pages/serial/all-appointment/all-appointment.component').then(m => m.AllAppointmentComponent),
  },
  {
    path: 'report',
    loadComponent: () => import('./pages/layouts/report-layout/report-layout.component').then(m => m.ReportLayoutComponent),
  },
];