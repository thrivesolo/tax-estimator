"use client"

import { useEffect, useRef } from "react"
import { formatCurrency } from "@/lib/utils"

interface AnimatedNumberProps {
  value: number
  duration?: number
  isCurrency?: boolean
  className?: string
}

export function AnimatedNumber({ 
  value, 
  duration = 1000, 
  isCurrency = true,
  className = "" 
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const previousValue = useRef(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const start = previousValue.current
    const end = value
    const change = end - start
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = start + change * easeOutQuart
      
      if (element) {
        element.textContent = isCurrency ? formatCurrency(current) : current.toFixed(0)
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        previousValue.current = end
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration, isCurrency])

  return (
    <span ref={ref} className={className}>
      {isCurrency ? formatCurrency(0) : "0"}
    </span>
  )
}