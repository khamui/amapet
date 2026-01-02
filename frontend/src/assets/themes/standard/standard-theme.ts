import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import light from './light';
import dark from './dark';
import { togglebuttonTheme } from './components/togglebutton';
import { checkboxTheme } from './components/checkbox';

export const StandardTheme = definePreset(Aura, {
  semantic: {
    colorScheme: { light, dark },
  },
  components: {
    ...togglebuttonTheme,
    ...checkboxTheme,
  },
});
