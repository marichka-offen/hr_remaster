import { useEffect, useState } from 'react'

export const useScrollLock = () => {
    const [isLocked, setIsLocked] = useState(false)

    useEffect(() => {

        if (isLocked) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [isLocked])

    return {
        isLocked,
        lock: () => setIsLocked(true),
        unlock: () => setIsLocked(false)
    }
}