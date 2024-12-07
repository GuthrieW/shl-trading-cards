import React, { useState, useMemo } from 'react'
import { Link } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { binders } from '@pages/api/v3'

export const TextWithTooltip: React.FC<{
  text: string
  maxLength: number
  tooltip: boolean
}> = ({ text, maxLength, tooltip }) => {
  const truncated = TruncateText(text, maxLength)
  const needsTooltip = text.length > maxLength && tooltip

  return (
    <div className="relative group">
      <span>{truncated}</span>
      {needsTooltip && (
        <div className="absolute z-10 invisible group-hover:visible border border-table bg-primary text-secondary px-2 py-1 text-xs">
          {text}
        </div>
      )}
    </div>
  )
}

const TruncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}
