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
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    profilePicture: 'path/to/profile/picture.jpg', // Replace with actual path or URL
    jobTitle: 'Software Developer',
    biography: 'Passionate about technology and software development. Loves to explore new trends in IT and contribute to open-source projects. Enjoys hiking and photography in free time.'
  }
}
