export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">Welcome to Capix AI Chatbot!</h1>
        <p className="leading-normal text-muted-foreground">
          I’m here to help you analyze your Excel spreadsheets. To get started,
          please upload a spreadsheet file. You can ask me questions about
          specific tables or the entire sheet. Let's dive into your data
          together!
        </p>
      </div>
    </div>
  )
}
