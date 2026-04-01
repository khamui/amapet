import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CircleService } from '../services/circle.service';
import { SeoService } from '../services/seo.service';
import { Circle } from '../typedefs/Circle.typedef';
import { Question } from '../typedefs/Question.typedef';

export interface QuestionResolverData {
  circle: Circle;
  question: Question;
}

export const questionResolver: ResolveFn<QuestionResolverData | null> = async (route) => {
  const cs = inject(CircleService);
  const seoService = inject(SeoService);

  const circleName = route.paramMap.get('name');
  const questionId = route.paramMap.get('qid');

  if (!circleName || !questionId) return null;

  // Fetch circle
  const { isError: circleError, result: circle } = await cs.readCircle(circleName);
  if (circleError || !circle) return null;

  // Find question in circle or fetch directly
  let question = (circle as Circle).questions.find(
    (q) => q.slug === questionId || q._id === questionId
  );

  if (!question) {
    const { isError: qError, result: q } = await cs.readCircleQuestion(circleName, questionId);
    if (qError || !q) return null;
    question = q as Question;
  }

  // Set SEO meta BEFORE render (this is key for SSR!)
  const plainCircleName = (circle as Circle).name.replace(/^c\//, '');
  seoService.setQuestionMeta(question, plainCircleName);

  return { circle: circle as Circle, question };
};
