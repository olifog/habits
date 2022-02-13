import { IEmojiData } from 'emoji-picker-react'
import { useState, useEffect, useRef } from 'react'

export const EmojiDisplay = ({ emoji, update }: {emoji: string, update: (updates: {}) => void}) => {
  const [open, setOpen] = useState(false)
  const [chosenEmoji, setChosenEmoji] = useState(emoji)
  const [EmojiPicker, setEmojiPicker] = useState<any>(() => (<></>))
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

  useEffect(() => {
    (window as any).global = window
    import('emoji-picker-react').then((_module) => {
      setEmojiPicker(_module.default)
    })
  }, [])

  const onEmojiClick = async (event: React.MouseEvent<Element, MouseEvent>, emojiObject: IEmojiData) => {
    setChosenEmoji(emojiObject.emoji)
    await update({ emoji: emojiObject.emoji })
  }

  const DisplayEmojiPicker = EmojiPicker.default // weird workaround, double default?

  return (
    <div className='relative'>
      <div className="text-lg inline-block ml-8 cursor-pointer" ref={displayRef} onClick={() => { setOpen(!open) }}>
        {chosenEmoji}
      </div>
      {open && (
        <div className='absolute' ref={wrapperRef}>
          <DisplayEmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  )
}
