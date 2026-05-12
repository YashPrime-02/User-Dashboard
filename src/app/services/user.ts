import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /*
    LocalStorage Key
  */
  private STORAGE_KEY = 'dashboard_users';

  /*
    Initial Demo Users
  */
  private initialUsers: User[] = [

    {
      id: 1,
      name: 'Yash Mishra',
      email: 'yashprime000@gmail.com',
      role: 'Admin'
    },

    {
      id: 2,
      name: 'Harsh Sharma',
      email: 'harsh@gmail.com',
      role: 'Editor'
    },

    {
      id: 3,
      name: 'Pradeep Singh',
      email: 'pradeep@example.com',
      role: 'Viewer'
    },

    {
      id: 4,
      name: 'Rahul Verma',
      email: 'rahul@gmail.com',
      role: 'Viewer'
    },

    {
      id: 5,
      name: 'Ankit Yadav',
      email: 'ankit@gmail.com',
      role: 'Editor'
    },

    {
      id: 6,
      name: 'Rohit Kumar',
      email: 'rohit@gmail.com',
      role: 'Admin'
    },

    {
      id: 7,
      name: 'Vikas Mishra',
      email: 'vikas@gmail.com',
      role: 'Viewer'
    },

    {
      id: 8,
      name: 'Aman Tiwari',
      email: 'aman@gmail.com',
      role: 'Editor'
    },

    {
      id: 9,
      name: 'Neha Gupta',
      email: 'neha@gmail.com',
      role: 'Viewer'
    },

    {
      id: 10,
      name: 'Sneha Kapoor',
      email: 'sneha@gmail.com',
      role: 'Admin'
    },

    {
      id: 11,
      name: 'Arjun Mehta',
      email: 'arjun@gmail.com',
      role: 'Editor'
    },

    {
      id: 12,
      name: 'Priya Sharma',
      email: 'priya@gmail.com',
      role: 'Viewer'
    }
  ];


  /*
    Load Users From LocalStorage
  */
  private loadUsers(): User[] {

    const users =
      localStorage.getItem(this.STORAGE_KEY);

    return users
      ? JSON.parse(users)
      : this.initialUsers;
  }

  /*
    Save Users To LocalStorage
  */
  private saveUsers(users: User[]): void {

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(users)
    );
  }

  /*
    Reactive Users State
  */
  private usersSubject =
    new BehaviorSubject<User[]>(
      this.loadUsers()
    );

  /*
    Public Observable
  */
  users$ =
    this.usersSubject.asObservable();

  /*
    Add User
  */
  addUser(user: User): void {

    const currentUsers =
      this.usersSubject.getValue();

    const newUser: User = {
      ...user,
      id: Date.now()
    };

    const updatedUsers = [
      ...currentUsers,
      newUser
    ];

    this.saveUsers(updatedUsers);

    this.usersSubject.next(updatedUsers);
  }

  /*
    Update User
  */
  updateUser(updatedUser: User): void {

    const updatedUsers =
      this.usersSubject
        .getValue()
        .map(user =>
          user.id === updatedUser.id
            ? updatedUser
            : user
        );

    this.saveUsers(updatedUsers);

    this.usersSubject.next(updatedUsers);
  }

  /*
    Delete User
  */
  deleteUser(userId: number): void {

    const updatedUsers =
      this.usersSubject
        .getValue()
        .filter(user => user.id !== userId);

    this.saveUsers(updatedUsers);

    this.usersSubject.next(updatedUsers);
  }
}