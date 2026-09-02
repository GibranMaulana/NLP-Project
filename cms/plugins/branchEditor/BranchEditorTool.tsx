import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useClient } from 'sanity'
import { Box, Card, Text, Flex, Select, Spinner, Button } from '@sanity/ui'
import { AddIcon } from '@sanity/icons/Add'
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges, addEdge, Connection, Panel } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { StageNode } from './components/StageNode'
import { AddScenarioDialog } from './components/AddScenarioDialog'
import { EditStageDialog } from './components/EditStageDialog'

export function BranchEditorTool() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [scenarios, setScenarios] = useState<any[]>([])
  const [selectedScenarioId, setSelectedScenarioId] = useState('')
  const [scenario, setScenario] = useState<any>(null)
  
  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Value Types for Reply Categories
  const [valueTypes, setValueTypes] = useState<any[]>([])

  // Modal States
  const [isAddScenarioOpen, setIsAddScenarioOpen] = useState(false)
  const [newScenarioTitle, setNewScenarioTitle] = useState('')
  const [batches, setBatches] = useState<any[]>([])
  const [selectedBatchId, setSelectedBatchId] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const [isEditStageOpen, setIsEditStageOpen] = useState(false)
  const [editingStage, setEditingStage] = useState<any>(null)
  
  const nodeTypes = useMemo(() => ({ stage: StageNode }), [])

  // Fetch scenarios and value types on mount
  useEffect(() => {
    client.fetch(`*[_type == "scenario" && !(_id in path("drafts.**"))]{ _id, title }`).then(res => {
      setScenarios(res)
      if (res.length > 0) setSelectedScenarioId(res[0]._id)
    })
    client.fetch(`*[_type == "valueType"]{ _id, title }`).then(res => setValueTypes(res))
  }, [client])

  // Helper to sync local state to React Flow graph safely without losing node positions
  const rebuildGraph = useCallback((currentScenario: any, currentNodes: any[]) => {
    if (!currentScenario || !currentScenario.stages) {
      setNodes([])
      setEdges([])
      return
    }
    const newNodes = currentScenario.stages.map((stage: any, i: number) => {
      const existingNode = currentNodes.find(n => n.id === stage._key)
      return {
        id: stage._key,
        position: existingNode ? existingNode.position : { x: 300, y: i * 250 },
        type: 'stage',
        data: { title: stage.title, prompt: stage.botPrompt, replies: stage.replies || [] },
      }
    })
    
    const newEdges: any[] = []
    currentScenario.stages.forEach((stage: any) => {
      if (stage.replies) {
        stage.replies.forEach((reply: any) => {
          if (reply.nextStage) {
            newEdges.push({
              id: `${stage._key}-${reply._key}-${reply.nextStage}`,
              source: stage._key,
              sourceHandle: reply._key,
              target: reply.nextStage,
              animated: true,
              style: { stroke: '#3b82f6', strokeWidth: 2 }
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
      client.fetch(`*[_type == "scenario" && _id == $id][0]`, { id: selectedScenarioId }).then(res => {
        setScenario(res)
        rebuildGraph(res, nodes)
        setLoading(false)
      })
    }
  }, [selectedScenarioId, client]) // nodes explicitly omitted to prevent loops, safely managed via rebuildGraph

  // Load batches only when dialog opens
  useEffect(() => {
    if (isAddScenarioOpen && batches.length === 0) {
      client.fetch(`*[_type == "batch" && !(_id in path("drafts.**"))]{ _id, title }`).then(res => {
        setBatches(res)
        if (res.length > 0) setSelectedBatchId(res[0]._id)
      })
    }
  }, [isAddScenarioOpen, batches, client])

  const handleCreateScenario = async () => {
    if (!newScenarioTitle || !selectedBatchId) return
    setIsCreating(true)
    try {
      const slug = newScenarioTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      const newDoc = {
        _type: 'scenario',
        title: newScenarioTitle,
        slug: { _type: 'slug', current: slug },
        batch: { _type: 'reference', _ref: selectedBatchId },
        stages: [{
          _key: `stage-${Date.now()}`,
          _type: 'stage',
          title: 'Start',
          botPrompt: 'Welcome to this new scenario.',
          replies: []
        }]
      }
      const created = await client.create(newDoc)
      setScenarios(prev => [...prev, created])
      setSelectedScenarioId(created._id)
      setIsAddScenarioOpen(false)
      setNewScenarioTitle('')
    } catch (err) {
      console.error(err)
    } finally {
      setIsCreating(false)
    }
  }

  const handleAddStage = async () => {
    if (!scenario) return
    const newStage = {
      _key: `stage-${Date.now()}`,
      _type: 'stage',
      title: 'New Stage',
      botPrompt: '',
      replies: []
    }
    try {
      await client.patch(scenario._id).setIfMissing({ stages: [] }).insert('after', 'stages[-1]', [newStage]).commit()
      const updatedScenario = { ...scenario, stages: [...(scenario.stages || []), newStage] }
      setScenario(updatedScenario)
      rebuildGraph(updatedScenario, nodes)
    } catch (err) {
      console.error("Failed to add stage", err)
    }
  }

  const handleSaveStage = async () => {
    if (!editingStage || !scenario) return
    setIsCreating(true)
    try {
      const stageIndex = scenario.stages.findIndex((s: any) => s._key === editingStage._key)
      if (stageIndex === -1) return
      
      await client.patch(scenario._id)
        .set({ [`stages[${stageIndex}]`]: editingStage })
        .commit()
      
      const updatedScenario = { ...scenario }
      updatedScenario.stages[stageIndex] = editingStage
      setScenario(updatedScenario)
      rebuildGraph(updatedScenario, nodes)
      setIsEditStageOpen(false)
    } catch(err) {
      console.error("Failed to save stage", err)
    } finally {
      setIsCreating(false)
    }
  }

  const onNodesChange = useCallback((changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)), [])
  const onEdgesChange = useCallback((changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)), [])

  const onConnect = useCallback(
    async (params: Connection) => {
      if (!scenario || !params.source || !params.target || !params.sourceHandle) return
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } }, eds))

      const stageIndex = scenario.stages.findIndex((s: any) => s._key === params.source)
      if (stageIndex === -1) return
      const replyIndex = scenario.stages[stageIndex].replies.findIndex((r: any) => r._key === params.sourceHandle)
      if (replyIndex === -1) return

      try {
        await client.patch(scenario._id).set({ [`stages[${stageIndex}].replies[${replyIndex}].nextStage`]: params.target }).commit()
      } catch (err) {
        console.error("Failed to patch nextStage", err)
      }
    },
    [client, scenario]
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    if (!scenario) return
    const stage = scenario.stages.find((s: any) => s._key === node.id)
    if (stage) {
      setEditingStage(JSON.parse(JSON.stringify(stage))) // Deep copy
      setIsEditStageOpen(true)
    }
  }, [scenario])

  return (
    <Flex direction="column" style={{ height: '100%', width: '100%' }}>
      {/* Header Area */}
      <Card padding={4} borderBottom>
        <Flex align="center" gap={3}>
          <Text weight="bold">Branch Editor</Text>
          <Box flex={1}>
            <Select value={selectedScenarioId} onChange={e => setSelectedScenarioId(e.currentTarget.value)} disabled={loading || scenarios.length === 0}>
              {scenarios.length === 0 && <option value="">No scenarios found</option>}
              {scenarios.map(sc => <option key={sc._id} value={sc._id}>{sc.title}</option>)}
            </Select>
          </Box>
          <Button text="Add Scenario" icon={AddIcon} tone="primary" onClick={() => setIsAddScenarioOpen(true)} />
          {loading && <Spinner muted />}
        </Flex>
      </Card>

      {/* Canvas */}
      <Box flex={1} style={{ position: 'relative', background: '#020617' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          colorMode="dark"
        >
          <Background color="#334155" gap={16} />
          <Controls />
          <Panel position="top-right">
            <Button text="New Stage Node" icon={AddIcon} tone="primary" onClick={handleAddStage} shadow={2} />
          </Panel>
        </ReactFlow>
      </Box>

      {/* Modals */}
      <AddScenarioDialog 
        isOpen={isAddScenarioOpen} 
        onClose={() => setIsAddScenarioOpen(false)} 
        newScenarioTitle={newScenarioTitle}
        setNewScenarioTitle={setNewScenarioTitle}
        batches={batches}
        selectedBatchId={selectedBatchId}
        setSelectedBatchId={setSelectedBatchId}
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
      />
    </Flex>
  )
}
