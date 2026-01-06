import React, { useState } from 'react'

type Props = {
  resumeText: string
  editable?: boolean
  onChange?: (text: string) => void
}

export default function ResumeViewer({ resumeText, editable = false, onChange }: Props) {
  const [value, setValue] = useState(resumeText)

  // keep value in sync when resumeText prop changes
  React.useEffect(() => setValue(resumeText), [resumeText])

  // propagate changes immediately

  return (
    <div>
      <div>
        <h3 className="text-2xl font-bold">Existing Resume</h3>
      </div>

      {editable ? (
        <div className="mt-2">
          <textarea
            className="w-full p-3 border rounded min-h-72 text-base"
            value={value}
            onChange={(e) => { setValue(e.target.value); onChange?.(e.target.value); }}
          />
        </div>
      ) : (
        <div className="mt-2 p-6 border rounded bg-white text-base whitespace-pre-wrap min-h-64">
          {resumeText || 'No resume selected.'}
        </div>
      )}
    </div>
  )
}
