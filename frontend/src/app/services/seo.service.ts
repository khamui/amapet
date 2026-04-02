import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Question } from '../typedefs/Question.typedef';
import { Answer } from '../typedefs/Answer.typedef';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

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
    this.removeCanonical();
    this.removeStructuredData();
  }

  setCanonical(url: string): void {
    let link = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  removeCanonical(): void {
    this.document.querySelector("link[rel='canonical']")?.remove();
  }

  setQAPageStructuredData(question: Question, circleName: string, answers: Answer[]): void {
    this.removeStructuredData();

    const acceptedAnswer = answers.find(a => a._id === question.solutionId);
    const suggestedAnswers = answers
      .filter(a => a._id !== question.solutionId)
      .slice(0, 10);

    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'QAPage',
      mainEntity: {
        '@type': 'Question',
        name: question.title,
        text: this.stripHtml(question.body),
        dateCreated: question.created_at,
        author: {
          '@type': 'Person',
          name: question.ownerName,
        },
        answerCount: answers.length,
        upvoteCount: question.upvotes?.length || 0,
      },
    };

    const mainEntity = jsonLd['mainEntity'] as Record<string, unknown>;

    if (acceptedAnswer) {
      mainEntity['acceptedAnswer'] = {
        '@type': 'Answer',
        text: this.stripHtml(acceptedAnswer.answerText),
        dateCreated: acceptedAnswer.created_at,
        author: {
          '@type': 'Person',
          name: acceptedAnswer.ownerName,
        },
        upvoteCount: acceptedAnswer.upvotes?.length || 0,
      };
    }

    if (suggestedAnswers.length > 0) {
      mainEntity['suggestedAnswer'] = suggestedAnswers.map(a => ({
        '@type': 'Answer',
        text: this.stripHtml(a.answerText),
        dateCreated: a.created_at,
        author: {
          '@type': 'Person',
          name: a.ownerName,
        },
        upvoteCount: a.upvotes?.length || 0,
      }));
    }

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'seo-jsonld';
    script.text = JSON.stringify(jsonLd);
    this.document.head.appendChild(script);
  }

  removeStructuredData(): void {
    this.document.getElementById('seo-jsonld')?.remove();
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  private truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}
