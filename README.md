<p align="center">
  <img src="https://raw.githubusercontent.com/zephinax/react-picture-selector/main/assets/circle.gif" alt="React Picture Selector Preview" width="180" />
</p>

<h1 align="center">React Picture Selector</h1>

<p align="center">
  A lightweight, accessible, zero-CSS image upload component with progress rings, preview modals, and test mode.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-picture-selector"><img src="https://img.shields.io/npm/v/react-picture-selector.svg?style=flat-square&color=0284c7" alt="npm version" /></a>
  <a href="https://bundlephobia.com/package/react-picture-selector"><img src="https://img.shields.io/bundlephobia/minzip/react-picture-selector?style=flat-square&color=10b981" alt="bundle size" /></a>
  <a href="https://github.com/zephinax/react-picture-selector/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/zephinax/react-picture-selector/ci.yml?branch=main&style=flat-square&label=CI" alt="CI Status" /></a>
  <img src="https://img.shields.io/badge/React-18%20%7C%2019-61dafb?style=flat-square&logo=react" alt="React 18/19" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178c6?style=flat-square&logo=typescript" alt="TypeScript" />
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/react-picture-selector?style=flat-square" alt="MIT License" /></a>
</p>

<p align="center">
  <strong><a href="https://react-picture-selector.zephinax.com">📖 Documentation & Live Playground</a></strong>
</p>

---

## ✨ Features

- **Zero CSS runtime**: 100% pure inline styles. No Tailwind, PostCSS, or CSS file imports required.
- **SVG progress ring**: Real-time circumference animation for avatars and percentage bars for images.
- **Interactive lightbox**: Modal preview with zoom, pan, 90° rotation, and ESC key handling.
- **Test mode built-in**: Prototype instantly with mocked progress loops (`testMode: true`).
- **Network ready**: Granular auth headers, split upload/delete routes, and `AbortController` cancellation.
- **SSR safe**: Next.js 15+ App Router and Pages Router hydration-guarded.

---

## 📦 Installation

```bash
npm install react-picture-selector # or pnpm add / bun add / yarn add
```

---

## 🚀 Usage

### 1. Instant Test Mode (No backend needed)

```tsx
import React, { useState } from "react";
import PictureSelector from "react-picture-selector";

export default function Profile() {
  const [avatar, setAvatar] = useState<string | null>(null);

  return (
    <PictureSelector
      title="Avatar"
      imageUrl={avatar}
      onChangeImage={(url) => setAvatar(url)}
      testMode={true}
    />
  );
}
```

### 2. Connected to Backend API

```tsx
import PictureSelector from "react-picture-selector";

export default function UserAvatar() {
  const [imageUrl, setImageUrl] = useState("https://cdn.example.com/photo.jpg");

  return (
    <PictureSelector
      imageUrl={imageUrl}
      onChangeImage={(url, rawResponse) => setImageUrl(url)}
      apiConfig={{
        baseUrl: "https://api.example.com",
        uploadUrl: "/users/avatar",
        deleteUrl: "/users/avatar",
        formDataName: "avatar",
        responsePath: "data.url",
        uploadHeaders: { Authorization: "Bearer token" },
        deleteHeaders: { Authorization: "Bearer token" },
      }}
    />
  );
}
```

---

## 📋 Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `imageUrl` | `string \| null` | `null` | Displayed image URL. |
| `onChangeImage` | `(url: string, res?: any) => void` | **Required** | Callback when image is uploaded or cleared. |
| `type` | `"profile" \| "image"` | `"profile"` | `"profile"` (circular avatar) or `"image"` (rectangular media). |
| `size` | `number` | `180` | Diameter or container size in pixels. |
| `title` | `string` | `undefined` | Header title above selector. |
| `viewOnly` | `boolean` | `false` | Read-only mode: hides upload/delete, allows preview modal. |
| `testMode` | `boolean` | `false` | Enables local simulated uploads without backend APIs. |
| `testUploadDelay`| `number` | `1000` | Mock upload animation duration in ms. |
| `apiConfig` | `ApiConfig` | `undefined` | Remote endpoints, auth headers, methods, and callbacks. |
| `colors` | `ColorPalette` | Default | Override `primary`, `error`, `progress`, `placeholder`, `text`. |
| `additionalClassNames` | `object` | `{}` | Custom classes for `title`, `image`, `edit`, `delete` slots. |
| `blurOnProgress` | `boolean` | `true` | Blurs current image during active uploads. |
| `showProgressRing` | `boolean` | `true` | Toggles circular progress ring on avatar. |

For full prop types and advanced configuration, visit the [Interactive Docs](https://react-picture-selector.zephinax.com).

---

## 📄 License

MIT © [Zephinax](https://github.com/Zephinax)
