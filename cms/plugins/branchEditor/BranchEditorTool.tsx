import React, {useState, useEffect, useCallback, useMemo} from 'react'
import {useClient} from 'sanity'
import {Box, Card, Stack, Text, Flex, Select, Spinner, Button} from '@sanity/ui'
import {AddIcon} from '@sanity/icons/Add'
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import {StageNode} from './components/StageNode'
import {AddScenarioDialog} from './components/AddScenarioDialog'
import {EditStageDialog} from './components/EditStageDialog'
import {ManageDiagnosesDialog} from './components/ManageDiagnosesDialog'
import {DeleteStageDialog} from './components/DeleteStageDialog'

function BranchEditorToolContent() {
  const {screenToFlowPosition, getViewport} = useReactFlow()
  const client = useClient({apiVersion: '2024-01-01'})
  const [scenarios, setScenarios] = useState<any[]>([])
  const [selectedScenarioId, setSelectedScenarioId] = useState('')
  const [scenario, setScenario] = useState<any>(null)

  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Global Data
  const [valueTypes, setValueTypes] = useState<any[]>([])
  const [allDiagnoses, setAllDiagnoses] = useState<any[]>([])

  // Modal States
  const [isAddScenarioOpen, setIsAddScenarioOpen] = useState(false)
  const [newScenarioData, setNewScenarioData] = useState({
    title: '',
    batchId: '',
    mainQuest: '',
    initialTension: 0,
    maxTension: 5,
    maxTensionDialogue: 'Cukup! Sikap Anda benar-benar keterlaluan. Pertemuan ini saya batalkan!'
  })
  const [batches, setBatches] = useState<any[]>([])
  const [isCreating, setIsCreating] = useState(false)

  const [isEditStageOpen, setIsEditStageOpen] = useState(false)
  const [editingStage, setEditingStage] = useState<any>(null)
  const [stageToDelete, setStageToDelete] = useState<any>(null)

  const [isManageDiagnosesOpen, setIsManageDiagnosesOpen] = useState(false)

  const nodeTypes = useMemo(() => ({stage: StageNode}), [])

  // Fetch global data on mount
  useEffect(() => {
    client
      .fetch(`*[_type == "scenario" && !(_id in path("drafts.**"))]{ _id, title }`)
      .then((res) => {
        setScenarios(res)
        if (res.length > 0) setSelectedScenarioId(res[0]._id)
      })
    client.fetch(`*[_type == "valueType"]{ _id, title }`).then((res) => setValueTypes(res))
    client
      .fetch(
        `*[_type == "diagnosis" && !(_id in path("drafts.**"))]{ _id, title, headline, conditionType }`,
      )
      .then((res) => setAllDiagnoses(res))
  }, [client])

  const handleDeleteStageRef = React.useRef<(key: string) => void>(() => {})
  const handleDisconnectReplyRef = React.useRef<(stageKey: string, replyKey: string) => void>(() => {})

  // Helper to sync local state to React Flow graph safely without losing node positions
  const rebuildGraph = useCallback((currentScenario: any, currentNodes: any[]) => {
    if (!currentScenario || !currentScenario.stages) {
      setNodes([])
      setEdges([])
      return
    }

    const tensionRanges: Record<string, { min: number; max: number }> = {}
    currentScenario.stages.forEach((s: any) => {
      tensionRanges[s._key] = { min: Infinity, max: -Infinity }
    })
    
    const startStage = currentScenario.stages[0]
    if (startStage) {
      const dfs = (stageKey: string, currentTension: number, path: Set<string>) => {
        if (!tensionRanges[stageKey]) return
        
        if (currentTension < tensionRanges[stageKey].min) tensionRanges[stageKey].min = currentTension
        if (currentTension > tensionRanges[stageKey].max) tensionRanges[stageKey].max = currentTension
        
        path.add(stageKey)
        const stage = currentScenario.stages.find((s: any) => s._key === stageKey)
        if (stage && stage.replies) {
          stage.replies.forEach((reply: any) => {
            if (reply.nextStage && !path.has(reply.nextStage)) {
              const effect = reply.tensionEffect || 0
              dfs(reply.nextStage, currentTension + effect, new Set(path))
            }
          })
        }
      }
      dfs(startStage._key, currentScenario.initialTension || 0, new Set())
    }

    const newNodes = currentScenario.stages.map((stage: any, i: number) => {
      const existingNode = currentNodes.find((n) => n.id === stage._key)
      const startX = typeof stage.x === 'number' ? stage.x : i * 450 + 50
      const startY = typeof stage.y === 'number' ? stage.y : 50

      return {
        id: stage._key,
        type: 'stage',
        position: existingNode ? existingNode.position : { x: startX, y: startY },
        data: {
          id: stage._key,
          title: stage.title,
          prompt: stage.botPrompt,
          speaker: stage.speaker,
          phaseType: stage.phaseType,
          isMaxTensionTarget: stage._key === currentScenario.maxTensionTargetStage,
          maxTension: currentScenario.maxTension || 5,
          tensionRange: tensionRanges[stage._key],
          replies: stage.replies || [],
          onDelete: (key: string) => handleDeleteStageRef.current(key),
          onDisconnectReply: (stageKey: string, replyKey: string) =>
            handleDisconnectReplyRef.current(stageKey, replyKey),
        },
      }
    })

    const newEdges: any[] = []
    currentScenario.stages.forEach((stage: any) => {
      if (stage.replies) {
        stage.replies.forEach((reply: any) => {
          if (reply.nextStage) {
            const tEffect = reply.tensionEffect || 0
            newEdges.push({
              id: `${stage._key}-${reply._key}-${reply.nextStage}-t${tEffect}`,
              source: stage._key,
              sourceHandle: reply._key,
              target: reply.nextStage,
              animated: true,
              label: tEffect !== 0 ? `${tEffect > 0 ? '+' : ''}${tEffect} Tension` : undefined,
              labelStyle: { fill: tEffect > 0 ? '#fca5a5' : '#6ee7b7', fontWeight: 'bold', fontSize: 11 },
              labelBgStyle: { fill: '#0f172a', stroke: tEffect > 0 ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)', strokeWidth: 1 },
              labelBgPadding: [6, 4],
              labelBgBorderRadius: 4,
              style: {
                stroke: tEffect > 0 ? '#ef4444' : tEffect < 0 ? '#10b981' : '#3b82f6',
                strokeWidth: 2,
                cursor: 'pointer',
              },
            })
          }
        })
      }
    })
    setNodes(newNodes)
    setEdges(newEdges)
  }, [])

  // Fetch selected scenario
  useEffect(() => {
    if (selectedScenarioId) {
      setLoading(true)
      client
        .fetch(`*[_type == "scenario" && _id == $id][0]`, {id: selectedScenarioId})
        .then((res) => {
          setScenario(res)
          rebuildGraph(res, nodes)
          setLoading(false)
        })
    }
  }, [selectedScenarioId, client]) // nodes explicitly omitted to prevent loops, safely managed via rebuildGraph

  // Load batches only when dialog opens
  useEffect(() => {
    if (isAddScenarioOpen && batches.length === 0) {
      client
        .fetch(`*[_type == "batch" && !(_id in path("drafts.**"))]{ _id, title }`)
        .then((res) => {
          setBatches(res)
          if (res.length > 0) {
            setNewScenarioData((prev) => ({...prev, batchId: prev.batchId || res[0]._id}))
          }
        })
    }
  }, [isAddScenarioOpen, batches, client])

  const handleCreateScenario = async () => {
    if (!newScenarioData.title || !newScenarioData.batchId) return
    setIsCreating(true)
    try {
      const slug = newScenarioData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      const newDoc = {
        _type: 'scenario',
        title: newScenarioData.title,
        slug: {_type: 'slug', current: slug},
        batch: {_type: 'reference', _ref: newScenarioData.batchId},
        mainQuest: newScenarioData.mainQuest,
        initialTension: newScenarioData.initialTension,
        maxTension: newScenarioData.maxTension,
        maxTensionDialogue: newScenarioData.maxTensionDialogue,
        stages: [
          {
            _key: `stage-${Date.now()}`,
            _type: 'stage',
            title: 'Start',
            botPrompt: 'Welcome to this new scenario.',
            replies: [],
          },
        ],
      }
      const created = await client.create(newDoc)
      setScenarios((prev) => [...prev, created])
      setSelectedScenarioId(created._id)
      setIsAddScenarioOpen(false)
      setNewScenarioData({
        title: '',
        batchId: '',
        mainQuest: '',
        initialTension: 0,
        maxTension: 5,
        maxTensionDialogue: 'Cukup! Sikap Anda benar-benar keterlaluan. Pertemuan ini saya batalkan!'
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsCreating(false)
    }
  }

  const handleAddStage = async () => {
    if (!scenario) return

    let posX = 100
    let posY = 100

    try {
      const reactFlowEl = document.querySelector('.react-flow')
      if (reactFlowEl && screenToFlowPosition) {
        const bounds = reactFlowEl.getBoundingClientRect()
        const centerScreenX = bounds.left + bounds.width / 2
        const centerScreenY = bounds.top + bounds.height / 2
        const flowPos = screenToFlowPosition({ x: centerScreenX, y: centerScreenY })
        posX = Math.round(flowPos.x - 190)
        posY = Math.round(flowPos.y - 100)
      } else if (getViewport) {
        const vp = getViewport()
        const zoom = vp.zoom || 1
        posX = Math.round((window.innerWidth / 2 - vp.x) / zoom - 190)
        posY = Math.round((window.innerHeight / 2 - vp.y) / zoom - 100)
      }
    } catch (err) {
      console.warn('Could not calculate viewport center for new stage', err)
    }

    const newStage = {
      _key: `stage-${Date.now()}`,
      _type: 'stage',
      title: 'New Stage',
      botPrompt: '',
      replies: [],
      x: posX,
      y: posY,
    }
    try {
      await client
        .patch(scenario._id)
        .setIfMissing({stages: []})
        .insert('after', 'stages[-1]', [newStage])
        .commit()
      const updatedScenario = {...scenario, stages: [...(scenario.stages || []), newStage]}
      setScenario(updatedScenario)
      rebuildGraph(updatedScenario, nodes)
    } catch (err) {
      console.error('Failed to add stage', err)
    }
  }



  const handleSaveStage = async () => {
    if (!editingStage || !scenario) return
    setIsCreating(true)
    try {
      const stageIndex = scenario.stages.findIndex((s: any) => s._key === editingStage._key)
      if (stageIndex === -1) return

      await client
        .patch(scenario._id)
        .set({[`stages[${stageIndex}]`]: editingStage})
        .commit()

      const updatedScenario = {...scenario, stages: [...scenario.stages]}
      updatedScenario.stages[stageIndex] = editingStage
      setScenario(updatedScenario)
      rebuildGraph(updatedScenario, nodes)
      setIsEditStageOpen(false)
    } catch (err) {
      console.error('Failed to save stage', err)
    } finally {
      setIsCreating(false)
    }
  }

  const requestDeleteStage = useCallback(
    (stageKey: string) => {
      if (!scenario || !stageKey) return
      const stage = scenario.stages?.find((s: any) => s._key === stageKey)
      if (stage) {
        setStageToDelete(stage)
      }
    },
    [scenario]
  )

  const handleConfirmDeleteStage = useCallback(async () => {
    if (!scenario || !stageToDelete) return
    const stageKey = stageToDelete._key
    setIsCreating(true)
    try {
      const remainingStages = (scenario.stages || [])
        .filter((s: any) => s._key !== stageKey)
        .map((s: any) => {
          if (!s.replies) return s
          const cleanedReplies = s.replies.map((r: any) => {
            if (r.nextStage === stageKey) {
              const { nextStage, ...rest } = r
              return rest
            }
            return r
          })
          return { ...s, replies: cleanedReplies }
        })

      await client
        .patch(scenario._id)
        .set({ stages: remainingStages })
        .commit()

      const updatedScenario = { ...scenario, stages: remainingStages }
      setScenario(updatedScenario)
      rebuildGraph(updatedScenario, nodes)
      setStageToDelete(null)
      setIsEditStageOpen(false)
    } catch (err) {
      console.error('Failed to delete stage', err)
    } finally {
      setIsCreating(false)
    }
  }, [client, scenario, stageToDelete, nodes, rebuildGraph])

  handleDeleteStageRef.current = requestDeleteStage

  const onEdgesDelete = useCallback(
    async (deletedEdges: any[]) => {
      if (!scenario || !deletedEdges || deletedEdges.length === 0) return
      const updatedStages = (scenario.stages || []).map((stage: any) => {
        if (!stage.replies) return stage
        const updatedReplies = stage.replies.map((reply: any) => {
          const isDeleted = deletedEdges.some(
            (e) => e.source === stage._key && e.sourceHandle === reply._key
          )
          if (isDeleted) {
            const { nextStage, ...rest } = reply
            return rest
          }
          return reply
        })
        return { ...stage, replies: updatedReplies }
      })

      try {
        await client
          .patch(scenario._id)
          .set({ stages: updatedStages })
          .commit()

        const updatedScenario = { ...scenario, stages: updatedStages }
        setScenario(updatedScenario)
      } catch (err) {
        console.error('Failed to delete edge connection', err)
      }
    },
    [client, scenario]
  )

  const handleDisconnectReply = useCallback(
    async (stageKey: string, replyKey: string) => {
      if (!scenario) return
      const updatedStages = (scenario.stages || []).map((stage: any) => {
        if (stage._key !== stageKey || !stage.replies) return stage
        const updatedReplies = stage.replies.map((reply: any) => {
          if (reply._key === replyKey) {
            const { nextStage, ...rest } = reply
            return rest
          }
          return reply
        })
        return { ...stage, replies: updatedReplies }
      })

      try {
        await client
          .patch(scenario._id)
          .set({ stages: updatedStages })
          .commit()

        const updatedScenario = { ...scenario, stages: updatedStages }
        setScenario(updatedScenario)
        rebuildGraph(updatedScenario, nodes)
      } catch (err) {
        console.error('Failed to disconnect reply', err)
      }
    },
    [client, scenario, nodes, rebuildGraph]
  )

  handleDisconnectReplyRef.current = handleDisconnectReply

  const onEdgeClick = useCallback(
    async (_event: React.MouseEvent, edge: any) => {
      const sourceStage = scenario?.stages?.find((s: any) => s._key === edge.source)
      const targetStage = scenario?.stages?.find((s: any) => s._key === edge.target)
      const reply = sourceStage?.replies?.find((r: any) => r._key === edge.sourceHandle)
      const replyText = reply?.text ? `"${reply.text.substring(0, 30)}..."` : 'pilihan ini'
      const targetTitle = targetStage?.title || 'tujuan'

      if (window.confirm(`Putuskan sambungan koneksi dari ${replyText} menuju "${targetTitle}"?`)) {
        await onEdgesDelete([edge])
      }
    },
    [scenario, onEdgesDelete]
  )

  const handleSaveDiagnoses = async (selectedIds: string[]) => {
    if (!scenario) return
    setIsCreating(true)
    try {
      const newDiagnoses = selectedIds.map((id) => ({
        _key: `diag-${id}`,
        _type: 'reference',
        _ref: id,
      }))
      await client.patch(scenario._id).set({diagnoses: newDiagnoses}).commit()
      setScenario({...scenario, diagnoses: newDiagnoses})
      setIsManageDiagnosesOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsCreating(false)
    }
  }

  const onNodesChange = useCallback(
    (changes: any) => {
      const removeChanges = changes.filter((c: any) => c.type === 'remove')
      if (removeChanges.length > 0 && scenario) {
        const stage = scenario.stages?.find((s: any) => s._key === removeChanges[0].id)
        if (stage) {
          setStageToDelete(stage)
        }
        const safeChanges = changes.filter((c: any) => c.type !== 'remove')
        setNodes((nds) => applyNodeChanges(safeChanges, nds))
        return
      }
      setNodes((nds) => applyNodeChanges(changes, nds))
    },
    [scenario]
  )
  const onEdgesChange = useCallback((changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)), [])

  const onNodeDragStop = useCallback(
    async (_event: any, node: any) => {
      if (!scenario) return
      const stageIndex = scenario.stages.findIndex((s: any) => s._key === node.id)
      if (stageIndex === -1) return
      
      // Update local scenario state first so it doesn't snap back on rebuild
      const updatedScenario = { ...scenario }
      updatedScenario.stages[stageIndex] = { 
        ...updatedScenario.stages[stageIndex], 
        x: node.position.x, 
        y: node.position.y 
      }
      setScenario(updatedScenario)

      // Patch the document in the background silently
      client.patch(scenario._id)
        .set({
          [`stages[${stageIndex}].x`]: node.position.x,
          [`stages[${stageIndex}].y`]: node.position.y
        })
        .commit()
        .catch(err => console.error("Failed to save node position", err))
    },
    [client, scenario]
  )

  const onConnect = useCallback(
    async (params: Connection) => {
      if (!scenario || !params.source || !params.target || !params.sourceHandle) return

      const stageIndex = scenario.stages.findIndex((s: any) => s._key === params.source)
      if (stageIndex === -1) return
      const replyIndex = scenario.stages[stageIndex].replies.findIndex(
        (r: any) => r._key === params.sourceHandle,
      )
      if (replyIndex === -1) return

      // Optimistic local update to instantly recalculate and show tension colors/badges
      const updatedScenario = { ...scenario, stages: [...scenario.stages] }
      const updatedStage = { ...updatedScenario.stages[stageIndex] }
      updatedStage.replies = [...updatedStage.replies]
      updatedStage.replies[replyIndex] = { ...updatedStage.replies[replyIndex], nextStage: params.target }
      updatedScenario.stages[stageIndex] = updatedStage
      
      setScenario(updatedScenario)
      rebuildGraph(updatedScenario, nodes)

      try {
        await client
          .patch(scenario._id)
          .set({[`stages[${stageIndex}].replies[${replyIndex}].nextStage`]: params.target})
          .commit()
      } catch (err) {
        console.error('Failed to patch nextStage', err)
      }
    },
    [client, scenario, nodes, rebuildGraph],
  )

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      if (!scenario) return
      const stage = scenario.stages.find((s: any) => s._key === node.id)
      if (stage) {
        setEditingStage(JSON.parse(JSON.stringify(stage))) // Deep copy
        setIsEditStageOpen(true)
      }
    },
    [scenario],
  )

  return (
    <Flex direction="column" style={{height: '100%', width: '100%'}}>
      {/* Header Area */}
      <Card padding={4} borderBottom>
        <Flex align="center" gap={3}>
          <Text weight="bold">Branch Editor</Text>
          <Box flex={1}>
            <Select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.currentTarget.value)}
              disabled={loading || scenarios.length === 0}
            >
              {scenarios.length === 0 && <option value="">No scenarios found</option>}
              {scenarios.map((sc) => (
                <option key={sc._id} value={sc._id}>
                  {sc.title}
                </option>
              ))}
            </Select>
          </Box>
          <Button
            text="Add Scenario"
            icon={AddIcon}
            tone="primary"
            onClick={() => setIsAddScenarioOpen(true)}
          />
          {loading && <Spinner muted />}
        </Flex>
      </Card>

      {/* Canvas */}
      <Box flex={1} style={{position: 'relative', background: '#020617'}}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgesDelete={onEdgesDelete}
          onNodeDragStop={onNodeDragStop}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
          style={{ background: '#0f172a' }}
        >
          <Background color="#334155" gap={16} />
          <Controls />
          <Panel position="top-right">
            <Flex align="center" gap={3}>

              <Button
                text="New Stage Node"
                icon={AddIcon}
                tone="primary"
                onClick={handleAddStage}
              />
            </Flex>
          </Panel>
          <Panel position="bottom-left">
            <Card
              padding={4}
              radius={3}
              shadow={3}
              style={{background: '#0f172a', border: '1px solid #1e293b', minWidth: '250px'}}
            >
              <Flex direction="column" gap={3}>
                <Text weight="bold" size={1} style={{color: '#fff'}}>
                  Possible Outcomes ({scenario?.diagnoses?.length || 0})
                </Text>
                <Flex direction="column" gap={3}>
                  {scenario?.diagnoses?.map((dRef: any) => {
                    const d = allDiagnoses.find((x) => x._id === dRef._ref)
                    return d ? (
                      <Flex key={d._id} align="center" gap={2} paddingY={1}>
                        <Box
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#3b82f6',
                            flexShrink: 0,
                          }}
                        />
                        <Text size={1} style={{color: '#cbd5e1'}}>
                          {d.title}
                        </Text>
                      </Flex>
                    ) : null
                  })}
                  {(!scenario?.diagnoses || scenario.diagnoses.length === 0) && (
                    <Text size={1} style={{color: '#64748b'}}>
                      No diagnoses attached
                    </Text>
                  )}
                </Flex>
                <Button
                  text="Manage Diagnoses"
                  mode="ghost"
                  style={{marginTop: '8px', border: '1px solid #334155', color: '#94a3b8'}}
                  onClick={() => setIsManageDiagnosesOpen(true)}
                />
              </Flex>
            </Card>
          </Panel>
        </ReactFlow>
      </Box>

      {/* Modals */}
        <AddScenarioDialog
          isOpen={isAddScenarioOpen}
          onClose={() => setIsAddScenarioOpen(false)}
          newScenarioData={newScenarioData}
          setNewScenarioData={setNewScenarioData}
          batches={batches}
          isCreating={isCreating}
          onCreate={handleCreateScenario}
        />

      <EditStageDialog
        isOpen={isEditStageOpen}
        onClose={() => setIsEditStageOpen(false)}
        editingStage={editingStage}
        setEditingStage={setEditingStage}
        valueTypes={valueTypes}
        isSaving={isCreating}
        onSave={handleSaveStage}
        onDelete={() => requestDeleteStage(editingStage?._key)}
        allStages={scenario?.stages || []}
      />

      <ManageDiagnosesDialog
        isOpen={isManageDiagnosesOpen}
        onClose={() => setIsManageDiagnosesOpen(false)}
        scenario={scenario}
        allDiagnoses={allDiagnoses}
        isSaving={isCreating}
        onSave={handleSaveDiagnoses}
      />

      <DeleteStageDialog
        isOpen={Boolean(stageToDelete)}
        onClose={() => setStageToDelete(null)}
        stage={stageToDelete}
        allStages={scenario?.stages || []}
        isDeleting={isCreating}
        onConfirm={handleConfirmDeleteStage}
      />
    </Flex>
  )
}

export function BranchEditorTool() {
  return (
    <ReactFlowProvider>
      <BranchEditorToolContent />
    </ReactFlowProvider>
  )
}
