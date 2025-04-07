import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Student } from "../../models/student.model";
import { Subject } from "../../models/subject.model";
import { EnrollmentResponse } from "../../models/enrollment-response.model";

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private baseUrl = `${environment.apiUrl}/Enrollments`;
  private http = inject(HttpClient);

  getStudentsBySubject(subjectId: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/StudentsBySubject/${subjectId}`);
  }

  registerSubjects(request: { subjectIds: string[] }) {
    return this.http.post(`${this.baseUrl}/Register`, request);
  }

  updateSubjects(request: { subjectIds: string[] }) {
    return this.http.put(`${this.baseUrl}/Update`, request);
  }

  getMyEnrollSubjects(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/GetMyEnrollSubjects`);
  }

  cancelEnrollment(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Cancel`);
  }

}
