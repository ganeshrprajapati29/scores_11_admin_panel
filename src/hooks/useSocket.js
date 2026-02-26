import { useEffect, useCallback } from 'react'
import { useSocket } from '../context/SocketContext'

const useSocketEvents = (event, callback) => {
  const { socket, connected } = useSocket()

  useEffect(() => {
    if (socket && connected && event) {
      socket.on(event, callback)
      
      return () => {
        socket.off(event, callback)
      }
    }
  }, [socket, connected, event, callback])

  const emit = useCallback((...args) => {
    if (socket && connected) {
      socket.emit(event, ...args)
    }
  }, [socket, connected, event])

  return { emit, connected }
}

export default useSocketEvents
