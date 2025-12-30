import * as react_jsx_runtime from 'react/jsx-runtime';

interface apiConfig {
    deleteUrl?: string;
    uploadUrl: string;
    baseUrl: string;
    responsePath?: string;
    formDataName?: string;
    additionalHeaders?: Record<string, string>;
    uploadHeaders?: Record<string, string>;
    deleteHeaders?: Record<string, string>;
    withCredentials?: boolean;
    uploadMethod?: "POST" | "PUT" | "PATCH";
    deleteMethod?: "POST" | "DELETE" | "PUT";
    deleteBody?: Record<string, unknown> | ((imageUrl: string) => Record<string, unknown>);
    onUploadSuccess?: (url: string) => void;
    onUploadError?: (error: any) => void;
    onDeleteStart?: () => void;
    onDeleteSuccess?: () => void;
}
interface ProfileSelectorPropsTypes {
    imageUrl: string | null;
    onChangeImage: (imageUrl: string, responseData?: any) => void;
    type?: "profile" | "image";
    viewOnly?: boolean;
    title?: string;
    size?: number;
    buttonsMinSize?: number;
    colors?: ColorPalette;
    apiConfig?: apiConfig;
    additionalClassNames?: additionalClassNames;
    showProgressRing?: boolean;
    blurOnProgress?: boolean;
    enableAbortController?: boolean;
    debug?: boolean;
    testMode?: boolean;
    testUploadDelay?: number;
}
interface ColorPalette {
    primary?: string;
    error?: string;
    progress?: string;
    placeholder?: string;
    text?: string;
    textDisabled?: string;
}
interface additionalClassNames {
    title?: string;
    titleContainer?: string;
    delete?: string;
    edit?: string;
    image?: string;
}

declare const PictureSelector: ({ apiConfig, additionalClassNames, colors, imageUrl, type, onChangeImage, viewOnly, title, size, buttonsMinSize, showProgressRing, blurOnProgress, enableAbortController, debug, testMode, testUploadDelay, }: ProfileSelectorPropsTypes) => react_jsx_runtime.JSX.Element;

export { PictureSelector, PictureSelector as default };
export type { ProfileSelectorPropsTypes };
