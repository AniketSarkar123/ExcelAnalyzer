import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="container">
      <h1>Excel Analytics Dashboard</h1>
      
      <div class="upload-container" (click)="fileInput.click()">
        <input
          #fileInput
          type="file"
          class="file-input"
          (change)="onFileChange($event)"
          accept=".xlsx, .xls"
        >
        <p>Click to upload Excel file or drag and drop</p>
        <button class="button">Choose File</button>
      </div>

      <div class="preview" *ngIf="data.length">
        <h2>Data Preview</h2>
        <table>
          <thead>
            <tr>
              <th *ngFor="let header of headers">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of data">
              <td *ngFor="let header of headers">{{ row[header] }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="preview" *ngIf="analytics">
        <h2>Analytics Results</h2>
        <div *ngFor="let column of getAnalyticsColumns()">
          <h3>{{ column }}</h3>
          <table>
            <tr>
              <td>Highest Mark:</td>
              <td>{{ analytics[column].highest }}</td>
            </tr>
            <tr>
              <td>Lowest Mark:</td>
              <td>{{ analytics[column].lowest }}</td>
            </tr>
            <tr>
              <td>Average:</td>
              <td>{{ analytics[column].average.toFixed(2) }}</td>
            </tr>
            <tr>
              <td>Median:</td>
              <td>{{ analytics[column].median }}</td>
            </tr>
            <tr>
              <td>Standard Deviation:</td>
              <td>{{ analytics[column].std_dev.toFixed(2) }}</td>
            </tr>
            <tr>
              <td>Passing Rate:</td>
              <td>{{ analytics[column].passing_rate.toFixed(2) }}%</td>
            </tr>
            <tr>
              <td colspan="2"><strong>Mark Distribution:</strong></td>
            </tr>
            <tr>
              <td>0-20:</td>
              <td>{{ analytics[column].distribution['0-20'] }} students</td>
            </tr>
            <tr>
              <td>20-40:</td>
              <td>{{ analytics[column].distribution['20-40'] }} students</td>
            </tr>
            <tr>
              <td>40-60:</td>
              <td>{{ analytics[column].distribution['40-60'] }} students</td>
            </tr>
            <tr>
              <td>60-80:</td>
              <td>{{ analytics[column].distribution['60-80'] }} students</td>
            </tr>
            <tr>
              <td>80-100:</td>
              <td>{{ analytics[column].distribution['80-100'] }} students</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class App {
  data: any[] = [];
  headers: string[] = [];
  analytics: any = null;

  constructor(private http: HttpClient) {}

  async onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) return;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = XLSX.utils.sheet_to_json(ws);
      if (this.data.length > 0) {
        this.headers = Object.keys(this.data[0]);
        this.sendToBackend(target.files[0]);
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  async sendToBackend(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      this.analytics = await this.http.post('http://localhost:8000/analyze', formData).toPromise();
    } catch (error) {
      console.error('Error analyzing data:', error);
    }
  }

  getAnalyticsColumns(): string[] {
    return this.analytics ? Object.keys(this.analytics) : [];
  }
}

bootstrapApplication(App);