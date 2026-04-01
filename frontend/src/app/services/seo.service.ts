import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Question } from '../typedefs/Question.typedef';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);

  private readonly defaultTitle = 'Helpa.ws Q&A Community for all things pets';
  private readonly defaultDescription = 'Ask questions and get answers from pet lovers around the world.';

  setQuestionMeta(question: Question, circleName: string): void {
    const pageTitle = `${question.title} - ${circleName} | Helpa.ws`;
    const description = this.truncate(this.stripHtml(question.body), 160);

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
  }

  setCircleMeta(circleName: string, description?: string): void {
    const pageTitle = `${circleName} - Questions & Answers | Helpa.ws`;
    const desc = description || `Browse questions and answers about ${circleName}`;

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: desc });
  }

  resetToDefault(): void {
    this.title.setTitle(this.defaultTitle);
    this.meta.updateTag({ name: 'description', content: this.defaultDescription });
    this.meta.removeTag("property='og:title'");
    this.meta.removeTag("property='og:description'");
    this.meta.removeTag("property='og:type'");
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  private truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}
