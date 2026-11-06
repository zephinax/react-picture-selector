import Link from "next/link";
import {
  ArrowRight,
  Check,
  Code2,
  Cpu,
  Eye,
  ExternalLink,
  Layers3,
  Palette,
  RefreshCw,
  ShieldCheck,
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";
import { InstallTabs, InteractiveSimulator } from "./demo";

const features = [
  {
    title: "Pure Inline Styles",
    description:
      "Zero CSS file imports, zero Tailwind setup required, and zero class collisions. Drops flawlessly into any codebase or design system.",
    icon: Palette,
    accent: "text-blue-600 dark:text-blue-400",
    gradient: "from-blue-500/10 to-transparent",
  },
  {
    title: "Smooth SVG Progress Rings",
    description:
      "Real-time circumference-based circular progress for profile avatars and sleek progress bars for rectangular images.",
    icon: RefreshCw,
    accent: "text-cyan-600 dark:text-cyan-300",
    gradient: "from-cyan-500/10 to-transparent",
  },
  {
    title: "SSR & Next.js 15+ Ready",
    description:
      "Guarded against server hydration crashes with browser checks and dynamic portals. Works seamlessly in App Router and Pages Router.",
    icon: ShieldCheck,
    accent: "text-emerald-600 dark:text-emerald-300",
    gradient: "from-emerald-500/10 to-transparent",
  },
  {
    title: "Granular Network Control",
    description:
      "Split headers for upload vs delete endpoints, customizable form field names, Bearer tokens, and AbortController request cancellation.",
    icon: Sliders,
    accent: "text-amber-600 dark:text-amber-300",
    gradient: "from-amber-500/10 to-transparent",
  },
  {
    title: "Accessible Preview Modal",
    description:
      "Full preview overlay with zoom, 90° rotation, pan, ESC key bindings, and backdrop click dismiss out of the box.",
    icon: Eye,
    accent: "text-purple-600 dark:text-purple-300",
    gradient: "from-purple-500/10 to-transparent",
  },
  {
    title: "Interactive Test Mode",
    description:
      "Prototype UI and upload animations instantly in Storybook, staging, or local tests with zero backend setup required.",
    icon: Sparkles,
    accent: "text-pink-600 dark:text-pink-300",
    gradient: "from-pink-500/10 to-transparent",
  },
];

const checklist = [
  "Built-in preview modal with zoom, 90° rotation & pan",
  "AbortController native cancellation on demand",
  "Full API response and URL passed back to callbacks",
  "Dual shape modes: circular 'profile' and rectangular 'image'",
  "TypeScript types exported first-class",
  "Works in Next.js, Remix, Vite, and Create React App",
];

const codeSample = `import PictureSelector from "react-picture-selector";

export function UserAvatar() {
  return (
    <PictureSelector
      imageUrl="https://cdn.example.com/avatar.jpg"
      title="Profile Avatar"
      type="profile"
      size={180}
      apiConfig={{
        baseUrl: "https://api.example.com",
        uploadUrl: "/users/avatar",
        deleteUrl: "/users/avatar",
        headers: {
          Authorization: "Bearer your-token",
        },
      }}
      onChangeImage={(url, response) => {
        console.log("Uploaded new photo:", url, response);
      }}
      onDeleteImage={(response) => {
        console.log("Photo removed:", response);
      }}
    />
  );
}`;

export default function HomePage() {
  return (
    <div className="relative flex-1 overflow-hidden bg-linear-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:text-white">
      {/* Ambient background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-linear-to-br from-cyan-500/20 via-blue-500/20 to-transparent blur-3xl dark:from-cyan-500/30 dark:via-blue-500/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -left-20 h-96 w-96 rounded-full bg-linear-to-tr from-purple-500/15 via-indigo-500/10 to-transparent blur-3xl dark:from-purple-500/20 dark:via-indigo-500/15"
      />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-16 sm:py-20 lg:px-12 lg:py-28">
        {/* HERO SECTION */}
        <section className="text-center">
          <div className="inline-flex">
            <Link
              href="https://github.com/zephinax/react-picture-selector/releases/tag/v2.5.0"
              target="_blank"
              rel="noreferrer"
              className="group mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-1.5 text-xs sm:text-sm text-slate-700 shadow-sm backdrop-blur transition hover:border-cyan-500/50 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white/80 dark:hover:border-cyan-400/50"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-900 dark:text-white">v2.5.0 Released</span>
              <span className="text-slate-400 dark:text-white/40">•</span>
              <span>Pure Inline Styles & SSR Safe</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-cyan-500" />
            </Link>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-balance leading-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            The polished way to upload pictures in{" "}
            <span className="bg-linear-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-300">
              React
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 dark:text-white/80 sm:max-w-3xl sm:text-lg lg:text-xl">
            React Picture Selector bundles drag & drop uploads, circular progress rings, accessible
            preview modals with zoom & rotation, customizable API flows, and zero CSS dependencies into
            one production-ready component.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-base sm:text-lg">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 dark:shadow-cyan-500/25"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/zephinax/react-picture-selector"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/60 px-6 py-3.5 font-semibold text-slate-800 backdrop-blur transition hover:bg-white hover:border-slate-400 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/40"
            >
              <Code2 className="h-4 w-4" />
              GitHub
            </Link>
            <Link
              href="https://www.npmjs.com/package/react-picture-selector"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white/60 px-5 py-3.5 text-sm font-medium text-slate-600 backdrop-blur transition hover:text-slate-900 hover:border-slate-400 dark:border-white/15 dark:bg-white/5 dark:text-white/70 dark:hover:text-white dark:hover:border-white/30"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              npm
            </Link>
          </div>

          {/* Quick Install Bar */}
          <InstallTabs />
        </section>

        {/* INTERACTIVE SIMULATOR SHOWCASE */}
        <section id="demo" className="rounded-3xl border border-slate-200/80 bg-linear-to-b from-white/90 via-slate-50/50 to-white/90 p-6 sm:p-10 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl dark:border-white/10 dark:from-slate-900/90 dark:via-slate-900/50 dark:to-slate-900/90">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-300">
              <Zap className="h-3.5 w-3.5" /> Live Preview
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
              Experience the UX in action
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-slate-600 dark:text-white/70">
              Switch shapes, click upload to simulate animated progress, delete pictures, and click the image to launch the preview modal.
            </p>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <InteractiveSimulator />
            </div>

            <div className="flex flex-col gap-4 lg:col-span-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Instant Test Mode
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-white/70">
                      Enable <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] dark:bg-white/10">testMode: true</code> to simulate real progress loops and mock uploads with zero backend API code.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Dual Layout Formats
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-white/70">
                      Switch effortlessly between circular profile avatars (<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] dark:bg-white/10">type="profile"</code>) and rectangular media banners (<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] dark:bg-white/10">type="image"</code>).
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Interactive Lightbox Preview
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-white/70">
                      Click any selected photo to view it full-screen. Supports 90° incremental rotation, zoom scaling, drag pan, and keyboard dismiss.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Zero CSS Runtime & ESM
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-white/70">
                      All styles are strictly inline and encapsulated. No CSS loaders, PostCSS, or Tailwind setup needed in the consuming app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section>
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-white/70">
              <Zap className="h-3.5 w-3.5 text-cyan-500" /> Key Advantages
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Engineered for developer happiness
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-white/70">
              Every feature was designed to make image uploading robust, accessible, and fast to integrate.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group relative rounded-3xl border border-slate-200/80 bg-white/80 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-white/20 dark:hover:shadow-cyan-500/5"
                >
                  <div className={`inline-flex rounded-2xl bg-linear-to-br ${feature.gradient} p-3`}>
                    <Icon className={`h-6 w-6 ${feature.accent}`} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-white/70">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CODE SAMPLE SECTION */}
        <section className="flex flex-col lg:flex-row gap-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-cyan-500/5 sm:p-10 dark:border-white/10 dark:bg-slate-900/80 dark:text-white">
          <div className="flex-1 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-white/20 dark:text-white/70">
              <Code2 className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              Plug & Play
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
              Wire up uploads with a handful of props
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-white/75 sm:text-base">
              Feed the component your backend routes once. Callbacks receive both the computed URL and the original HTTP response payload so nothing is lost.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-700 dark:text-white/80">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-full bg-emerald-100 p-1 dark:bg-emerald-400/20">
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                href="/docs/03-api-and-styling"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                Explore complete props reference
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950 p-4 shadow-xl dark:border-white/10 sm:p-5">
            <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">UserAvatar.tsx</span>
              </div>
              <span className="font-mono text-[10px] text-cyan-400">TypeScript</span>
            </div>
            <pre className="overflow-x-auto text-[0.75rem] leading-relaxed text-cyan-100 sm:text-xs">
              <code>{codeSample}</code>
            </pre>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-linear-to-r from-blue-600/10 via-cyan-500/10 to-indigo-600/10 p-8 sm:p-12 text-center backdrop-blur-xl dark:border-cyan-500/30">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
          />
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
            Ready to upgrade your upload experience?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-slate-600 dark:text-white/80">
            Install the package today, configure in minutes, and give your users an intuitive, polished photo selector.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
            >
              Read the Docs
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/zephinax/react-picture-selector"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/80 px-6 py-3 font-semibold text-slate-800 transition hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              Star on GitHub
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}