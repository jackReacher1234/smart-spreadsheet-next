'use client'

import * as React from 'react'
import { type DialogProps } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useStore } from '@/app/store/store'
import { CheckCircledIcon, CircleIcon } from '@radix-ui/react-icons'

interface ManageDataDialogProps extends DialogProps {}

export function ManageDataDialog({ ...props }: ManageDataDialogProps) {
  const response = useStore(state => state.response)
  const selectedTables = useStore(state => state.selectedTables)
  const setSelectedTables = useStore(state => state.setSelectedTables)
  const isSelected = (table: any) =>
    selectedTables.some(selected => selected === table)

  const tableInfo = Object.entries(response.tables).map(
    ([filename, tables]) => ({
      filename,
      tableNames: (tables as any).map((table: any) => table[0][0])
    })
  )

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Data</DialogTitle>
          <DialogDescription>
            The following tables are available for use in your chatbot! Select
            the tables you want to use.
          </DialogDescription>
        </DialogHeader>

        <div className="-my-1 max-h-[60vh] overflow-scroll">
          {tableInfo.map(({ filename, tableNames }) => (
            <div key={filename} className="mb-4">
              <h3 className="font-bold mb-2">{filename}</h3>
              <ul className="ml-4 list-none">
                {tableNames.map((name: any, index: number) => {
                  const table = response.tables[filename][index]
                  const isTableSelected = isSelected(table)

                  return (
                    <li
                      key={index}
                      className={`cursor-pointer flex items-center p-2 my-1 border rounded-lg transition-colors ${isTableSelected ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-300'}
            `}
                      onClick={() => {
                        if (isTableSelected) {
                          setSelectedTables(
                            selectedTables.filter(
                              selected => selected !== table
                            )
                          )
                        } else {
                          setSelectedTables([...selectedTables, table])
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-pressed={isTableSelected}
                      aria-label={`Select ${name || `Table ${index + 1}`}`}
                    >
                      <span className="mr-2">
                        {isTableSelected ? (
                          <CheckCircledIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <CircleIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </span>
                      <span className="text-xs">
                        {name || `Table ${index + 1}`}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <DialogFooter className="items-center">
          <Button
            onClick={() => {
              props.onOpenChange?.(false)
            }}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
