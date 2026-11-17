import { Component, OnInit, inject, signal } from '@angular/core';
import { Student } from '../../models/student.model';
import { StoryDraft } from '../../models/story-draft.model';
import { AuthService } from '../../services/auth.service';
import { StoryDraftService } from '../../services/story-draft.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-profile-page',
  template: `
    <section class="profile">
      <h1>Tell your yearbook story</h1>
      @if (student(); as currentStudent) {
        <p class="profile__student">{{ currentStudent.name }}</p>
      }
      <label for="quote">Your quote</label>
      <input id="quote" [value]="form().quote" (input)="onField('quote', $event)" />
      <label for="story">Your story</label>
      <textarea id="story" [value]="form().story" (input)="onField('story', $event)"></textarea>
      <label for="moment">Favourite moment</label>
      <input id="moment" [value]="form().moment" (input)="onField('moment', $event)" />
      <label for="next">What comes next?</label>
      <input id="next" [value]="form().next" (input)="onField('next', $event)" />
      <label class="profile__consent">
        <input type="checkbox" [checked]="form().consent" (change)="onConsent($event)" />
        I agree to include my story in the yearbook.
      </label>
      <p class="actions__status" aria-live="polite">{{ status() }}</p>
      <div class="actions__buttons">
        <button class="btn" type="button" (click)="saveDraft()">Save draft</button>
      </div>
    </section>
  `,
  styles: `
    .profile { display: grid; gap: var(--space-3); max-width: 640px; padding: var(--space-8) 0; }
    h1 { font: 400 40px/1.15 var(--font-serif); }
    label { font-weight: 600; }
    input:not([type="checkbox"]), textarea { width: 100%; padding: var(--space-3); border: 1px solid var(--color-border); border-radius: 4px; }
    textarea { min-height: 120px; }
    .profile__consent { display: flex; align-items: center; gap: var(--space-2); }
    .actions__buttons { display: flex; gap: var(--space-3); }
    .actions__status, .profile__student { color: var(--color-muted); }
  `,
})
export class ProfilePage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly studentService = inject(StudentService);
  private readonly drafts = inject(StoryDraftService);
  private readonly studentId = this.auth.currentUser()?.studentId ?? 0;

  protected readonly student = signal<Student | null>(null);
  protected readonly form = signal<StoryDraft>({ quote: '', story: '', moment: '', next: '', consent: false });
  protected readonly status = signal('No changes yet');

  ngOnInit(): void {
    if (!this.studentId) return;

    this.studentService.getStudents().subscribe((students) => {
      const student = students.find((candidate) => candidate.id === this.studentId) ?? null;
      this.student.set(student);
      const draft = this.drafts.load(this.studentId);
      if (draft) {
        this.form.set({ ...draft.values });
      } else if (student) {
        this.form.update((current) => ({ ...current, quote: student.quote }));
      }
      this.status.set('No changes yet');
    });
  }

  protected onField(field: keyof StoryDraft, event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.form.update((current) => ({ ...current, [field]: value }));
    this.status.set('Unsaved changes');
  }

  protected onConsent(event: Event): void {
    this.form.update((current) => ({ ...current, consent: (event.target as HTMLInputElement).checked }));
    this.status.set('Unsaved changes');
  }

  protected saveDraft(): void {
    const savedAt = this.studentId ? this.drafts.save(this.studentId, this.form()) : null;
    if (savedAt) {
      this.status.set('Draft saved');
    } else {
      this.status.set('Could not save');
    }
  }
}
