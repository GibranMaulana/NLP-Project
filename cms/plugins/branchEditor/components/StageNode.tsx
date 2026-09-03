import React, { useState } from 'react'
import { Box, Card, Text, Flex, Button } from '@sanity/ui'
import { TrashIcon } from '@sanity/icons/Trash'
import { Handle, Position } from '@xyflow/react'

export function StageNode({ data, id }: any) {
  const [isHovered, setIsHovered] = useState(false)
  const nodeKey = id || data?.id
  const isCrisisNode = data?.phaseType === 'Crisis' || data?.isMaxTensionTarget

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
        border: isCrisisNode
          ? '1.5px solid #ef4444'
          : isHovered
          ? '1px solid #3b82f6'
          : '1px solid #1e293b',
        boxShadow: isCrisisNode
          ? '0 0 16px rgba(239, 68, 68, 0.35)'
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
          background: isCrisisNode ? '#ef4444' : isHovered ? '#60a5fa' : '#3b82f6',
          border: '2px solid #ffffff',
          width: 13,
          height: 13,
          left: -7,
        }}
      />
      <Flex direction="column" gap={4}>
        {isCrisisNode && (
          <Box style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '4px', padding: '4px 8px' }}>
            <Text size={0} weight="bold" style={{ color: '#fca5a5' }}>
              ⚡ Titik Ending Krisis (Max Tension Walkout)
            </Text>
          </Box>
        )}
        <Flex align="center" justify="space-between">
          <Text weight="bold" size={2} style={{ color: '#fff' }}>
            {data.title}
          </Text>
          <Flex align="center" gap={2}>
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
                border: isCrisisNode ? '1px dashed rgba(239, 68, 68, 0.4)' : '1px dashed #334155',
                background: isCrisisNode ? 'rgba(239, 68, 68, 0.06)' : 'transparent',
                borderRadius: '6px',
                textAlign: 'center',
              }}
            >
              <Text size={0} style={{ color: isCrisisNode ? '#fca5a5' : '#64748b' }}>
                {isCrisisNode
                  ? '🛑 Titik Akhir Obrolan (Percakapan Terhenti di Sini)'
                  : 'Click to add replies'}
              </Text>
            </Box>
          )}
        </Flex>
      </Flex>
    </Card>
  )
}
