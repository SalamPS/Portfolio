import { ContentBlock, BlockType } from './ContentBlock'

export const blocksToMarkdown = (blocks: ContentBlock[]): string => {
  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return block.content + '\n\n'
        
      case 'heading':
        const level = block.metadata?.level || 1
        return '#'.repeat(level) + ' ' + block.content + '\n\n'
        
      case 'image':
        const alt = block.metadata?.alt || 'Image'
        const caption = block.metadata?.caption
        let imageMarkdown = `![${alt}](${block.content})\n`
        if (caption) {
          imageMarkdown += `*${caption}*\n`
        }
        return imageMarkdown + '\n'
        
      case 'code':
        const language = block.metadata?.language || ''
        return `\`\`\`${language}\n${block.content}\n\`\`\`\n\n`
        
      case 'quote':
        const lines = block.content.split('\n')
        const quotedLines = lines.map(line => `> ${line}`).join('\n')
        const author = block.metadata?.author
        let quoteMarkdown = quotedLines + '\n'
        if (author) {
          quoteMarkdown += `> \n> — ${author}\n`
        }
        return quoteMarkdown + '\n'
        
      case 'list':
        if (!block.metadata?.items) return '\n'
        return block.metadata.items
          .filter(item => item.trim() !== '')
          .map(item => `- ${item}`)
          .join('\n') + '\n\n'
          
      case 'numbered-list':
        if (!block.metadata?.items) return '\n'
        return block.metadata.items
          .filter(item => item.trim() !== '')
          .map((item, index) => `${index + 1}. ${item}`)
          .join('\n') + '\n\n'
          
      case 'video':
        const videoCaption = block.metadata?.caption
        let videoMarkdown = `[Video](${block.content})\n`
        if (videoCaption) {
          videoMarkdown += `*${videoCaption}*\n`
        }
        return videoMarkdown + '\n'
        
      case 'separator':
        return '---\n\n'
        
      default:
        return ''
    }
  }).join('')
}

export const markdownToBlocks = (markdown: string): ContentBlock[] => {
  const blocks: ContentBlock[] = []
  const lines = markdown.split('\n')
  let currentBlock: Partial<ContentBlock> | null = null
  let blockId = 1

  const finishCurrentBlock = () => {
    if (currentBlock && currentBlock.type && currentBlock.content !== undefined) {
      blocks.push({
        id: `block-${blockId++}`,
        type: currentBlock.type,
        content: currentBlock.content,
        metadata: currentBlock.metadata || {}
      })
    }
    currentBlock = null
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)/)
    if (headingMatch) {
      finishCurrentBlock()
      currentBlock = {
        type: 'heading',
        content: headingMatch[2],
        metadata: { level: headingMatch[1].length }
      }
      continue
    }
    
    // Code blocks
    const codeBlockMatch = line.match(/^```(\w*)/)
    if (codeBlockMatch) {
      finishCurrentBlock()
      const language = codeBlockMatch[1]
      const codeLines: string[] = []
      i++ // Skip the opening ```
      
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      
      currentBlock = {
        type: 'code',
        content: codeLines.join('\n'),
        metadata: { language }
      }
      continue
    }
    
    // Images
    const imageMatch = line.match(/^!\[(.*?)\]\((.*?)\)/)
    if (imageMatch) {
      finishCurrentBlock()
      const alt = imageMatch[1]
      const src = imageMatch[2]
      
      // Check if next line is caption (italic text)
      let caption = ''
      if (i + 1 < lines.length && lines[i + 1].match(/^\*.*\*$/)) {
        caption = lines[i + 1].replace(/^\*|\*$/g, '')
        i++ // Skip caption line
      }
      
      currentBlock = {
        type: 'image',
        content: src,
        metadata: { alt, caption }
      }
      continue
    }
    
    // Lists
    const listMatch = line.match(/^[-*+]\s+(.*)/)
    const numberedListMatch = line.match(/^\d+\.\s+(.*)/)
    
    if (listMatch || numberedListMatch) {
      const isNumbered = !!numberedListMatch
      const content = (listMatch || numberedListMatch)![1]
      
      if (currentBlock?.type === (isNumbered ? 'numbered-list' : 'list')) {
        // Continue existing list
        currentBlock.metadata!.items = [...(currentBlock.metadata!.items || []), content]
      } else {
        // Start new list
        finishCurrentBlock()
        currentBlock = {
          type: isNumbered ? 'numbered-list' : 'list',
          content: '',
          metadata: { items: [content] }
        }
      }
      continue
    }
    
    // Quotes
    if (line.startsWith('> ')) {
      const quoteContent = line.substring(2)
      
      if (currentBlock?.type === 'quote') {
        // Continue existing quote
        currentBlock.content += '\n' + quoteContent
      } else {
        // Start new quote
        finishCurrentBlock()
        currentBlock = {
          type: 'quote',
          content: quoteContent,
          metadata: {}
        }
      }
      continue
    }
    
    // Separators
    if (line.trim() === '---') {
      finishCurrentBlock()
      currentBlock = {
        type: 'separator',
        content: '',
        metadata: {}
      }
      continue
    }
    
    // Empty lines
    if (line.trim() === '') {
      if (currentBlock && currentBlock.type !== 'list' && currentBlock.type !== 'numbered-list') {
        finishCurrentBlock()
      }
      continue
    }
    
    // Regular paragraph
    if (currentBlock?.type === 'paragraph') {
      currentBlock.content += '\n' + line
    } else {
      finishCurrentBlock()
      currentBlock = {
        type: 'paragraph',
        content: line,
        metadata: {}
      }
    }
  }
  
  finishCurrentBlock()
  
  // If no blocks, add empty paragraph
  if (blocks.length === 0) {
    blocks.push({
      id: 'block-1',
      type: 'paragraph',
      content: '',
      metadata: {}
    })
  }
  
  return blocks
}

export const generateBlockId = (): string => {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const createEmptyBlock = (type: BlockType): ContentBlock => {
  const id = generateBlockId()
  
  switch (type) {
    case 'heading':
      return { id, type, content: '', metadata: { level: 1 } }
    case 'list':
    case 'numbered-list':
      return { id, type, content: '', metadata: { items: [''] } }
    case 'code':
      return { id, type, content: '', metadata: { language: '' } }
    case 'image':
      return { id, type, content: '', metadata: { alt: '', caption: '' } }
    case 'video':
      return { id, type, content: '', metadata: { caption: '' } }
    case 'quote':
      return { id, type, content: '', metadata: { author: '' } }
    default:
      return { id, type, content: '', metadata: {} }
  }
}
