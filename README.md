<p align="center">
  <img 
    src="https://raw.githubusercontent.com/Zephinax/react-picture-selector/refs/heads/dev/public/circle.gif" 
    alt="Profile Picture Upload Animation"
  />
</p>

<h1 align="center">
  React Picture Selector
  <br/>
  <a href="https://zephinax.github.io/react-picture-selector" target="_blank">Click Here To Show Demo</a>
</h1>

![React](https://img.shields.io/badge/React-18.x-%231DAFBF) ![TypeScript](https://img.shields.io/badge/TypeScript-Included-%23178C6) ![Axios](https://img.shields.io/badge/Axios-1.x-%235A29E4)

The `PictureSelector` component is a highly customizable React component designed for seamless image upload, deletion, and preview functionality, ideal for profile pictures or general image management. It supports real API-based operations and a test mode for simulating uploads and deletions, making it versatile for both production and development environments.

## Table of Contents

<ul>
  <li><a href="#features">Features</a></li>
  <li><a href="#installation">Installation</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#dependencies">Dependencies</a></li>
  <li><a href="#api-configuration">API Configuration</a></li>
  <li><a href="#test-mode">Test Mode</a></li>
  <li><a href="#styling">Styling</a></li>
  <li><a href="#error-handling">Error Handling</a></li>
  <li><a href="#example">Example</a></li>
  <li><a href="#release-notes">Release Notes</a></li>
</ul>

# Features

- **Smooth Image Upload**: Upload images with a progress ring (for profiles) or percentage display, powered by `requestAnimationFrame` for smooth animations and low CPU usage.
- **Flexible Image Deletion**: Delete images via API with customizable HTTP methods, headers, and request body, or simulated deletion in test mode.
- **Progress Indicator**: Displays a progress ring for circular profiles or a percentage-based indicator, with non-linear fallback for servers without `Content-Length`.
- **Drag and Drop Support**: Allows users to drag and drop images with visual feedback, with prevention of dragging selected photos for better UX.
- **Image Preview**: Clickable modal preview for uploaded images, supporting circular and rectangular formats.
- **Full API Response Access**: Provides the full API response body as an optional parameter in `onChangeImage` for advanced use cases.
- **Configurable Styling**: Customize colors, sizes, shapes, and additional CSS classes for full control over appearance.
- **Abort Controller**: Cancel ongoing uploads using `AbortController` for better user control.
- **Event Callbacks**: Support for `onUploadSuccess`, `onUploadError`, `onDeleteStart`, and `onDeleteSuccess` callbacks to handle upload and deletion events.
- **Test Mode**: Simulate uploads and deletions with configurable delays, ideal for testing without API dependencies.
- **Responsive Design**: Supports RTL layouts, responsive sizing, and both circular (profile) and rectangular image types.
- **Robust Error Handling**: Displays clear error messages for failed operations, with proper cleanup to prevent resource leaks.
- **Performance Optimizations**: Prevents race conditions, ensures clean percentage displays, and optimizes resource usage using `useMemo` and `useCallback`.

## Installation

1. Ensure you have React and the required dependencies installed.
2. Install the package:
   ```bash
   npm i react-picture-selector
   ```
3. Import and use the component in your React application.

## Usage

Import the `PictureSelector` component and configure it with the necessary props to control its behavior and appearance.

```jsx
import PictureSelector from "react-picture-selector";

const App = () => {
  const handleImageChange = (imageUrl: string, responseData?: any) => {
    console.log("New image URL:", imageUrl);
    console.log("API response data:", responseData);
  };

  return (
    <PictureSelector
      imageUrl="https://www.gravatar.com/avatar/f84a9c7b670949d7c5534ae374217ac9?s=256&d=initials"
      onChangeImage={handleImageChange}
      type="profile"
      title="Profile Picture"
      size={180}
    />
  );
};
```

### ColorPalette Interface

```typescript
interface ColorPalette {
  primary: string; // Edit button background color
  error: string; // Delete button background color
  progress: string; // Progress ring/percentage color
  placeholder: string; // Placeholder SVG color
  text: string; // Progress percentage text color
  textDisabled: string; // Disabled button text/icon color
}
```

### apiConfig Interface

```typescript
interface apiConfig {
  deleteUrl: string; // Path for deleting images, combined with baseUrl
  uploadUrl: string; // Path for uploading images, combined with baseUrl
  baseUrl: string; // Base URL for API requests
  responsePath?: string; // Path to extract image URL from API response (default: "data.data")
  formDataName?: string; // Name of the file field in FormData
  additionalHeaders?: Record<string, string>; // Deprecated: shared headers for upload/delete
  uploadHeaders?: Record<string, string>; // Upload-only headers
  deleteHeaders?: Record<string, string>; // Delete-only headers
  uploadMethod?: "POST" | "PUT" | "PATCH"; // HTTP method for upload requests
  deleteMethod?: "POST" | "DELETE" | "PUT"; // HTTP method for delete requests
  deleteBody?:
    | Record<string, unknown>
    | ((imageUrl: string) => Record<string, unknown>); // Request body for delete operations
  onUploadSuccess?: (url: string) => void; // Callback for successful upload
  onUploadError?: (error: any) => void; // Callback for upload errors
  onDeleteStart?: () => void; // Callback when deletion starts
  onDeleteSuccess?: () => void; // Callback for successful deletion
}
```

### additionalClassNames Interface

```typescript
interface additionalClassNames {
  title?: string; // Class for title text
  titleContainer?: string; // Class for title container
  delete?: string; // Class for delete button
  edit?: string; // Class for edit button
  image?: string; // Class for image element
}
```

## Dependencies

- **React**: For component rendering and state management.
- **Axios**: For making API requests in real mode.

## API Configuration

The `apiConfig` prop allows you to specify endpoints, HTTP methods, headers, and callbacks for upload and delete operations. In real mode, the component sends HTTP requests to the combined `baseUrl` and `uploadUrl`/`deleteUrl`. Ensure your API supports:

- **Upload**: Accepts a `multipart/form-data` request with the file attached, using the specified `uploadMethod` (default: POST).
- **Delete**: Accepts a request to the combined `baseUrl` and `deleteUrl`, with customizable `deleteMethod` (default: POST), `deleteBody`, and `deleteHeaders` (or `additionalHeaders` for backwards compatibility).

Example:

```typescript
const apiConfig = {
  baseUrl: "https://api.example.com",
  uploadUrl: "/upload",
  deleteUrl: "/remove/123",
  formDataName: "image",
  uploadHeaders: {
    Authorization: "Bearer your-token",
  },
  deleteHeaders: {
    Authorization: "Bearer your-token",
    "Content-Type": "application/json",
  },
  uploadMethod: "POST",
  deleteMethod: "DELETE",
  deleteBody: (imageUrl: string) => ({ imageId: imageUrl.split("/").pop() }),
  onUploadSuccess: (url: string) => console.log("Uploaded:", url),
  onUploadError: (error: any) => console.error("Upload failed:", error),
  onDeleteStart: () => console.log("Deletion started"),
  onDeleteSuccess: () => console.log("Deletion succeeded"),
};
```

## Test Mode

When `testMode` is set to `true`, the component simulates upload and deletion operations without making actual API calls. The `testUploadDelay` prop controls the duration of the simulated upload process (in milliseconds).

## Styling

The component uses Tailwind CSS classes for basic styling, but you can override styles using:

- The `colors` prop for color customization.
- The `additionalClassNames` prop to add custom CSS classes to specific elements.
- The `size` prop to adjust the dimensions of the image container.

The progress ring (for circular images) and progress bar (for rectangular images) are rendered using SVG elements, with styles derived from the `colors` prop.

## Error Handling

Errors during upload or deletion are handled by the `errorHandler` utility. If an error occurs:

- The error message is displayed below the component.
- In test mode, errors are logged with a "🧪 Test Mode" prefix for clarity.
- If an upload or deletion is canceled (via AbortController), a cancellation message is logged.
- Callbacks (`onUploadError`, `onDeleteStart`, `onDeleteSuccess`) allow custom handling of operation results.

## Example

```jsx
import PictureSelector from "react-picture-selector";

const App = () => {
  const handleImageChange = (imageUrl: string, responseData?: any) => {
    console.log("Image changed to:", imageUrl);
    console.log("API response data:", responseData);
  };

  const customApiConfig = {
    baseUrl: "https://api.example.com",
    uploadUrl: "/upload",
    deleteUrl: "/remove/123",
    formDataName: "image",
    uploadHeaders: {
      Authorization: "Bearer your-token",
    },
    deleteHeaders: {
      Authorization: "Bearer your-token",
      "Content-Type": "application/json",
    },
    uploadMethod: "POST",
    deleteMethod: "DELETE",
    deleteBody: (imageUrl: string) => ({ imageId: imageUrl.split("/").pop() }),
    onUploadSuccess: (url: string) => console.log("Uploaded:", url),
    onUploadError: (error: any) => console.error("Upload failed:", error),
    onDeleteStart: () => console.log("Deletion started"),
    onDeleteSuccess: () => console.log("Deletion succeeded"),
  };

  const customColors = {
    primary: "#1E90FF",
    error: "#FF0000",
    progress: "#FF69B4",
    placeholder: "#A9A9A9",
    text: "#FFFFFF",
    textDisabled: "#D3D3D3",
  };

  return (
    <PictureSelector
      apiConfig={customApiConfig}
      imageUrl="https://www.gravatar.com/avatar/f84a9c7b670949d7c5534ae374217ac9?s=256&d=initials"
      onChangeImage={handleImageChange}
      type="profile"
      title="User Avatar"
      size={200}
      colors={customColors}
      showProgressRing={true}
      blurOnProgress={true}
      enableAbortController={true}
      testMode={false}
      testUploadDelay={1500}
    />
  );
};

export default App;
```

## Release Notes

- **Latest Release**:
  - Added support for passing full API response body as an optional second parameter to `onChangeImage`.
  - Prevented dragging of selected photo to improve user experience.
  - Improved error management with better validation (e.g., `deleteUrl` checks) and type safety for TypeScript.
  - Fixed image replacement bug to ensure new image uploads before deleting the old one.
  - Added support for custom HTTP methods (`uploadMethod`, `deleteMethod`) and request body (`deleteBody`) in `apiConfig`.
  - Added event callbacks (`onUploadSuccess`, `onUploadError`, `onDeleteStart`, `onDeleteSuccess`) to `apiConfig`.
  - Made `responsePath` optional with default `"data.data"`.
  - Improved TypeScript safety for refs and deleteBody.
  - Ensured `deleteUrl` is always combined with `baseUrl` for consistent API requests.
  - Enhanced error handling and performance optimizations.
