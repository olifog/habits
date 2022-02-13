import { ChangeEvent, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

export const NameDisplay = ({ name, update }: {name: string, update: (updates: {}) => void}) => {
  const [dynamicName, setDynamicName] = useState(name)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDynamicName(event.target.value)
    update({ name: event.target.value })
  }

  return (
    <TextareaAutosize
      className="overflow-hidden resize-none outline-none w-full bg-transparent"
      value={dynamicName}
      onChange={handleChange}
    />
  )
}
