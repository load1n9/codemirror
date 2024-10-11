import { EditorView } from "https://esm.sh/@codemirror/view@6.34.1";

export const defaultLightThemeOption = EditorView.theme(
  {
    '&': {
      backgroundColor: '#fff',
    },
  },
  {
    dark: false,
  },
);