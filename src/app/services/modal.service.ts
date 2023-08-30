import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ModalComponent} from '../home/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modal: MatDialog) { }

  openModal(){
    return this.modal.open(ModalComponent, {
      width:"450px",
      height:"190px",
      disableClose: true
    });
  }
}
