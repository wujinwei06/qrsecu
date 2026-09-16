'use client'

import { useMemo } from 'react'

// 字符串 hash 作为伪随机种子
function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) || 1
}

// 基于种子的伪随机生成器（线性同余）
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const CELLS = 29 // 29x29 模块（Version 3 QR 码尺寸）

export default function QRCode({ value, size = 240, className = '' }) {
  const cellSize = size / CELLS

  const matrix = useMemo(() => {
    const seed = hashString(value || 'qrsecu')
    const rand = seededRandom(seed)
    // 初始化矩阵
    const m = Array.from({ length: CELLS }, () => Array(CELLS).fill(false))

    // 填充随机数据点
    for (let r = 0; r < CELLS; r++) {
      for (let c = 0; c < CELLS; c++) {
        m[r][c] = rand() > 0.5
      }
    }

    // 绘制定位方块（7x7：外框 + 中心 3x3 实心）
    const drawFinder = (startR, startC) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const onBorder = r === 0 || r === 6 || c === 0 || c === 6
          const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4
          m[startR + r][startC + c] = onBorder || inner
        }
      }
      // 定位方块周围留一圈空白（分隔符）
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const rr = startR + r
          const cc = startC + c
          if (rr < 0 || cc < 0 || rr >= CELLS || cc >= CELLS) continue
          const inFinder = r >= 0 && r <= 6 && c >= 0 && c <= 6
          if (!inFinder) m[rr][cc] = false
        }
      }
    }
    drawFinder(0, 0)
    drawFinder(0, CELLS - 7)
    drawFinder(CELLS - 7, 0)

    // 时序图案（定位方块之间的连线，第 6 行/列交替黑白）
    for (let i = 8; i < CELLS - 8; i++) {
      m[6][i] = i % 2 === 0
      m[i][6] = i % 2 === 0
    }

    return m
  }, [value])

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`block ${className}`}
      shapeRendering="crispEdges"
    >
      <rect width={size} height={size} fill="#ffffff" />
      {matrix.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#1d1d1f"
            />
          ) : null
        )
      )}
    </svg>
  )
}
