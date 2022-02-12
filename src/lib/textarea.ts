
export function getCursorPosition(textarea: HTMLTextAreaElement): number {
  const { selectionDirection, selectionStart, selectionEnd } = textarea
  if (selectionDirection === 'forward') {
    return selectionEnd
  }
  return selectionStart
}

export function isSelecting(textarea: HTMLTextAreaElement): boolean {
  const { selectionStart, selectionEnd } = textarea
  return selectionStart !== selectionEnd
}

export function canGoUp(textarea: HTMLTextAreaElement): boolean {
  const newlinePos = textarea.value.indexOf('\n')
  const cursorPos = getCursorPosition(textarea)
  return newlinePos === -1 || newlinePos >= cursorPos
}

export function canGoDown(textarea: HTMLTextAreaElement): boolean {
  const newlinePos = textarea.value.lastIndexOf('\n')
  const cursorPos = getCursorPosition(textarea)
  return newlinePos === -1 || newlinePos < cursorPos
}
