'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  className?: string
}

// Language color mappings based on popular conventions
const languageColors: Record<string, string> = {
  javascript: '#F7DF1E',
  typescript: '#3178C6',
  python: '#3776AB',
  java: '#ED8B00',
  cpp: '#00599C',
  c: '#A8B9CC',
  csharp: '#512BD4',
  php: '#777BB4',
  ruby: '#CC342D',
  go: '#00ADD8',
  rust: '#CE422B',
  swift: '#FA7343',
  kotlin: '#7F52FF',
  html: '#E34F26',
  css: '#1572B6',
  scss: '#CF649A',
  sass: '#CF649A',
  json: '#000000',
  yaml: '#CC1018',
  xml: '#005FAD',
  bash: '#4EAA25',
  shell: '#4EAA25',
  powershell: '#012456',
  sql: '#CC2927',
  jsx: '#61DAFB',
  tsx: '#61DAFB',
  vue: '#4FC08D',
  react: '#61DAFB',
  angular: '#DD0031',
  svelte: '#FF3E00',
  docker: '#2496ED',
  nginx: '#009639',
  apache: '#D22128',
  markdown: '#083FA1',
  dart: '#0175C2',
  flutter: '#02569B',
}

// Get language display name
const getLanguageDisplayName = (lang: string): string => {
  const displayNames: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    jsx: 'React JSX',
    tsx: 'React TSX',
    cpp: 'C++',
    csharp: 'C#',
    bash: 'Bash',
    shell: 'Shell',
    powershell: 'PowerShell',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    sass: 'Sass',
    json: 'JSON',
    yaml: 'YAML',
    xml: 'XML',
    sql: 'SQL',
  }
  
  return displayNames[lang.toLowerCase()] || lang.charAt(0).toUpperCase() + lang.slice(1)
}

export const CodeBlock = ({ 
  code, 
  language = 'text', 
  filename,
  showLineNumbers = true,
  className = '' 
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const languageColor = languageColors[language.toLowerCase()] || '#6B7280'
  const displayName = filename || getLanguageDisplayName(language)

  // Custom style with theme customization
  const customStyle = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: '#0F172A',
      border: `1px solid ${languageColor}20`,
      borderRadius: '0.75rem',
      margin: 0,
      padding: '1rem',
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: 'transparent',
      fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: '0.875rem',
      lineHeight: '1.5',
    }
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Header with language info and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 rounded-t-lg border border-slate-700 border-b-0">
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: languageColor, boxShadow: `0 0 8px ${languageColor}40` }}
          />
          <span className="text-sm font-medium text-slate-200">
            {displayName}
          </span>
        </div>
        
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center space-x-2 px-3 py-1.5 text-xs bg-slate-700/70 hover:bg-slate-600 
                   text-slate-300 hover:text-white rounded-md transition-all duration-200 
                   opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={customStyle}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 0.75rem 0.75rem',
            background: '#0F172A',
            border: `1px solid ${languageColor}30`,
            borderTop: 'none',
            fontSize: '0.875rem',
          }}
          lineNumberStyle={{
            minWidth: '3rem',
            paddingRight: '1rem',
            paddingLeft: '0.5rem',
            color: '#64748B',
            borderRight: `1px solid ${languageColor}20`,
            marginRight: '1rem',
            textAlign: 'right',
            userSelect: 'none',
            fontSize: '0.75rem',
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

export default CodeBlock
