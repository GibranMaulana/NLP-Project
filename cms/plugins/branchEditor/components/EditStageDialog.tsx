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
  onDelete?: () => void
  allStages?: any[]
}

export function EditStageDialog({
  isOpen, onClose, editingStage, setEditingStage, valueTypes, isSaving, onSave, onDelete, allStages
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
        <Flex direction="column" gap={5}>
          <Flex gap={4} paddingY={2}>
            <Box flex={1}>
              <Box paddingBottom={3}>
                <Label style={{ color: '#94a3b8' }}>Stage Title</Label>
              </Box>
              <TextInput 
                padding={4}
                value={editingStage.title || ''} 
                onChange={e => setEditingStage({...editingStage, title: e.currentTarget.value})} 
                placeholder="Stage title"
                style={{ background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }}
              />
            </Box>
            <Box flex={1}>
              <Box paddingBottom={3}>
                <Label style={{ color: '#94a3b8' }}>Speaker (NPC)</Label>
              </Box>
              <TextInput 
                padding={4}
                value={editingStage.speaker || ''} 
                onChange={e => setEditingStage({...editingStage, speaker: e.currentTarget.value})} 
                placeholder="NPC Name"
                style={{ background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }}
              />
            </Box>
            <Box flex={1}>
              <Box paddingBottom={3}>
                <Label style={{ color: '#94a3b8' }}>Phase Type</Label>
              </Box>
              <Select 
                padding={4}
                value={editingStage.phaseType || 'Pacing'} 
                onChange={e => setEditingStage({...editingStage, phaseType: e.currentTarget.value})} 
                style={{ background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }}
              >
                <option value="Pacing">Pacing (Meredam Emosi)</option>
                <option value="Leading">Leading (Membedah Logika)</option>
              </Select>
            </Box>
          </Flex>
          <Box paddingY={2}>
            <Box paddingBottom={3}>
              <Label style={{ color: '#94a3b8' }}>
                Bot Prompt
              </Label>
            </Box>
            <TextArea 
              padding={4}
              value={editingStage.botPrompt || ''} 
              onChange={e => setEditingStage({...editingStage, botPrompt: e.currentTarget.value})} 
              rows={4} 
              placeholder="Dialog NPC..."
              style={{ background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }}
            />
          </Box>
          
          <Card padding={5} radius={3} style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
            <Flex justify="space-between" align="center" marginBottom={4}>
              <Text weight="bold" style={{ color: '#fff' }}>User Replies ({editingStage.replies?.length || 0}/3)</Text>
              <Button 
                text="Add Reply" icon={AddIcon} mode="ghost" tone="primary"
                onClick={() => {
                  const newReply = { 
                    _key: `reply-${Date.now()}`, 
                    _type: 'reply', 
                    text: '', 
                    valueType: { _type: 'reference', _ref: '' },
                    tensionEffect: 0,
                    systemFeedback: '',
                    npcReaction: ''
                  }
                  setEditingStage({...editingStage, replies: [...(editingStage.replies || []), newReply]})
                }}
                disabled={(editingStage.replies?.length || 0) >= 3}
                style={{ color: '#3b82f6', borderColor: '#1e293b' }}
              />
            </Flex>
            
            <Flex direction="column" gap={4}>
              {(!editingStage.replies || editingStage.replies.length === 0) && (
                <Text size={1} style={{ color: '#64748b' }}>No replies yet. Add one so users can progress.</Text>
              )}
              {editingStage.replies?.map((reply: any, index: number) => (
                <Card key={reply._key} padding={4} radius={2} style={{ background: '#1e293b', border: '1px solid #334155' }}>
                  <Flex direction="column" gap={4}>
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
                      <Box paddingBottom={1}>
                        <Button 
                          icon={TrashIcon} tone="critical" mode="ghost" title="Remove"
                          onClick={() => {
                            const newReplies = editingStage.replies.filter((_: any, i: number) => i !== index)
                            setEditingStage({...editingStage, replies: newReplies})
                          }}
                          style={{ border: '1px solid #334155' }}
                        />
                      </Box>
                    </Flex>

                    <Flex gap={4}>
                      <Box flex={1}>
                        <Box paddingBottom={3}>
                          <Label size={0} style={{ color: '#94a3b8' }}>Tension Effect</Label>
                        </Box>
                        <Select 
                          padding={3} value={reply.tensionEffect !== undefined ? reply.tensionEffect : 0}
                          onChange={e => {
                            const newReplies = [...editingStage.replies]
                            newReplies[index].tensionEffect = Number(e.currentTarget.value)
                            setEditingStage({...editingStage, replies: newReplies})
                          }}
                          style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                        >
                          <option value="-2">-2 (Sangat Menenangkan)</option>
                          <option value="-1">-1 (Menenangkan)</option>
                          <option value="0">0 (Netral)</option>
                          <option value="1">+1 (Memicu Emosi)</option>
                          <option value="2">+2 (Sangat Memicu Emosi)</option>
                        </Select>
                      </Box>
                      <Box flex={2}>
                        <Box paddingBottom={3}>
                          <Label size={0} style={{ color: '#94a3b8' }}>NPC Reaction</Label>
                        </Box>
                        <TextInput 
                          padding={3} value={reply.npcReaction || ''} 
                          onChange={e => {
                            const newReplies = [...editingStage.replies]
                            newReplies[index].npcReaction = e.currentTarget.value
                            setEditingStage({...editingStage, replies: newReplies})
                          }}
                          placeholder="Spontaneous reaction..."
                          style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                        />
                      </Box>
                    </Flex>

                    <Box>
                      <Box paddingBottom={3}>
                        <Label size={0} style={{ color: '#94a3b8' }}>System Feedback</Label>
                      </Box>
                      <TextArea 
                        padding={3} value={reply.systemFeedback || ''} 
                        onChange={e => {
                          const newReplies = [...editingStage.replies]
                          newReplies[index].systemFeedback = e.currentTarget.value
                          setEditingStage({...editingStage, replies: newReplies})
                        }}
                        rows={2}
                        placeholder="Insight shown to the user..."
                        style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                      />
                    </Box>

                    {/* Connection / Sambungan Alur */}
                    <Flex align="center" justify="space-between" padding={3} style={{ background: '#0f172a', borderRadius: '6px', border: '1px solid #334155' }}>
                      <Flex align="center" gap={2}>

                        <Text size={0} style={{ color: '#94a3b8' }}>Sambungan Tujuan:</Text>
                        <Text size={1} weight="bold" style={{ color: reply.nextStage ? '#60a5fa' : '#64748b' }}>
                          {reply.nextStage
                            ? (allStages?.find((s: any) => s._key === reply.nextStage)?.title || `Fase (${reply.nextStage})`)
                            : '(Belum terhubung / Akhir Babak)'}
                        </Text>
                      </Flex>
                      {reply.nextStage ? (
                        <Button
                          text="Putuskan Sambungan"
                          tone="critical"
                          mode="ghost"
                          onClick={() => {
                            const newReplies = [...editingStage.replies]
                            delete newReplies[index].nextStage
                            setEditingStage({...editingStage, replies: newReplies})
                          }}
                          style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}
                        />
                      ) : (
                        <Select
                          padding={2}
                          value=""
                          onChange={e => {
                            if (!e.currentTarget.value) return
                            const newReplies = [...editingStage.replies]
                            newReplies[index].nextStage = e.currentTarget.value
                            setEditingStage({...editingStage, replies: newReplies})
                          }}
                          style={{ background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', maxWidth: '190px' }}
                        >
                          <option value="">+ Sambungkan ke...</option>
                          {allStages
                            ?.filter((s: any) => s._key !== editingStage._key)
                            .map((s: any) => (
                              <option key={s._key} value={s._key}>
                                {s.title}
                              </option>
                            ))}
                        </Select>
                      )}
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Card>

          <Flex justify="space-between" align="center" style={{ width: '100%' }}>
            {onDelete ? (
              <Button 
                text="Hapus Babak" 
                icon={TrashIcon} 
                tone="critical" 
                mode="ghost" 
                onClick={onDelete}
                disabled={isSaving}
                style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}
              />
            ) : <Box />}
            <Flex gap={2}>
              <Button text="Batal" mode="ghost" onClick={onClose} style={{ color: '#94a3b8' }} />
              <Button text={isSaving ? "Menyimpan..." : "Simpan"} tone="primary" onClick={onSave} disabled={isSaving || !editingStage.title} />
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Dialog>
  )
}
