/** @jsxImportSource https://esm.sh/preact@10.19.6 */
import {
    useImperativeHandle,
    useRef,
} from "https://esm.sh/preact@10.19.6/hooks";
import { forwardRef } from "https://esm.sh/preact@10.19.6/compat";
import type {
    EditorState,
    EditorStateConfig,
    Extension,
    StateField,
} from "https://esm.sh/@codemirror/state@6.4.1";
import type {
    EditorView,
    ViewUpdate,
} from "https://esm.sh/@codemirror/view@6.34.1";
import type { BasicSetupOptions } from "https://esm.sh/@uiw/codemirror-extensions-basic-setup@4.23.5";
import { useCodeMirror } from "./useCodeMirror.ts";
import type { Statistics } from "./utils.ts";

export * from "https://esm.sh/@codemirror/view@6.34.1";
export * from "https://esm.sh/@codemirror/state@6.4.1";

export * from "https://esm.sh/@uiw/codemirror-extensions-basic-setup@4.23.5";
export * from "./useCodeMirror.ts";
export * from "./getDefaultExtensions.ts";
export * from "./utils.ts";

export interface PreactCodeMirrorProps
    extends
        Omit<EditorStateConfig, "doc" | "extensions">,
        Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "placeholder"> {
    /** value of the auto created model in the editor. */
    value?: string;
    height?: string;
    minHeight?: string;
    maxHeight?: string;
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    /** focus on the editor. */
    autoFocus?: boolean;
    /** Enables a placeholder—a piece of example content to show when the editor is empty. */
    placeholder?: string | HTMLElement;
    /**
     * `light` / `dark` / `Extension` Defaults to `light`.
     * @default light
     */
    theme?: "light" | "dark" | "none" | Extension;
    /**
     * Whether to optional basicSetup by default
     * @default true
     */
    basicSetup?: boolean | BasicSetupOptions;
    /**
     * This disables editing of the editor content by the user.
     * @default true
     */
    editable?: boolean;
    /**
     * This disables editing of the editor content by the user.
     * @default false
     */
    readOnly?: boolean;
    /**
     * Controls whether pressing the `Tab` key inserts a tab character and indents the text (`true`)
     * or behaves according to the browser's default behavior (`false`).
     * @default true
     */
    indentWithTab?: boolean;
    /** Fired whenever a change occurs to the document. */
    onChange?(value: string, viewUpdate: ViewUpdate): void;
    /** Some data on the statistics editor. */
    onStatistics?(data: Statistics): void;
    /** Fired whenever any state change occurs within the editor, including non-document changes like lint results. */
    onUpdate?(viewUpdate: ViewUpdate): void;
    /** The first time the editor executes the event. */
    onCreateEditor?(view: EditorView, state: EditorState): void;
    /**
     * Extension values can be [provided](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions) when creating a state to attach various kinds of configuration and behavior information.
     * They can either be built-in extension-providing objects,
     * such as [state fields](https://codemirror.net/6/docs/ref/#state.StateField) or [facet providers](https://codemirror.net/6/docs/ref/#state.Facet.of),
     * or objects with an extension in its `extension` property. Extensions can be nested in arrays arbitrarily deep—they will be flattened when processed.
     */
    extensions?: Extension[];
    /**
     * If the view is going to be mounted in a shadow root or document other than the one held by the global variable document (the default), you should pass it here.
     * Originally from the [config of EditorView](https://codemirror.net/6/docs/ref/#view.EditorView.constructor%5Econfig.root)
     */
    root?: ShadowRoot | Document;
    /**
     * Create a state from its JSON representation serialized with [toJSON](https://codemirror.net/docs/ref/#state.EditorState.toJSON) function
     */
    initialState?: {
        // deno-lint-ignore no-explicit-any
        json: any;
        // deno-lint-ignore no-explicit-any
        fields?: Record<string, StateField<any>>;
    };
}

export interface PreactCodeMirrorRef {
    editor?: HTMLDivElement | null;
    state?: EditorState;
    view?: EditorView;
}

const PreactCodeMirror = forwardRef<PreactCodeMirrorRef, PreactCodeMirrorProps>(
    (props, ref) => {
        const {
            className,
            value = "",
            selection,
            extensions = [],
            onChange,
            onStatistics,
            onCreateEditor,
            onUpdate,
            autoFocus,
            theme = "light",
            height,
            minHeight,
            maxHeight,
            width,
            minWidth,
            maxWidth,
            basicSetup,
            placeholder,
            indentWithTab,
            editable,
            readOnly,
            root,
            initialState,
            ...other
        } = props;
        const editor = useRef<HTMLDivElement>(null);
        const { state, view, container } = useCodeMirror({
            container: editor.current,
            root,
            value,
            autoFocus,
            theme,
            height,
            minHeight,
            maxHeight,
            width,
            minWidth,
            maxWidth,
            basicSetup,
            placeholder,
            indentWithTab,
            editable,
            readOnly,
            selection,
            onChange,
            onStatistics,
            onCreateEditor,
            onUpdate,
            extensions,
            initialState,
        });

        useImperativeHandle(
            ref,
            () => ({ editor: editor.current, state: state, view: view }),
            [
                editor,
                container,
                state,
                view,
            ],
        );

        // check type of value
        if (typeof value !== "string") {
            throw new Error(
                `value must be typeof string but got ${typeof value}`,
            );
        }

        const defaultClassNames = typeof theme === "string"
            ? `cm-theme-${theme}`
            : "cm-theme";
        return (
            <div
                ref={editor}
                className={`${defaultClassNames}${
                    className ? ` ${className}` : ""
                }`}
                {...other}
            >
            </div>
        );
    },
);

PreactCodeMirror.displayName = "CodeMirror";

export default PreactCodeMirror;