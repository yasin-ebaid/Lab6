import { Injectable } from '@angular/core';
import { SavedStoryDraft, StoryDraft } from '../models/story-draft.model';

@Injectable({ providedIn: 'root' })
export class StoryDraftService {
  private key(studentId: number): string {
    return `giu:story-draft:${studentId}`;
  }

  save(studentId: number, values: StoryDraft): string | null {
    const savedAt = new Date().toISOString();
    try {
      localStorage.setItem(this.key(studentId), JSON.stringify({ savedAt, values }));
      return savedAt;
    } catch {
      return null;
    }
  }

  load(studentId: number): SavedStoryDraft | null {
    try {
      const raw = localStorage.getItem(this.key(studentId));
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        typeof (parsed as SavedStoryDraft).savedAt !== 'string' ||
        typeof (parsed as SavedStoryDraft).values !== 'object'
      ) {
        return null;
      }
      return parsed as SavedStoryDraft;
    } catch {
      return null;
    }
  }

  clear(studentId: number): void {
    try {
      localStorage.removeItem(this.key(studentId));
    } catch {
      // Clearing a draft is best-effort when browser storage is unavailable.
    }
  }
}
