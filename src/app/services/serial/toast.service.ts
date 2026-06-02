import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, inject } from '@angular/core';
import { ToastComponent } from '../../components/serial/shared/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  resolver = inject(ComponentFactoryResolver);
  applicationRef = inject(ApplicationRef);
  injector = inject(Injector);

  constructor() {}

  showToast(message: string) {
    const toastFactory = this.resolver.resolveComponentFactory(ToastComponent);
    const toastRef = toastFactory.create(this.injector);
    toastRef.instance.message = message;
    this.applicationRef.attachView(toastRef.hostView);
    const domElement = (toastRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElement);

    setTimeout(() => {
      this.applicationRef.detachView(toastRef.hostView);
      toastRef.destroy();
    }, 3000);
  }
}
