import React from 'react'
import { Box, Card, Stack, Text, Flex } from '@sanity/ui'
import { Handle, Position } from '@xyflow/react'

export function StageNode({ data }: any) {
  return (
    <Card padding={4} radius={3} shadow={3} style={{ width: 380, background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b', cursor: 'pointer' }}>
      <Handle type="target" position={Position.Left} style={{ background: '#3b82f6', border: 'none', width: 12, height: 12, left: -6 }} />
      <Stack space={4}>
        <Flex align="center" justify="space-between">
          <Text weight="bold" size={2} style={{ color: '#fff' }}>{data.title}</Text>
          <Box style={{ background: '#1e293b', padding: '6px 10px', borderRadius: '6px' }}>
            <Text size={1} style={{ color: '#94a3b8' }}>Edit Stage ↗</Text>
          </Box>
        </Flex>
        <Box paddingY={3}>
          <Text size={1} style={{ color: '#cbd5e1', lineHeight: '1.5' }}>
            {data.prompt ? data.prompt.substring(0, 80) + (data.prompt.length > 80 ? '...' : '') : 'No prompt set'}
          </Text>
        </Box>
        <Stack space={3}>
          {data.replies?.map((reply: any, i: number) => (
            <Card key={reply._key || i} padding={3} radius={2} style={{ border: '1px solid #334155', position: 'relative', background: '#1e293b' }}>
              <Text size={1} style={{ color: '#e2e8f0' }}>{reply.text || '(Empty Reply)'}</Text>
              <Handle 
                type="source" 
                position={Position.Right} 
                id={reply._key}
                style={{ top: '50%', right: '-6px', background: '#3b82f6', border: 'none', width: 12, height: 12 }}
              />
            </Card>
          ))}
          {(!data.replies || data.replies.length === 0) && (
            <Box padding={3} style={{ border: '1px dashed #334155', borderRadius: '6px', textAlign: 'center' }}>
              <Text size={0} style={{ color: '#64748b' }}>Click to add replies</Text>
            </Box>
          )}
        </Stack>
      </Stack>
    </Card>
  )
}
