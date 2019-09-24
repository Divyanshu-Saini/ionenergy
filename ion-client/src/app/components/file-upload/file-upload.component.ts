import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  UPLOAD_URL: string = 'http://loacalhost:3000/upload/logs';
  constructor() { }

  ngOnInit() {
  }

}
