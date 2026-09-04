import React, { useState } from 'react'
import { Box, Card, Text, Flex, Button } from '@sanity/ui'
import { TrashIcon } from '@sanity/icons/Trash'
import { Handle, Position } from '@xyflow/react'

export function StageNode({ data, id }: any) {
  const [isHovered, setIsHovered] = useState(false)
  const nodeKey = id || data?.id
  const maxTension = data?.maxTension || 5

  const hasTension = data?.tensionRange && data.tensionRange.min !== Infinity
  const minTension = data?.tensionRange?.min ?? 0
  const maxTensionReached = data?.tensionRange?.max ?? minTension

  // Node Tension Status:
  // - Max tension (e.g. 5 when max is 5): Red
  // - 50% - 99% (e.g. 2 - 4 when max is 5): Yellow
  // - 0% - 49% (e.g. 0 - 1 when max is 5): Green
  const effectiveTension = maxTensionReached
  const isMaxTensionNode = data?.isMaxTensionTarget || (hasTension && effectiveTension >= maxTension)
  const ratio = maxTension > 0 ? effectiveTension / maxTension : 0
  const isYellowTension = hasTension && !isMaxTensionNode && (ratio >= 0.4 || effectiveTension >= Math.round(maxTension * 0.5))
  const isGreenTension = hasTension && !isMaxTensionNode && !isYellowTension

  const isNaturalEnding = !data?.replies || data.replies.length === 0
  const isEndingNode = isMaxTensionNode || isNaturalEnding

  let theme = {
    accentColor: '#3b82f6',
    shadowColor: 'rgba(59, 130, 246, 0.25)',
    bgAccentColor: 'rgba(59, 130, 246, 0.15)',
    borderAccentColor: 'rgba(59, 130, 246, 0.4)',
    textAccentColor: '#93c5fd',
    badgeBg: '#0f172a',
    badgeBorder: '#334155',
    badgeText: '#94a3b8',
  }

  if (isMaxTensionNode) {
    theme = {
      accentColor: '#ef4444', // Red
      shadowColor: 'rgba(239, 68, 68, 0.35)',
      bgAccentColor: 'rgba(239, 68, 68, 0.15)',
      borderAccentColor: 'rgba(239, 68, 68, 0.4)',
      textAccentColor: '#fca5a5',
      badgeBg: 'rgba(239, 68, 68, 0.2)',
      badgeBorder: 'rgba(239, 68, 68, 0.5)',
      badgeText: '#fca5a5',
    }
  } else if (isYellowTension) {
    theme = {
      accentColor: '#eab308', // Yellow
      shadowColor: 'rgba(234, 179, 8, 0.35)',
      bgAccentColor: 'rgba(234, 179, 8, 0.15)',
      borderAccentColor: 'rgba(234, 179, 8, 0.4)',
      textAccentColor: '#fde047',
      badgeBg: 'rgba(234, 179, 8, 0.2)',
      badgeBorder: 'rgba(234, 179, 8, 0.5)',
      badgeText: '#fde047',
    }
  } else if (isGreenTension || isNaturalEnding) {
    theme = {
      accentColor: '#10b981', // Green
      shadowColor: 'rgba(16, 185, 129, 0.35)',
      bgAccentColor: 'rgba(16, 185, 129, 0.15)',
      borderAccentColor: 'rgba(16, 185, 129, 0.4)',
      textAccentColor: '#6ee7b7',
      badgeBg: 'rgba(16, 185, 129, 0.2)',
      badgeBorder: 'rgba(16, 185, 129, 0.5)',
      badgeText: '#6ee7b7',
    }
  }

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
        border: `1.5px solid ${hasTension || isEndingNode ? theme.accentColor : isHovered ? '#3b82f6' : '#1e293b'}`,
        boxShadow: hasTension || isEndingNode
          ? `0 0 16px ${theme.shadowColor}`
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
          background: theme.accentColor,
          border: '2px solid #ffffff',
          width: 13,
          height: 13,
          left: -7,
        }}
      />
      <Flex direction="column" gap={4}>
        {isEndingNode && (
          <Box style={{ background: theme.bgAccentColor, border: `1px solid ${theme.borderAccentColor}`, borderRadius: '4px', padding: '4px 8px' }}>
            <Text size={0} weight="bold" style={{ color: theme.textAccentColor }}>
              {isMaxTensionNode ? 'Titik Akhir (Max Tension Walkout)' : 'Titik Akhir (Percakapan Sukses / Berakhir)'}
            </Text>
          </Box>
        )}
        <Flex align="center" justify="space-between">
          <Text weight="bold" size={2} style={{ color: '#fff' }}>
            {data.title}
          </Text>
          <Flex align="center" gap={2}>
            {hasTension && (
              <Box paddingX={2} paddingY={1} style={{ background: theme.badgeBg, border: `1px solid ${theme.badgeBorder}`, borderRadius: '4px' }}>
                <Text size={0} weight="bold" style={{ color: theme.badgeText }}>
                  {minTension === maxTensionReached 
                    ? `Tension: ${minTension}`
                    : `Tension: ${minTension}-${maxTensionReached}`}
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
                border: isEndingNode ? `1px dashed ${theme.borderAccentColor}` : '1px dashed #334155',
                background: isEndingNode ? theme.bgAccentColor : 'transparent',
                borderRadius: '6px',
                textAlign: 'center',
              }}
            >
              <Text size={0} style={{ color: isEndingNode ? theme.textAccentColor : '#64748b' }}>
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
