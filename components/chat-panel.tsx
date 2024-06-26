import * as React from 'react'
import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconShare } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { SpinnerMessage, UserMessage } from './stocks/message'
import { FileIcon } from '@radix-ui/react-icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useStore } from '@/app/store/store'
import { set } from 'date-fns'
import { ManageDataDialog } from './manage-data-dialog'
import _ from 'lodash'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [exampleMessages, setExampleMessages] = React.useState<any[]>([])
  const inputRef = React.useRef<any>(null)

  const [files, setFiles] = React.useState<File[]>([])
  const [manageModalVisible, setManageModalVisible] = React.useState(false)
  const selectedTables = useStore(state => state.selectedTables)
  const setSelectedTables = useStore(state => state.setSelectedTables)
  const response = useStore(state => state.response)
  const setResponse = useStore(state => state.setResponse)
  const [isLoading, setIsLoading] = React.useState(false)

  // const exampleMessages = [
  //   {
  //     heading: 'What are the',
  //     subheading: 'trending memecoins today?',
  //     message: `What are the trending memecoins today?`
  //   },
  //   {
  //     heading: 'What is the price of',
  //     subheading: '$DOGE right now?',
  //     message: 'What is the price of $DOGE right now?'
  //   },
  //   {
  //     heading: 'I would like to buy',
  //     subheading: '42 $DOGE',
  //     message: `I would like to buy 42 $DOGE`
  //   },
  //   {
  //     heading: 'What are some',
  //     subheading: `recent events about $DOGE?`,
  //     message: `What are some recent events about $DOGE?`
  //   }
  // ]

  React.useEffect(() => {
    if (!files.length) {
      return setSelectedTables([])
    }
    const formData = new FormData()
    for (const file of files) {
      formData.append('files', file)
    }

    setIsLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/give_tables`, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.tables) {
          const newTables = Object.values(data.tables).flat()
          // let finalSelectedTable = newTables
          // const existingTables = Object.values(response.tables).flat()
          // for (let i = 0; i < newTables.length; i++) {
          //   const currentTable = newTables[i]
          //   const wasPresentInPreviousResponse = existingTables.some(item =>
          //     _.isEqual(item, currentTable)
          //   )
          //   const isPresentInSelectedTables = selectedTables.some(item =>
          //     _.isEqual(item, currentTable)
          //   )
          //   if (wasPresentInPreviousResponse && !isPresentInSelectedTables) {
          //     finalSelectedTable = finalSelectedTable.filter(
          //       item => !_.isEqual(item, currentTable)
          //     )
          //   }
          // }
          // setSelectedTables(finalSelectedTable)
          setSelectedTables(newTables)
          if (Object.keys(data.tables).length > 0) {
            setResponse(data)
            setManageModalVisible(true)
          }
        } else {
          setResponse({ tables: {} })
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
        alert(err?.message || err)
        setResponse({ tables: {} })
        setSelectedTables([])
        setIsLoading(false)
      })
  }, [files])

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                  index > 1 && 'hidden md:block'
                }`}
                onClick={async () => {
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  const responseMessage = await submitUserMessage(
                    example.message
                  )

                  setMessages(currentMessages => [
                    ...currentMessages,
                    responseMessage
                  ])
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>

        {messages?.length >= 2 ? (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <IconShare className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    shareChat={shareChat}
                    chat={{
                      id,
                      title,
                      messages: aiState.messages
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4 flex flex-col mb-3">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".xlsx, .xls"
            multiple
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const selectedFiles = Array.from(e.target.files || [])
              const newFiles = selectedFiles.filter(
                file => !files.some(f => f.name === file.name)
              )

              if (newFiles.length > 0) {
                setFiles([...files, ...newFiles])
              } else {
                alert('All selected files are already added')
              }
              e.target.value = ''
            }}
          />


          <ManageDataDialog
            open={manageModalVisible}
            onOpenChange={setManageModalVisible}
          />

          {Object.keys(response.tables).length > 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full bg-background p-3 flex"
                  onClick={() => setManageModalVisible(true)}
                >
                  <div className="ml-2">Manage data source</div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Control data source for optimal response! By default all tables
                are selected.
              </TooltipContent>
            </Tooltip>
          ) : null}

          <PromptForm
            input={input}
            setInput={setInput}
            onFileAddClicked={() => {
              inputRef.current?.click?.()
            }}
            isLoading={isLoading}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
