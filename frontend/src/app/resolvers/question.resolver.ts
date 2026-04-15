import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CircleService } from '../services/circle.service';
import { SeoService } from '../services/seo.service';
import { Answer } from '../typedefs/Answer.typedef';
import { Circle } from '../typedefs/Circle.typedef';
import { Question } from '../typedefs/Question.typedef';

export interface QuestionResolverData {
  circle: Circle;
  question: Question;
  answers: Answer[];
}

export const questionResolver: ResolveFn<QuestionResolverData | null> = async (route) => {
  const cs = inject(CircleService);
  const seoService = inject(SeoService);
  const api = inject(ApiService);

  const circleName = route.paramMap.get('name');
  const questionId = route.paramMap.get('qid');

  if (!circleName || !questionId) return null;

  // Fetch circle
  const { isError: circleError, result: circle } = await cs.readCircle(circleName);
  if (circleError || !circle) return null;

  // Find question in circle data
  const question = (circle as Circle).questions.find(
    (q) => q.slug === questionId || q._id === questionId
  );

  if (!question) return null;

  // Fetch answers for structured data (SSR)
  const { isError: answersError, result: answersResult } = await api.read<Answer[]>(
    `/answers/${question._id}`,
    true
  );
  const answers = answersError ? [] : (answersResult as Answer[]) || [];

  // Set SEO meta BEFORE render (this is key for SSR!)
  const plainCircleName = (circle as Circle).name.replace(/^c\//, '');
  seoService.setQuestionMeta(question, plainCircleName);

  // Set canonical URL for SEO
  const canonicalUrl = `https://helpa.ws/c/${plainCircleName}/questions/${question.slug || question._id}`;
  seoService.setCanonical(canonicalUrl);

  // Set JSON-LD structured data for SEO (SSR)
  seoService.setQAPageStructuredData(question, plainCircleName, answers);

  return { circle: circle as Circle, question, answers };
};
