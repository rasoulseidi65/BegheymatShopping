import { Component, OnInit } from '@angular/core';
import {AdminserviceService} from '../adminservice.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  orders: any[] = [];

  constructor(private service: AdminserviceService,
              private router: Router) {
  }


  ngOnInit(): void {

    this.service.getAllAdvices().subscribe((response) => {
      if (response.success === true) {
        this.orders = response.data;
      }
    });
  }

  viewProduct(id: any): void {
    this.router.navigate(['/home/detail/' + id]);
  }

}
