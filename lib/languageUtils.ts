// Utility functions for extracting language from filename/extension
export const getLanguageFromFilename = (input: string): string => {
  if (!input) return 'text'
  
  // If input doesn't contain a dot, treat it as a direct language name
  if (!input.includes('.')) {
    const normalizedInput = input.toLowerCase().trim()
    
    // Direct language mappings
    const directLanguageMap: Record<string, string> = {
      'js': 'javascript',
      'javascript': 'javascript',
      'ts': 'typescript',
      'typescript': 'typescript',
      'py': 'python',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c++': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'csharp': 'csharp',
      'c#': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'ruby': 'ruby',
      'go': 'go',
      'rust': 'rust',
      'swift': 'swift',
      'dart': 'dart',
      'bash': 'bash',
      'shell': 'bash',
      'sh': 'bash',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'sql': 'sql',
      'markdown': 'markdown',
      'md': 'markdown',
    }
    
    return directLanguageMap[normalizedInput] || normalizedInput
  }
  
  // Extract extension from filename
  const extension = input.split('.').pop()?.toLowerCase()
  if (!extension) return 'text'
  
  // Language mapping from extensions
  const extensionToLanguage: Record<string, string> = {
    // JavaScript/TypeScript
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    
    // Web
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    
    // Python
    py: 'python',
    pyw: 'python',
    
    // Java/JVM
    java: 'java',
    kt: 'kotlin',
    kts: 'kotlin',
    scala: 'scala',
    groovy: 'groovy',
    
    // C/C++
    c: 'c',
    cpp: 'cpp',
    cc: 'cpp',
    cxx: 'cpp',
    h: 'c',
    hpp: 'cpp',
    
    // C#
    cs: 'csharp',
    
    // PHP
    php: 'php',
    
    // Ruby
    rb: 'ruby',
    
    // Go
    go: 'go',
    
    // Rust
    rs: 'rust',
    
    // Swift
    swift: 'swift',
    
    // Dart/Flutter
    dart: 'dart',
    
    // Shell/Bash
    sh: 'bash',
    bash: 'bash',
    zsh: 'bash',
    fish: 'bash',
    
    // PowerShell
    ps1: 'powershell',
    
    // Data formats
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    toml: 'toml',
    
    // Database
    sql: 'sql',
    
    // Config files
    conf: 'ini',
    ini: 'ini',
    cfg: 'ini',
    
    // Docker
    dockerfile: 'docker',
    
    // Markdown
    md: 'markdown',
    mdx: 'markdown',
    
    // Other
    vue: 'vue',
    svelte: 'svelte',
    lua: 'lua',
    r: 'r',
    matlab: 'matlab',
    m: 'matlab',
    
    // Assembly
    asm: 'assembly',
    s: 'assembly',
  }
  
  return extensionToLanguage[extension] || extension
}

// Get display name for language
export const getLanguageDisplayName = (lang: string): string => {
  const displayNames: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    jsx: 'React JSX',
    tsx: 'React TSX',
    cpp: 'C++',
    csharp: 'C#',
    bash: 'Bash/Shell',
    powershell: 'PowerShell',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    sass: 'Sass',
    json: 'JSON',
    yaml: 'YAML',
    xml: 'XML',
    sql: 'SQL',
    dockerfile: 'Dockerfile',
    markdown: 'Markdown',
  }
  
  return displayNames[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)
}

// Check if input looks like a filename (has extension)
export const isFilename = (input: string): boolean => {
  return input.includes('.') && !input.includes(' ') && input.length > 2
}

// Validate if it's a supported language
export const getSupportedLanguages = (): string[] => {
  return [
    'javascript', 'typescript', 'jsx', 'tsx', 'html', 'css', 'scss', 'sass',
    'python', 'java', 'kotlin', 'c', 'cpp', 'csharp', 'php', 'ruby', 'go',
    'rust', 'swift', 'dart', 'bash', 'powershell', 'json', 'xml', 'yaml',
    'sql', 'dockerfile', 'markdown', 'vue', 'svelte', 'lua', 'r', 'text'
  ]
}
