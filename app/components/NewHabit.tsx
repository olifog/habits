import { Form } from 'remix'
import { IEmojiData } from 'emoji-picker-react'
import { useState } from 'react'
import { useEmojiPicker } from './EmojiPicker'

export const NewHabit = ({ setOpen }: {setOpen: (open: boolean) => void}) => {
  const [emoji, setEmoji] = useState('🧘')
  const EmojiPicker = useEmojiPicker()

  const onEmojiClick = async (event: React.MouseEvent<Element, MouseEvent>, emojiObject: IEmojiData) => {
    setEmoji(emojiObject.emoji)
  }

  return (
    <>
      <div className="absolute w-screen h-screen bg-black z-40 opacity-20" onClick={() => { setOpen(false) }} />
      <div className="absolute w-screen h-screen flex z-50 items-center justify-center pointer-events-none">
        <div className="w-sm h-[34rem] bg-white rounded-lg pointer-events-auto px-8">
          <div className="flex items-center pt-4 pb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <h1 className="w-full pl-2 font-bold text-xl">New Habit</h1>
            <svg className="justify-self-end cursor-pointer h-6 w-6" onClick={() => { setOpen(false) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <Form method="post" action="/habit/new" onSubmit={() => { setOpen(false) }}>
            <div>
              <label htmlFor="name">Habit name:</label>
              <input id="name" type="text" name="name" className="ml-4 rounded-md px-2 py-1 outline outline-1 outline-gray-500" />
            </div>
            <div className="pt-3 pb-2">
              <label htmlFor="emoji">Emoji:</label>
              <input id="emoji" type="text" name="emoji" readOnly={true} value={emoji} className="text-lg ml-4 bg-transparent outline-none cursor-default mb-2" />
            </div>
            <div className="flex justify-center">
              {
                <EmojiPicker onEmojiClick={onEmojiClick} />
              }
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <button onClick={() => { setOpen(false) }} className="w-[5rem] text-center p-2 shadow-lg rounded-lg outline outline-1 outline-gray-400/50">
                Cancel
              </button>
              <input type="submit" value="Create" className="w-[5rem] cursor-pointer p-2 text-center bg-gradient-to-br from-green-600 to-green-500 shadow-lg rounded-lg outline outline-1 outline-gray-300/50" />
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}
