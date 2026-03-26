"use client";

import React, { useState, memo, useCallback } from "react";
import {
  ClipboardIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";

interface CopyButtonProps {
  textToCopy: string;
  ariaLabel: string;
  className?: string;
}

const CopyButton = ({ textToCopy, ariaLabel, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [title, setTitle] = useState(`Copy ${ariaLabel} to clipboard`);

  // ⚡ Bolt: Memoize the copy handler with useCallback.
  // This prevents the function from being recreated on every render,
  // making the component more memory-efficient and preventing unnecessary
  // re-renders of the child Button component.
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setStatusMessage(`${ariaLabel} copied to clipboard!`);
      setTitle(`${ariaLabel} copied!`);
    } catch (err) {
      setError(true);
      setStatusMessage(`Failed to copy ${ariaLabel}`);
      setTitle(`Failed to copy ${ariaLabel}`);
      console.error("Failed to copy text: ", err);
    } finally {
      setTimeout(() => {
        setCopied(false);
        setError(false);
        setStatusMessage("");
        setTitle(`Copy ${ariaLabel} to clipboard`);
      }, 2000);
    }
  }, [textToCopy, ariaLabel]);

  return (
    <>
      <Button
        onClick={handleCopy}
        variant="ghost"
        className={`p-2 h-auto ${className}`}
        aria-label={
          copied
            ? `${ariaLabel} copied to clipboard!`
            : `Copy ${ariaLabel} to clipboard`
        }
        title={title}
        type="button"
      >
        {copied ? (
          <CheckIcon className="w-5 h-5 text-success" />
        ) : error ? (
          <XMarkIcon className="w-5 h-5 text-error" />
        ) : (
          <ClipboardIcon className="w-5 h-5" />
        )}
      </Button>
      {/* Visually hidden container for screen reader announcements */}
      <span className="sr-only" aria-live="polite">
        {statusMessage}
      </span>
    </>
  );
};

export default memo(CopyButton);
