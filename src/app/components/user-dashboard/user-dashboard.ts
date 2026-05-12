import {
  Component,
  DestroyRef,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import { User } from '../../models/user';

import { UserService } from '../../services/user';

import { UserFormComponent } from '../user-form/user-form';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserFormComponent
  ],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.scss']
})
export class UserDashboardComponent
implements OnInit {

  /*
    Angular destroy reference
  */
  private destroyRef =
    inject(DestroyRef);

  /*
    All users
  */
  users: User[] = [];

  /*
    Filtered users
  */
  filteredUsers: User[] = [];

  /*
    Search input
  */
  searchTerm = '';

  /*
    Modal state
  */
  isModalOpen = false;

  /*
    Selected user for edit
  */
  selectedUser: User | null = null;

  /*
    Toast state
  */
  showToast = false;

  toastMessage = '';

  /*
    Pagination
  */
  currentPage = 1;

  itemsPerPage = 5;

  /*
    Chart instance
  */
  chart: any = null;

  /*
    Chart.js reference
  */
  ChartJS: any;

  constructor(
    private userService: UserService
  ) { }

  /*
    Component init
  */
  ngOnInit(): void {

    /*
      Subscribe immediately
      so data renders instantly
    */
    this.userService.users$
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe((users) => {

        /*
          Store users
        */
        this.users = users || [];

        /*
          Apply filters
        */
        this.applyFilters();

        /*
          Update chart if exists
        */
        if (this.chart) {

          this.updateChart();
        }
      });

    /*
      Load chart separately
      without blocking render
    */
    this.loadChart();
  }

  /*
    Lazy load Chart.js
  */
  async loadChart(): Promise<void> {

    try {

      /*
        Import Chart.js
      */
      const chartModule =
        await import('chart.js/auto');

      this.ChartJS =
        chartModule.default;

      /*
        Wait for DOM render
      */
      requestAnimationFrame(() => {

        this.initializeChart();

      });

    } catch (error) {

      console.error(
        'Chart.js loading failed:',
        error
      );
    }
  }

  /*
    Open add modal
  */
  openAddUserModal(): void {

    this.selectedUser = null;

    this.isModalOpen = true;
  }

  /*
    Edit user
  */
  editUser(user: User): void {

    this.selectedUser = user;

    this.isModalOpen = true;
  }

  /*
    Close modal
  */
  closeModal(): void {

    this.isModalOpen = false;

    this.selectedUser = null;
  }

  /*
    Add user
  */
  addUser(user: User): void {

    this.userService.addUser(user);

    this.showToastMessage(
      'User added successfully'
    );

    this.closeModal();
  }

  /*
    Update user
  */
  updateUser(user: User): void {

    if (!this.selectedUser) return;

    const updatedUser: User = {

      ...user,

      id: this.selectedUser.id
    };

    this.userService.updateUser(
      updatedUser
    );

    this.showToastMessage(
      'User updated successfully'
    );

    this.closeModal();
  }

  /*
    Delete user
  */
  deleteUser(userId: number): void {

    const confirmed =
      confirm(
        'Delete this user?'
      );

    if (!confirmed) return;

    this.userService.deleteUser(
      userId
    );

    /*
      Prevent empty pages
    */
    const remainingUsers =
      this.filteredUsers.length - 1;

    const maxPage =
      Math.ceil(
        remainingUsers /
        this.itemsPerPage
      );

    if (
      this.currentPage > maxPage &&
      this.currentPage > 1
    ) {

      this.currentPage--;
    }

    this.showToastMessage(
      'User deleted successfully'
    );
  }

  /*
    Filter users
  */
  filterUsers(): void {

    this.currentPage = 1;

    this.applyFilters();
  }

  /*
    Apply filters
  */
  applyFilters(): void {

    const value =
      this.searchTerm
        .trim()
        .toLowerCase();

    /*
      No search
    */
    if (!value) {

      this.filteredUsers =
        [...this.users];

      return;
    }

    /*
      Filter users
    */
    this.filteredUsers =
      this.users.filter((user) => {

        return (

          user.name
            .toLowerCase()
            .includes(value)

          ||

          user.email
            .toLowerCase()
            .includes(value)

          ||

          user.role
            .toLowerCase()
            .includes(value)
        );
      });
  }

  /*
    Paginated users
  */
  get paginatedUsers(): User[] {

    const startIndex =

      (this.currentPage - 1)

      * this.itemsPerPage;

    return this.filteredUsers.slice(

      startIndex,

      startIndex + this.itemsPerPage
    );
  }

  /*
    Total pages
  */
  get totalPages(): number {

    return Math.ceil(

      this.filteredUsers.length

      / this.itemsPerPage
    );
  }

  /*
    Change page
  */
  changePage(page: number): void {

    if (

      page < 1 ||

      page > this.totalPages

    ) return;

    this.currentPage = page;
  }

  /*
    Show toast
  */
  showToastMessage(
    message: string
  ): void {

    this.toastMessage = message;

    this.showToast = true;

    setTimeout(() => {

      this.showToast = false;

    }, 3000);
  }

  /*
    Get role counts
  */
  getRoleCounts() {

    return {

      admin: this.users.filter(
        user => user.role === 'Admin'
      ).length,

      editor: this.users.filter(
        user => user.role === 'Editor'
      ).length,

      viewer: this.users.filter(
        user => user.role === 'Viewer'
      ).length
    };
  }

  /*
    Initialize chart
  */
  initializeChart(): void {

    if (!this.ChartJS) return;

    const canvas =
      document.getElementById(
        'roleChart'
      ) as HTMLCanvasElement;

    if (!canvas) return;

    const roleCounts =
      this.getRoleCounts();

    this.chart =
      new this.ChartJS(canvas, {

        type: 'doughnut',

        data: {

          labels: [
            'Admin',
            'Editor',
            'Viewer'
          ],

          datasets: [
            {

              data: [

                roleCounts.admin,

                roleCounts.editor,

                roleCounts.viewer
              ],

              backgroundColor: [
                '#1c4980',
                '#7c3aed',
                '#0f172a'
              ],

              borderWidth: 0
            }
          ]
        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          animation: false,

          plugins: {

            legend: {

              position: 'bottom'
            }
          },

          cutout: '68%'
        }
      });
  }

  /*
    Update chart
  */
  updateChart(): void {

    if (!this.chart) return;

    const roleCounts =
      this.getRoleCounts();

    this.chart.data.datasets[0].data = [

      roleCounts.admin,

      roleCounts.editor,

      roleCounts.viewer
    ];

    this.chart.update('none');
  }
}