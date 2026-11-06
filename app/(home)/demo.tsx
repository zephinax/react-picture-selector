/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Check, Copy, RefreshCw, Trash2, Upload, Sparkles, Eye } from "lucide-react";

export function InstallTabs() {
  const [activeTab, setActiveTab] = useState<"npm" | "pnpm" | "bun" | "yarn">("npm");
  const [copied, setCopied] = useState(false);

  const commands = {
    npm: "npm install react-picture-selector",
    pnpm: "pnpm add react-picture-selector",
    bun: "bun add react-picture-selector",
    yarn: "yarn add react-picture-selector",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(commands[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white/70 p-2 shadow-xl shadow-cyan-500/5 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 px-2 dark:border-white/10">
        <div className="flex gap-1.5">
          {(["npm", "pnpm", "bun", "yarn"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                activeTab === tab
                  ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                  : "text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copy command"
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="px-3 pt-3 pb-1 font-mono text-xs text-slate-800 dark:text-cyan-300 sm:text-sm">
        <span className="text-slate-400 select-none">$ </span>
        {commands[activeTab]}
      </div>
    </div>
  );
}

export function InteractiveSimulator() {
  const [image, setImage] = useState<string | null>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shape, setShape] = useState<"profile" | "image">("profile");

  const sampleImages = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
  ];

  const simulateUpload = () => {
    if (isUploading) return;
    setIsUploading(true);
    setProgress(0);

    const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    let current = 0;
    const interval = setInterval(() => {
      current += 4;
      if (current >= 100) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setImage(randomImg);
          setIsUploading(false);
          setProgress(0);
        }, 300);
      } else {
        setProgress(current);
      }
    }, 40);
  };

  const handleDelete = () => {
    setImage(null);
  };

  const size = 180;
  const radius = size / 2;
  const strokeWidth = 5;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative mx-auto w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/60">
            Interactive Test Mode
          </span>
        </div>
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5 text-xs">
          <button
            onClick={() => setShape("profile")}
            className={`rounded-lg px-2.5 py-1 font-medium transition ${
              shape === "profile"
                ? "bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-white/60"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setShape("image")}
            className={`rounded-lg px-2.5 py-1 font-medium transition ${
              shape === "image"
                ? "bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-white/60"
            }`}
          >
            Image
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Progress Ring for Profile */}
          {shape === "profile" && isUploading && (
            <svg
              height={size}
              width={size}
              className="absolute inset-0 -rotate-90 pointer-events-none z-20"
            >
              <circle
                stroke="rgba(42, 132, 250, 0.2)"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="#2a84fa"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset, transition: "stroke-dashoffset 80ms ease" }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
          )}

          {/* Avatar Container */}
          <div
            onClick={() => image && setPreviewOpen(true)}
            className={`group relative h-full w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md transition-all ${
              shape === "profile" ? "rounded-full" : "rounded-2xl"
            } ${image ? "cursor-pointer hover:ring-4 hover:ring-cyan-500/30" : ""}`}
          >
            {image ? (
              <img
                src={image}
                alt="Avatar"
                className={`h-full w-full object-cover transition duration-300 ${
                  isUploading ? "blur-xs scale-105 opacity-60" : "scale-100"
                }`}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-500">
                <Upload className="h-10 w-10 opacity-50" />
              </div>
            )}

            {/* Hover overlay for preview */}
            {image && !isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Eye className="h-6 w-6 text-white" />
              </div>
            )}

            {/* Linear Progress for Image Type */}
            {shape === "image" && isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
                <span className="text-lg font-bold text-white">{progress}%</span>
                <div className="mt-2 h-1.5 w-3/4 rounded-full bg-white/30 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <button
            onClick={simulateUpload}
            disabled={isUploading}
            aria-label="Upload image"
            className="absolute bottom-2 right-2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition hover:scale-110 active:scale-95 disabled:opacity-50"
          >
            {isUploading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </button>

          {image && !isUploading && (
            <button
              onClick={handleDelete}
              aria-label="Delete image"
              className="absolute bottom-2 left-2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 transition hover:scale-110 active:scale-95"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="mt-4 text-xs text-slate-500 dark:text-white/60">
          {image ? "Click avatar to open preview modal" : "Drop or click upload to simulate"}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={simulateUpload}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Simulate Upload
          </button>
          {image && (
            <button
              onClick={handleDelete}
              disabled={isUploading}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Modal Preview Mockup */}
      {previewOpen && (
        <div
          onClick={() => setPreviewOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm rounded-2xl bg-slate-900 p-4 shadow-2xl border border-white/10 text-white"
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold">Image Preview Modal</h4>
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg p-1 text-white/60 hover:text-white hover:bg-white/10 text-xs"
              >
                ✕
              </button>
            </div>
            <div className="overflow-hidden rounded-xl">
              <img src={image || ""} alt="Preview" className="h-64 w-full object-cover" />
            </div>
            <p className="mt-2 text-center text-xs text-white/60">
              Supports zoom, pan, 90° rotation & fullscreen in production.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
