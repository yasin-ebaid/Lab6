/* =====================================================================
   FILE: components/student-card/student-card.ts
   WHAT: The student card shown on the landing page.
   WHY:  One reusable card that receives a student from its parent page.
   ===================================================================== */
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';
import { SavedService } from '../../services/saved.service';

@Component({
  selector: 'app-student-card',
  // RouterLink is needed because the template uses [routerLink]
  imports: [RouterLink],
  templateUrl: './student-card.html',
  styleUrl: './student-card.css',
})
export class StudentCard {
  // The parent page gives us one student through this input.
  readonly student = input.required<Student>();

  // Saved state is shared across cards and the header.
  private readonly saved = inject(SavedService);
  protected readonly isSaved = computed(() => this.saved.isSaved(this.student().id));

  // Did the portrait fail to load?
  private readonly imageFailed = signal(false);

  // The path actually shown: placeholder if the real image failed.
  // computed recalculates only when imageFailed() or student() changes.
  protected readonly photoSrc = computed(() =>
    this.imageFailed() ? 'images/placeholder-portrait.svg' : this.student().photo,
  );

  // Called by the template when the image cannot be loaded.
  protected onImageError(): void {
    this.imageFailed.set(true);
  }

  protected onToggleSaved(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.saved.toggle(this.student().id);
  }
}
