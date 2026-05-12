/*
  User Model Interface
  Defines the structure of user data
*/

export interface User {

  id: number;

  name: string;

  email: string;

  role: 'Admin' | 'Editor' | 'Viewer';
}