import { IEmojiPickerProps } from 'emoji-picker-react'

export const useEmojiPicker = (): React.FC<IEmojiPickerProps> => {
  if (typeof window !== 'undefined') {
    return (window as any).emojiPicker
  } else {
    return function EmojiPicker () {
      return (
        <div></div>
      )
    }
  }
}
