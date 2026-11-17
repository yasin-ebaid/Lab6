export interface StoryDraft {
  quote: string;
  story: string;
  moment: string;
  next: string;
  consent: boolean;
}

export interface SavedStoryDraft {
  savedAt: string;
  values: StoryDraft;
}
