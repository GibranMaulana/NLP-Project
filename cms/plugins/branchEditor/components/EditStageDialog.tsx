import React from 'react'
import { Box, Card, Stack, Text, Flex, Select, Button, Dialog, TextInput, Label, TextArea } from '@sanity/ui'
import { AddIcon } from '@sanity/icons/Add'
import { TrashIcon } from '@sanity/icons/Trash'

interface EditStageDialogProps {
  isOpen: boolean
  onClose: () => void
  editingStage: any
  setEditingStage: (val: any) => void
  valueTypes: any[]
  isSaving: boolean
  onSave: () => void
}

export function EditStageDialog({
  isOpen, onClose, editingStage, setEditingStage, valueTypes, isSaving, onSave
}: EditStageDialogProps) {
  if (!isOpen || !editingStage) return null

  return (
    <Dialog 
      id="edit-stage-dialog" 
      header="Edit Stage & Replies" 
      onClose={onClose} 
      zOffset={1000} 
      width={2}
    >
      <Box padding={5} style={{ background: '#020617', color: '#f8fafc' }}>
        <Stack space={5}>
          <Box paddingY={2}>
            <Box paddingBottom={3}>
              <Label style={{ color: '#94a3b8' }}>Stage Title</Label>
            </Box>
            <TextInput 
              padding={4}
              value={editingStage.title || ''} 
              onChange={e => setEditingStage({...editingStage, title: e.currentTarget.value})} 
              style={{ background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }}
            />
          </Box>
          <Box paddingY={2}>
            <Box paddingBottom={3}>
              <Label style={{ color: '#94a3b8' }}>Bot Prompt</Label>
            </Box>
            <TextArea 
              padding={4}
              value={editingStage.botPrompt || ''} 
              onChange={e => setEditingStage({...editingStage, botPrompt: e.currentTarget.value})} 
              rows={4} 
              style={{ background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }}
            />
          </Box>
          
          <Card padding={5} radius={3} style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
            <Flex justify="space-between" align="center" marginBottom={4}>
              <Text weight="bold" style={{ color: '#fff' }}>User Replies ({editingStage.replies?.length || 0}/3)</Text>
              <Button 
                text="Add Reply" icon={AddIcon} mode="ghost" tone="primary"
                onClick={() => {
                  const newReply = { _key: `reply-${Date.now()}`, _type: 'reply', text: '', valueType: { _type: 'reference', _ref: '' } }
                  setEditingStage({...editingStage, replies: [...(editingStage.replies || []), newReply]})
                }}
                disabled={(editingStage.replies?.length || 0) >= 3}
                style={{ color: '#3b82f6', borderColor: '#1e293b' }}
              />
            </Flex>
            
            <Stack space={3}>
              {(!editingStage.replies || editingStage.replies.length === 0) && (
                <Text size={1} style={{ color: '#64748b' }}>No replies yet. Add one so users can progress.</Text>
              )}
              {editingStage.replies?.map((reply: any, index: number) => (
                <Card key={reply._key} padding={4} radius={2} style={{ background: '#1e293b', border: '1px solid #334155' }}>
                  <Flex gap={4} align="flex-end">
                    <Box flex={3}>
                      <Box paddingBottom={3}>
                        <Label size={0} style={{ color: '#94a3b8' }}>Reply Text</Label>
                      </Box>
                      <TextInput 
                        padding={3} value={reply.text || ''} 
                        onChange={e => {
                          const newReplies = [...editingStage.replies]
                          newReplies[index].text = e.currentTarget.value
                          setEditingStage({...editingStage, replies: newReplies})
                        }}
                        style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                      />
                    </Box>
                    <Box flex={2}>
                      <Box paddingBottom={3}>
                        <Label size={0} style={{ color: '#94a3b8' }}>NLP Category</Label>
                      </Box>
                      <Select 
                        padding={3} value={reply.valueType?._ref || ''}
                        onChange={e => {
                          const newReplies = [...editingStage.replies]
                          newReplies[index].valueType = { _type: 'reference', _ref: e.currentTarget.value }
                          setEditingStage({...editingStage, replies: newReplies})
                        }}
                        style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                      >
                        <option value="">Select...</option>
                        {valueTypes.map(vt => <option key={vt._id} value={vt._id}>{vt.title}</option>)}
                      </Select>
                    </Box>
                    <Button 
                      icon={TrashIcon} tone="critical" mode="ghost" title="Remove"
                      onClick={() => {
                        const newReplies = editingStage.replies.filter((_: any, i: number) => i !== index)
                        setEditingStage({...editingStage, replies: newReplies})
                      }}
                      style={{ border: '1px solid #334155' }}
                    />
                  </Flex>
                </Card>
              ))}
            </Stack>
          </Card>

          <Flex justify="flex-end" gap={2}>
            <Button text="Cancel" mode="ghost" onClick={onClose} style={{ color: '#94a3b8' }} />
            <Button text={isSaving ? "Saving..." : "Save Stage"} tone="primary" onClick={onSave} disabled={isSaving || !editingStage.title} />
          </Flex>
        </Stack>
      </Box>
    </Dialog>
  )
}
