import { hydrate } from 'react-dom'
import { RemixBrowser } from 'remix'

(window as any).global = window

import('emoji-picker-react').then((module: any) => {
  (window as any).emojiPicker = module.default.default
})

hydrate(<RemixBrowser />, document)
