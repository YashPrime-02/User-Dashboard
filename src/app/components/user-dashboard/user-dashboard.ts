import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  ApplicationRef,
  createComponent,
  EnvironmentInjector
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

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
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
    Angular app reference
  */
  private appRef =
    inject(ApplicationRef);

  /*
    Angular injector
  */
  private injector =
    inject(EnvironmentInjector);

  /*
    All users
  */
  users: User[] = [];

  /*
    Filtered users
  */
  filteredUsers: User[] = [];

  /*
    Search value
  */
  searchTerm = '';

  /*
    Modal state
  */
  isModalOpen = false;

  /*
    Selected user
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
      Reactive subscription
    */
    this.userService.users$
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe((users) => {

        this.users = users || [];

        this.applyFilters();

        /*
          Update chart dynamically
        */
        if (this.chart) {

          this.updateChart();
        }
      });

    /*
      Lazy load chart
    */
    this.loadChart();
  }

  /*
    Lazy load Chart.js
  */
  async loadChart(): Promise<void> {

    try {

      const chartModule =
        await import('chart.js/auto');

      this.ChartJS =
        chartModule.default;

      /*
        Ensure DOM ready
      */
      requestAnimationFrame(() => {

        this.initializeChart();

      });

    } catch (error) {

      console.error(
        'Chart.js failed:',
        error
      );
    }
  }

  /*
    Open add user modal
  */
  async openAddUserModal(): Promise<void> {

    this.selectedUser = null;

    await this.createLazyModal();
  }

  /*
    Open edit modal
  */
  async editUser(
    user: User
  ): Promise<void> {

    this.selectedUser = user;

    await this.createLazyModal();
  }

  /*
    Create lazy loaded modal
  */
  async createLazyModal(): Promise<void> {

    /*
      Import component lazily
    */
    const component =
      await import(
        '../user-form/user-form'
      );

    const UserFormComponent =
      component.UserFormComponent;

    /*
      Create component dynamically
    */
    const componentRef =
      createComponent(
        UserFormComponent,
        {
          environmentInjector:
            this.injector
        }
      );

    /*
      Pass existing user
    */
    componentRef.instance.existingUser =
      this.selectedUser;

    /*
      Handle form submit
    */
    componentRef.instance.userAdded
      .subscribe((user: User) => {

        if (this.selectedUser) {

          this.updateUser(user);

        } else {

          this.addUser(user);
        }

        componentRef.destroy();
      });

    /*
      Handle close
    */
    componentRef.instance.closeModal
      .subscribe(() => {

        componentRef.destroy();

        this.closeModal();
      });

    /*
      Attach view
    */
    this.appRef.attachView(
      componentRef.hostView
    );

    /*
      Append modal to body
    */
    document.body.appendChild(
      componentRef.location.nativeElement
    );
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
      Prevent empty page
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
    Search users
  */
  filterUsers(): void {

    this.currentPage = 1;

    this.applyFilters();
  }

  /*
    Apply search filters
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
    Toast notification
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
    Role counts
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

    this.chart.update();
  }
}