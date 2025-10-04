import { Component, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModerationStore } from 'src/app/stores/moderation.store';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { ModerationQuestionComponent } from '../moderation-question/moderation-question.component';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-moderation-questions',
  imports: [TabsModule, ModerationQuestionComponent],
  templateUrl: './moderation-questions.component.html',
  styleUrl: './moderation-questions.component.scss',
})
export class ModerationQuestionsComponent {
  /**
   * The currently selected circle based on the route parameter.
   * It retrieves the circle name from the route and finds the corresponding circle
   * from the moderated circles in the ModerationStore.
   */
  public currentCircle = computed(() => {
    const circleName = this.route.snapshot.paramMap.get('name');
    const circles: Circle[] = this.moderationStore.moderatedCircles$();
    return circles.find(
      (circle) => circleName && circle.name.endsWith(circleName),
    ) as Circle;
  });

  constructor(
    private route: ActivatedRoute,
    private moderationStore: ModerationStore,
  ) {}
}
