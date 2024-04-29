import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VisitorCountService {
  private readonly STORAGE_KEY = 'visitorCount';

  constructor() {}

  getVisitorCount(): number {
    const count = localStorage.getItem(this.STORAGE_KEY);
    return count ? parseInt(count, 10) : 0;
  }

  incrementVisitorCount(): void {
    const currentCount = this.getVisitorCount();
    const newCount = currentCount + 1;
    localStorage.setItem(this.STORAGE_KEY, newCount.toString());
  }
}





// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class VisitorCountService {
//   private readonly STORAGE_KEY = 'hasVisited';

//   constructor() {}

//   hasUserVisited(): boolean {
//     return localStorage.getItem(this.STORAGE_KEY) === 'true';
//   }

//   markUserVisited(): void {
//     localStorage.setItem(this.STORAGE_KEY, 'true');
//   }

//   getVisitorCount(): number {
//     return parseInt(localStorage.getItem('visitorCount') || '0', 10);
//   }

//   incrementVisitorCount(): void {
//     if (!this.hasUserVisited()) {
//       const currentCount = this.getVisitorCount();
//       const newCount = currentCount + 1;
//       localStorage.setItem('visitorCount', newCount.toString());
//       this.markUserVisited();
//     }
//   }
// }
