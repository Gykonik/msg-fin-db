import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserData} from "../types";



@Component({
  selector: 'app-user-profile-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  protected userData: UserData = {
    id: 1,
    firstname: 'Alex',
    surname: 'Johnson',
    email: 'alex.johnson@example.com',
  }
}
