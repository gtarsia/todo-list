import { useState, useEffect } from 'react'
import Document from './Document'
import { v4 as uuidv4 } from 'uuid';

export interface DocumentModel {
  id: string;
  name: string;
}

interface DocumentSelectorProps {
  onListChange: (s: string) => void;
}

function newDocument(name: string) {
  const id = `${name}-${uuidv4()}`
  return { name, id }
}

export default function DocumentSelector(props: DocumentSelectorProps) {
  const [docs, setDocs] = useState<DocumentModel[]>([])
  const [activeDocId, setActiveDocId] = useState<string>('')
  function activateDocument(doc: DocumentModel) {
    setActiveDocId(doc.id)
    props.onListChange(doc.id)
  }
  useEffect(() => {
    const v = localStorage.getItem('documents')
    if (v) {
      const docs: DocumentModel[] = JSON.parse(v)
      if (!Array.isArray(docs)) {
        return
      }
      setDocs(docs)
      if (docs[0]) {
        activateDocument(docs[0])
      }
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(docs))
  }, [docs])
  function createDocument() {
    const name = prompt('Write name of new document')
    if (name) {
      setDocs(docs => {
        docs = docs.slice()
        docs.unshift(newDocument(name))
        return docs
      })
    }
  }
  function renameDocument(doc: DocumentModel, name: string, i: number) {
    setDocs(docs => {
      docs = docs.slice()
      docs.splice(i, 1, { ...doc, name })
      return docs
    })
  }
  function deleteDocument(i: number) {
    setDocs(docs => {
      docs = docs.slice()
      docs.splice(i, 1)
      return docs
    })
  }
  
  return <div className="p-1">
    <div className="flex justify-center mb-2">
      <button className="
        bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600
        focus:outline-none focus:ring focus:ring-emerald-300 text-white p-2 rounded
      "
        onClick={() => createDocument()}
      >
        Create Document
      </button>
    </div>
    <div className="p-1">
      {docs.map((doc, i) => <Document
        name={doc.name}
        key={i}
        active={activeDocId === doc.id}
        onActivate={() => activateDocument(doc)}
        onNameChange={(name) => renameDocument(doc, name, i)}
      />)}
    </div>
  </div>
}
