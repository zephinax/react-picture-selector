import { ReactNode } from "react";
export interface apiConfig {
  deleteUrl?: string;
  uploadUrl: string;
  baseUrl: string;
  responsePath?: string;
  formDataName?: string;
  additionalHeaders?: Record<string, string>;
  uploadHeaders?: Record<string, string>;
  deleteHeaders?: Record<string, string>;
  uploadMethod?: "POST" | "PUT" | "PATCH";
  deleteMethod?: "POST" | "DELETE" | "PUT";
  deleteBody?:
    | Record<string, unknown>
    | ((imageUrl: string) => Record<string, unknown>);
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: any) => void;
  onDeleteStart?: () => void;
  onDeleteSuccess?: () => void;
}

export interface ProfileSelectorPropsTypes {
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
  testMode?: boolean;
  testUploadDelay?: number;
}

export interface ModalProps {
  title: string | ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  childrenClass?: string;

  overflowY?:
    | "overflow-y-auto"
    | "overflow-y-hidden"
    | "overflow-y-visible"
    | "overflow-y-scroll"
    | "overflow-y-clip";
  size?: "sm" | "md" | "lg" | "xl" | "full" | "fit";
}

export interface UploadResponse {
  data?: string;
}

export interface ColorPalette {
  primary?: string;
  error?: string;
  progress?: string;
  placeholder?: string;
  text?: string;
  textDisabled?: string;
}

export interface additionalClassNames {
  title?: string;
  titleContainer?: string;
  delete?: string;
  edit?: string;
  image?: string;
}

export interface UseImageHandlerProps {
  apiConfig: apiConfig;
  testMode: boolean;
  testUploadDelay: number;
  onChangeImage: (imageUrl: string, responseData?: any) => void;
  currentImageUrl: string | null;
  enableAbortController: boolean;
  setImgError: (value: boolean) => void;
}
