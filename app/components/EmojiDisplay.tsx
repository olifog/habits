import { IEmojiData } from 'emoji-picker-react'
import { useState, useEffect, useRef } from 'react'
import { useEmojiPicker } from './EmojiPicker'

export const EmojiDisplay = ({ emoji, update }: {emoji: string, update: (updates: {}) => void}) => {
  const [open, setOpen] = useState(false)
  const [chosenEmoji, setChosenEmoji] = useState(emoji)
  const EmojiPicker = useEmojiPicker()
  const wrapperRef = useRef<any>(null)
  const displayRef = useRef<any>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current !== null && !wrapperRef.current.contains(event.target) && !displayRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  const onEmojiClick = (event: React.MouseEvent<Element, MouseEvent>, emojiObject: IEmojiData) => {
    setChosenEmoji(emojiObject.emoji)
    update({ emoji: emojiObject.emoji })
  }

  return (
    <div className='relative'>
      <div className="text-lg inline-block ml-8 cursor-pointer" ref={displayRef} onClick={() => { setOpen(!open) }}>
        {chosenEmoji}
      </div>
      {open && (
        <div className='absolute' ref={wrapperRef}>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  )
}
