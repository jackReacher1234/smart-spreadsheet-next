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

interface ManageDataDialogProps extends DialogProps {}

export function ManageDataDialog({ ...props }: ManageDataDialogProps) {
  const response = useStore(state => state.response)
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

        <div className="">
          {tableInfo.map(({ filename, tableNames }) => (
            <div key={filename} className="mb-4">
              <h3 className="font-bold">{filename}</h3>
              <ul className="ml-4 list-disc">
                {tableNames.map((name: any, index: number) => (
                  <li key={index}>{name || `Table ${index + 1}`}</li>
                ))}
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
