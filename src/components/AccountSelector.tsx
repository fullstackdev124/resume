import React from 'react'

type Props = {
  accounts: string[]
  value: string
  onChange: (v: string) => void
}

export default function AccountSelector({ accounts, value, onChange }: Props) {
  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border rounded w-full"
      >
        {accounts.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </div>
  )
}
