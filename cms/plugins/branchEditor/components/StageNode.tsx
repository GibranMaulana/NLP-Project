import React, { useState } from 'react'
import { Box, Card, Text, Flex, Button } from '@sanity/ui'
import { TrashIcon } from '@sanity/icons/Trash'
import { Handle, Position } from '@xyflow/react'

export function StageNode({ data, id }: any) {
  const [isHovered, setIsHovered] = useState(false)
  const nodeKey = id || data?.id
  const isMaxTensionNode = data?.isMaxTensionTarget || (data?.tensionRange?.min !== Infinity && data?.tensionRange?.min >= data?.maxTension)
  const isNaturalEnding = !data?.replies || data.replies.length === 0
  const isEndingNode = isMaxTensionNode || isNaturalEnding
  
  const accentColor = isMaxTensionNode ? '#ef4444' : isNaturalEnding ? '#10b981' : '#3b82f6'
  const shadowColor = isMaxTensionNode ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'
  const bgAccentColor = isMaxTensionNode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'
  const borderAccentColor = isMaxTensionNode ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'
  const textAccentColor = isMaxTensionNode ? '#fca5a5' : '#6ee7b7'

  return (
    <Card
      padding={4}
      radius={3}
      shadow={isHovered ? 4 : 3}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: 380,
        background: isHovered ? '#1e293b' : '#0f172a',
        color: '#f8fafc',
        border: isEndingNode
          ? `1.5px solid ${accentColor}`
          : isHovered
          ? '1px solid #3b82f6'
          : '1px solid #1e293b',
        boxShadow: isEndingNode
          ? `0 0 16px ${shadowColor}`
          : isHovered
          ? '0 12px 24px -4px rgba(59, 130, 246, 0.25)'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: isHovered && !isEndingNode ? '#60a5fa' : accentColor,
          border: '2px solid #ffffff',
          width: 13,
          height: 13,
          left: -7,
        }}
      />
      <Flex direction="column" gap={4}>
        {isEndingNode && (
          <Box style={{ background: bgAccentColor, border: `1px solid ${borderAccentColor}`, borderRadius: '4px', padding: '4px 8px' }}>
            <Text size={0} weight="bold" style={{ color: textAccentColor }}>
              {isMaxTensionNode ? 'Titik Akhir (Max Tension Walkout)' : 'Titik Akhir (Percakapan Sukses / Berakhir)'}
            </Text>
          </Box>
        )}
        <Flex align="center" justify="space-between">
          <Text weight="bold" size={2} style={{ color: '#fff' }}>
            {data.title}
          </Text>
          <Flex align="center" gap={2}>
            {data.tensionRange && data.tensionRange.min !== Infinity && (
              <Box paddingX={2} paddingY={1} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '4px' }}>
                <Text size={0} weight="bold" style={{ color: '#94a3b8' }}>
                  {data.tensionRange.min === data.tensionRange.max 
                    ? `Tension: ${data.tensionRange.min}`
                    : `Tension: ${data.tensionRange.min}-${data.tensionRange.max}`}
                </Text>
              </Box>
            )}
            <Box style={{ background: isHovered ? '#334155' : '#1e293b', padding: '6px 10px', borderRadius: '6px', transition: 'background 0.2s ease' }}>
              <Text size={1} style={{ color: isHovered ? '#ffffff' : '#94a3b8' }}>
                Edit Stage ↗
              </Text>
            </Box>
            {data.onDelete && (
              <Button
                icon={TrashIcon}
                tone="critical"
                mode="ghost"
                title="Hapus Babak"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  data.onDelete(nodeKey)
                }}
                style={{
                  padding: '4px 6px',
                  borderRadius: '6px',
                  opacity: isHovered ? 1 : 0.6,
                  transition: 'opacity 0.2s ease',
                }}
              />
            )}
          </Flex>
        </Flex>
        <Box paddingY={3}>
          <Text size={1} style={{ color: '#cbd5e1', lineHeight: '1.5' }}>
            {data.prompt ? data.prompt.substring(0, 80) + (data.prompt.length > 80 ? '...' : '') : 'No prompt set'}
          </Text>
        </Box>
        <Flex direction="column" gap={3}>
          {data.replies?.map((reply: any, i: number) => (
            <Card key={reply._key || i} padding={3} radius={2} style={{ border: '1px solid #334155', position: 'relative', background: '#1e293b' }}>
              <Flex align="center" justify="space-between" gap={2}>
                <Text size={1} style={{ color: '#e2e8f0', flex: 1 }}>{reply.text || '(Empty Reply)'}</Text>
                {reply.nextStage && data.onDisconnectReply && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      data.onDisconnectReply(nodeKey, reply._key)
                    }}
                    title="Putuskan Sambungan"
                    style={{
                      fontSize: '11px',
                      color: '#f87171',
                      cursor: 'pointer',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      whiteSpace: 'nowrap',
                      marginRight: '6px',
                    }}
                  >
                    Putus ✕
                  </span>
                )}
              </Flex>
              <Handle 
                type="source" 
                position={Position.Right} 
                id={reply._key}
                style={{ top: '50%', right: '-6px', background: reply.nextStage ? '#3b82f6' : '#64748b', border: 'none', width: 12, height: 12 }}
              />
            </Card>
          ))}
          {(!data.replies || data.replies.length === 0) && (
            <Box
              padding={3}
              style={{
                border: isEndingNode ? `1px dashed ${borderAccentColor}` : '1px dashed #334155',
                background: isEndingNode ? bgAccentColor : 'transparent',
                borderRadius: '6px',
                textAlign: 'center',
              }}
            >
              <Text size={0} style={{ color: isEndingNode ? textAccentColor : '#64748b' }}>
                {isMaxTensionNode
                  ? 'Tidak ada opsi (Otomatis Walkout)'
                  : 'Percakapan Terhenti di Sini'}
              </Text>
            </Box>
          )}
        </Flex>
      </Flex>
    </Card>
  )
}
