import { ModalService } from './../../shared/services/modal/modal.service';
import { Component, inject } from '@angular/core';
import { SubjectService } from '../../core/services/subject.service';
import { Subject } from '../../models/subject.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { Student } from '../../models/student.model';
import { ModalComponent } from "../../shared/components/modal/modal.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private subjectService = inject(SubjectService);
  private enrollmentService = inject(EnrollmentService);
  private modalService = inject(ModalService);
  subjects: Subject[] = [];
  selectedSubjects: Subject[] = [];
  message: string = '';
  showStudentsPanel = false;
  students: Student[] = [];
  selectedSubjectName = '';
  isEditMode: boolean = false;
  showStudents: { [subjectId: string]: boolean } = {};

  ngOnInit() {
    this.getSubjects();
  }

  getSubjects() {
    this.subjectService.getSubjects().subscribe((res) => {
      this.subjects = res;
      this.loadMyEnrollments();
    });
  }

  loadMyEnrollments() {
    this.enrollmentService.getMyEnrollSubjects().subscribe({
      next: (res) => {
        const enrolledSubjects = res.data;
        const selectedIds = enrolledSubjects.map((s: any) => s.subjectId);

        this.selectedSubjects = this.subjects.filter(subject =>
          selectedIds.includes(subject.id)
        );

        this.isEditMode = this.selectedSubjects.length > 0;
      },
      error: (err) => {
        console.error('Error al cargar materias inscritas:', err);
      }
    });
  }

  toggleSelection(subject: Subject) {
    const alreadySelected = this.selectedSubjects.find(s => s.id === subject.id);

    if (alreadySelected) {
      this.selectedSubjects = this.selectedSubjects.filter(s => s.id !== subject.id);
      this.message = '';
      return;
    }

    if (this.selectedSubjects.length >= 3) {
      this.message = 'Solo puedes seleccionar máximo 3 materias.';
      this.modalService.open('message');
      return;
    }

    const totalCredits = this.selectedSubjects.reduce((sum, s) => sum + s.credits, 0);
    if (totalCredits + subject.credits > 9) {
      this.message = 'No puedes exceder 9 créditos.';
      this.modalService.open('message');
      return;
    }

    const hasSameTeacher = this.selectedSubjects.some(s => s.teacher.id === subject.teacher.id);
    if (hasSameTeacher) {
      this.message = 'No puedes seleccionar materias del mismo profesor.';
      this.modalService.open('message');
      return;
    }

    this.selectedSubjects.push(subject);
    this.message = '';
  }

  isSelected(subject: Subject): boolean {
    return this.selectedSubjects.some(s => s.id === subject.id);
  }

  toggleStudentView(subjectId: string) {
    this.showStudents[subjectId] = !this.showStudents[subjectId];
  }

  getEnrolledStudents(subject: Subject) {
    this.selectedSubjectName = subject.name;
    this.enrollmentService.getStudentsBySubject(subject.id).subscribe({
      next: (res) => {
        this.showStudentsPanel = true;
        this.students = res;
      },
      error: (err) => {
        this.students = [];
        console.error('Error al obtener estudiantes:', err);
      }
    });
  }

  registerSubjects() {
    const subjectIds = this.selectedSubjects.map(s => s.id);
    const request = {
      subjectIds
    };

    const obs$ = this.isEditMode
    ? this.enrollmentService.updateSubjects(request)
    : this.enrollmentService.registerSubjects(request);

    obs$.subscribe({
      next: (res) => {
        this.message = (this.isEditMode ? 'Materias actualizadas correctamente.' : 'Materias inscritas correctamente.');
        this.modalService.open('message');
        this.selectedSubjects = [];
        this.loadMyEnrollments();
      },
      error: (err) => {
        console.error(err);
        alert('Error al inscribir materias');
      }
    });
  }

  cancelEnrollment() {
    this.enrollmentService.cancelEnrollment().subscribe({
      next: (res) => {
        this.message = "Inscripción cancelada exitosamente";
        this.modalService.open('message');
        this.selectedSubjects = [];
        this.loadMyEnrollments();
      },
      error: (err) => {
        console.error(err);
        alert('Error al cancelar inscripción');
      }
    });
  }

  closeModal(){
    this.modalService.close('message');
  }
}
