export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">Welcome to Excel Sheet Analyzer!</h1>
        <p className="leading-normal text-muted-foreground">
          I’m here to assist you in analyzing your Excel spreadsheets. To get
          started, simply upload a spreadsheet file. You can ask me questions
          about specific tables or the entire sheet. I can also handle multiple
          Excel files simultaneously. Once your file is uploaded, you can select
          specific tables to focus your analysis and get detailed insights.
        </p>
      </div>
    </div>
  )
}
