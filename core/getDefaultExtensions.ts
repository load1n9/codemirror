import type { Extension } from "https://esm.sh/@codemirror/state@6.4.1";
import { indentWithTab } from "https://esm.sh/@codemirror/commands@6.7.0";
import {
    basicSetup,
    type BasicSetupOptions,
} from "https://esm.sh/@uiw/codemirror-extensions-basic-setup@4.23.5";
import { EditorView, keymap, placeholder } from "https://esm.sh/@codemirror/view@6.34.1";
import { oneDark } from "https://esm.sh/@codemirror/theme-one-dark@6.1.2";
import { EditorState } from "https://esm.sh/@codemirror/state@6.4.1";
import { defaultLightThemeOption } from "./theme/light.ts";

export * from "https://esm.sh/@codemirror/theme-one-dark@6.1.2";
export * from "./theme/light.ts";

export interface DefaultExtensionsOptions {
    indentWithTab?: boolean;
    basicSetup?: boolean | BasicSetupOptions;
    placeholder?: string | HTMLElement;
    theme?: "light" | "dark" | "none" | Extension;
    readOnly?: boolean;
    editable?: boolean;
}

export const getDefaultExtensions = (
    optios: DefaultExtensionsOptions = {},
): Extension[] => {
    const {
        indentWithTab: defaultIndentWithTab = true,
        editable = true,
        readOnly = false,
        theme = "light",
        placeholder: placeholderStr = "",
        basicSetup: defaultBasicSetup = true,
    } = optios;
    const getExtensions: Extension[] = [];
    if (defaultIndentWithTab) {
        getExtensions.unshift(keymap.of([indentWithTab]));
    }
    if (defaultBasicSetup) {
        if (typeof defaultBasicSetup === "boolean") {
            getExtensions.unshift(basicSetup());
        } else {
            getExtensions.unshift(basicSetup(defaultBasicSetup));
        }
    }
    if (placeholderStr) {
        getExtensions.unshift(placeholder(placeholderStr));
    }
    switch (theme) {
        case "light":
            getExtensions.push(defaultLightThemeOption);
            break;
        case "dark":
            getExtensions.push(oneDark);
            break;
        case "none":
            break;
        default:
            getExtensions.push(theme);
            break;
    }
    if (editable === false) {
        getExtensions.push(EditorView.editable.of(false));
    }
    if (readOnly) {
        getExtensions.push(EditorState.readOnly.of(true));
    }

    return [...getExtensions];
};
