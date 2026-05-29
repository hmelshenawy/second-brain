import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Strip markdown syntax and return a plain-text preview.
 * Handles headings, bold, italic, inline code, links, images, blockquotes.
 */
export function markdownToPreview(md: string, maxLength = 100): string {
  if (!md) return ''

  const plain = md
    .replace(/!\[.*?\]\(.*?\)/g, '')       // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links → label only
    .replace(/#{1,6}\s+/g, '')             // headings
    .replace(/(\*\*|__)(.*?)\1/g, '$2')   // bold
    .replace(/(\*|_)(.*?)\1/g, '$2')      // italic
    .replace(/`{1,3}[^`]*`{1,3}/g, '')    // inline + fenced code
    .replace(/^\s*[-*+]\s+/gm, '')        // list bullets
    .replace(/^\s*\d+\.\s+/gm, '')        // numbered lists
    .replace(/^\s*>\s+/gm, '')            // blockquotes
    .replace(/\n+/g, ' ')                 // newlines → space
    .trim()

  return plain.length > maxLength
    ? plain.slice(0, maxLength).trimEnd() + '…'
    : plain
}

/**
 * Format a date string as a relative label: today, yesterday, Xd ago, or MMM D.
 */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7)  return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}