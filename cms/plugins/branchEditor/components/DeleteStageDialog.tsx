import React from 'react'
import { Box, Card, Text, Flex, Button, Dialog, Badge } from '@sanity/ui'
import { TrashIcon } from '@sanity/icons/Trash'
import { WarningOutlineIcon } from '@sanity/icons/WarningOutline'

interface DeleteStageDialogProps {
  isOpen: boolean
  onClose: () => void
  stage: any
  allStages?: any[]
  isDeleting: boolean
  onConfirm: () => void
}

export function DeleteStageDialog({
  isOpen,
  onClose,
  stage,
  allStages = [],
  isDeleting,
  onConfirm,
}: DeleteStageDialogProps) {
  if (!isOpen || !stage) return null

  // Count incoming connections to this stage
  const incomingConnectionsCount = allStages.reduce((count, s) => {
    if (s._key === stage._key || !s.replies) return count
    const connections = s.replies.filter((r: any) => r.nextStage === stage._key)
    return count + connections.length
  }, 0)

  const outgoingConnectionsCount = stage.replies?.filter((r: any) => Boolean(r.nextStage)).length || 0

  return (
    <Dialog
      id="delete-stage-dialog"
      header="Hapus Stage Node"
      onClose={onClose}
      zOffset={1001}
      width={1}
    >
      <Box padding={5} style={{ background: '#020617', color: '#f8fafc' }}>
        <Flex direction="column" gap={4}>
          {/* Warning Banner */}
          <Card
            padding={4}
            radius={3}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <Flex gap={3} align="flex-start">
              <Box style={{ color: '#ef4444', marginTop: '2px' }}>
                <WarningOutlineIcon style={{ fontSize: '20px' }} />
              </Box>
              <Flex direction="column" gap={1}>
                <Text weight="bold" size={1} style={{ color: '#fca5a5' }}>
                  Konfirmasi Penghapusan Babak
                </Text>
                <Text size={1} style={{ color: '#cbd5e1', lineHeight: '1.5' }}>
                  Apakah Anda yakin ingin menghapus node ini? Seluruh relasi cabang yang terhubung ke node ini akan otomatis dilepas.
                </Text>
              </Flex>
            </Flex>
          </Card>

          {/* Node Summary Card */}
          <Card
            padding={4}
            radius={3}
            style={{ background: '#0f172a', border: '1px solid #1e293b' }}
          >
            <Flex direction="column" gap={3}>
              <Flex align="center" justify="space-between" gap={2}>
                <Text weight="bold" size={2} style={{ color: '#ffffff' }}>
                  {stage.title || 'Untitled Stage'}
                </Text>
                {stage.speaker && (
                  <Badge tone="primary" style={{ flexShrink: 0 }}>
                    {stage.speaker}
                  </Badge>
                )}
              </Flex>

              {stage.botPrompt && (
                <Text size={1} style={{ color: '#94a3b8', fontStyle: 'italic', lineHeight: '1.4' }}>
                  "{stage.botPrompt.length > 120 ? `${stage.botPrompt.substring(0, 120)}...` : stage.botPrompt}"
                </Text>
              )}

              {/* Connections Impact */}
              <Flex gap={3} style={{ marginTop: '4px' }}>
                <Box
                  padding={2}
                  style={{
                    background: '#1e293b',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    flex: 1,
                  }}
                >
                  <Text size={0} style={{ color: '#94a3b8' }}>
                    Sambungan Masuk
                  </Text>
                  <Text weight="bold" size={1} style={{ color: incomingConnectionsCount > 0 ? '#f87171' : '#cbd5e1', marginTop: '2px' }}>
                    {incomingConnectionsCount} cabang
                  </Text>
                </Box>

                <Box
                  padding={2}
                  style={{
                    background: '#1e293b',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    flex: 1,
                  }}
                >
                  <Text size={0} style={{ color: '#94a3b8' }}>
                    Sambungan Keluar
                  </Text>
                  <Text weight="bold" size={1} style={{ color: '#cbd5e1', marginTop: '2px' }}>
                    {outgoingConnectionsCount} cabang
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Card>

          {/* Action Buttons */}
          <Flex justify="flex-end" gap={2} style={{ marginTop: '8px' }}>
            <Button
              text="Batal"
              mode="ghost"
              onClick={onClose}
              disabled={isDeleting}
              style={{ color: '#94a3b8' }}
            />
            <Button
              text={isDeleting ? 'Menghapus...' : 'Hapus Babak'}
              icon={TrashIcon}
              tone="critical"
              onClick={onConfirm}
              disabled={isDeleting}
            />
          </Flex>
        </Flex>
      </Box>
    </Dialog>
  )
}
