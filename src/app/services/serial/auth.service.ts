import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private localStorageKey = 'user';

  setUser(user: any) {
    
    // Save user to local storage
    localStorage.setItem(this.localStorageKey, JSON.stringify(user));
  }

  getUser() {
    // Retrieve user from local storage
    const storedUser = localStorage.getItem(this.localStorageKey);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  deleteUser() {
    // Remove user from local storage
    localStorage.removeItem(this.localStorageKey);
  }
}




// import { Injectable, OnInit } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService implements OnInit {

//   private localStorageKey = 'user';
//   private deleteUserInterval: any;

//   constructor() { }

//   ngOnInit() {
//     this.startDeleteUserTimer();
//   }

//   setUser(user: any) {
//     // Save user to local storage
//     localStorage.setItem(this.localStorageKey, JSON.stringify(user));
//     this.startDeleteUserTimer(); // Restart the timer when a new user is set
//   }

//   getUser() {
//     // Retrieve user from local storage
//     const storedUser = localStorage.getItem(this.localStorageKey);
//     return storedUser ? JSON.parse(storedUser) : null;
//   }

//   deleteUser() {
//     // Remove user from local storage
//     localStorage.removeItem(this.localStorageKey);
//   }

//   private startDeleteUserTimer() {
//     if (this.deleteUserInterval) {
//       clearInterval(this.deleteUserInterval);
//     }
    
//     // Set a timeout to execute deleteUser in 24 hours
//     this.deleteUserInterval = setTimeout(() => {
//       this.deleteUser();
//       // Set an interval to execute deleteUser every 24 hours
//       this.deleteUserInterval = setInterval(() => {
//         this.deleteUser();
//       }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
//     }, 24 * 60 * 60 * 1000); // Initial 24 hours in milliseconds
//   }
// }
