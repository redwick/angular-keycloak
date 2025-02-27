import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {RouterLink} from '@angular/router';
@Component({
  selector: 'app-profile',
  imports: [
    RouterLink
  ],
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{


  constructor(public auth: AuthService) {

  }

  ngOnInit(): void {

  }

}
