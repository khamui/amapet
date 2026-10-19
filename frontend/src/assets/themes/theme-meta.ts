export interface ThemeMeta {
  name: 'cozy' | 'honey';
  fontUrl: string;
  fontFamily: string;
}

export const CozyThemeMeta: ThemeMeta = {
  name: 'cozy',
  fontUrl:
    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,700&display=swap',
  fontFamily: "'Nunito', system-ui, sans-serif",
};

export const HoneyThemeMeta: ThemeMeta = {
  name: 'honey',
  fontUrl:
    'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap',
  fontFamily: "'DM Sans', system-ui, sans-serif",
};
