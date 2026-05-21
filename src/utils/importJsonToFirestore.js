import { collection, doc, setDoc } from 'firebase/firestore'
import db from '@/firebase/firebase-config'

export async function importJsonToFirestore(collectionName, data, documentId = null) {
  if (!collectionName) {
    throw new Error('collectionName is required')
  }

  const colRef = collection(db, collectionName)

  // 🟢 SINGLE DOCUMENT MODE
  if (!Array.isArray(data)) {
    if (!documentId) {
      throw new Error('documentId is required for single-document import')
    }

    await setDoc(doc(colRef, documentId), data)
    return { count: 1, mode: 'single' }
  }

  // 🟢 MULTI DOCUMENT MODE (ARRAY)
  let count = 0

  for (const item of data) {
    const id = item.id || item.movieId || crypto.randomUUID()
    await setDoc(doc(colRef, id), item)
    count++
  }

  return { count, mode: 'batch' }
}
