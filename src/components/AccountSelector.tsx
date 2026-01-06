import React from 'react'

type Props = {
  accounts: string[]
  value: string
  onChange: (v: string) => void
}

export default function AccountSelector({ accounts, value, onChange }: Props) {
  return (
    <div>
      <label className="block font-medium">Select account</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 p-2 border rounded w-full"
      >
        {accounts.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </div>
  )
}
