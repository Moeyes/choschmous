/**
 * Component Utilities
 * Shared utilities for React components
 */

import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'

/**
 * Icon size utilities
 */
export const iconSizes = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
} as const

export type IconSize = keyof typeof iconSizes

/**
 * Button size utilities
 */
export const buttonSizes = {
  xs: 'h-7 px-2 text-xs',
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-4',
  lg: 'h-10 px-6',
  xl: 'h-11 px-8 text-lg',
} as const

export type ButtonSize = keyof typeof buttonSizes

/**
 * Spacing utilities
 */
export const spacing = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
} as const

/**
 * Clone element with additional props
 */
export function cloneWithProps<P = any>(
  element: ReactElement<P>,
  props: Partial<P>
): ReactElement<P> {
  return cloneElement(element, props)
}

/**
 * Render function or ReactNode
 */
export function renderProp<T>(
  prop: ReactNode | ((data: T) => ReactNode),
  data: T
): ReactNode {
  return typeof prop === 'function' ? prop(data) : prop
}

/**
 * Check if children is empty
 */
export function isEmptyChildren(children: ReactNode): boolean {
  if (!children) return true
  if (Array.isArray(children)) return children.length === 0
  return false
}

/**
 * Map children safely
 */
export function mapChildren(
  children: ReactNode,
  callback: (child: ReactNode, index: number) => ReactNode
): ReactNode[] {
  const result: ReactNode[] = []
  let index = 0
  
  if (Array.isArray(children)) {
    children.forEach(child => {
      if (isValidElement(child)) {
        result.push(callback(child, index++))
      }
    })
  } else if (isValidElement(children)) {
    result.push(callback(children, index))
  }
  
  return result
}

/**
 * Conditional wrapper component
 */
export function ConditionalWrapper({
  condition,
  wrapper,
  children,
}: {
  condition: boolean
  wrapper: (children: ReactNode) => ReactNode
  children: ReactNode
}) {
  return condition ? <>{wrapper(children)}</> : <>{children}</>
}

/**
 * Extract display name from component
 */
export function getDisplayName(Component: any): string {
  return Component.displayName || Component.name || 'Component'
}
