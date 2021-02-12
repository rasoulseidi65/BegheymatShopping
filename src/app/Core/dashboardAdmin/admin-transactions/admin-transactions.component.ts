import {Component, OnInit} from '@angular/core';
import {AdminserviceService} from '../adminservice.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-admin-transactions',
  templateUrl: './admin-transactions.component.html',
  styleUrls: ['./admin-transactions.component.css'],
})
export class AdminTransactionsComponent implements OnInit {

  transactions: any[] = [];
  successfulTransactions: any[] = [];
  unsuccessfulTransactions: any[] = [];

  constructor(private service: AdminserviceService) {
  }


  ngOnInit(): void {
    this.service.getAllSuccessfulTransactions().subscribe((response) => {
      if (response.success === true) {
        this.successfulTransactions = response.data;
      }
    });

    this.service.getAllUnsuccessfulTransactions().subscribe((response) => {
      if (response.success === true) {
        this.unsuccessfulTransactions = response.data;
      }
    });

    this.service.getAllTransactions().subscribe((response) => {
      if (response.success === true) {
        this.transactions = response.data;
      }
    });
  }
}
