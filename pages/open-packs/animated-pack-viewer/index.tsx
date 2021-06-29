import React, { useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import useStyles from './index.styles'

const to = (i) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rotation: -10 + Math.random() * 20,
  delay: i * 100,
})

const from = (i) => ({
  x: 0,
  y: -1000,
  scale: 1.5,
  rotation: 0,
})

const translate = (rotationAmount, scale) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    rotationAmount / 10
  }deg) rotateZ(${rotationAmount}deg) scale(${scale})`

const AnimatedPackViewer = ({ cards }) => {
  const classes = useStyles()
  const [gone] = useState(() => new Set())
  const [props, set] = useSprings(cards.length, (i) => ({
    ...to(i),
    from: from(i),
  }))

  const bind = useGesture(
    // @ts-ignore
    ({
      args: [index],
      down,
      delta: [xDelta],
      distance,
      direction: [xDir],
      velocity,
    }) => {
      const trigger = velocity > 0.00001
      const dir = xDir < 0 ? -1 : 1
      if (!down && trigger) {
        gone.add(index)
      }

      set((i) => {
        if (index !== i) {
          return
        }

        const isGone = gone.has(index)
        const x = isGone ? (100 + window.innerWidth) * dir : down ? xDelta : 0
        const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0)
        const scale = down ? 1.1 : 1
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        }
      })
      if (!down && gone.size === cards.length) {
        // @ts-ignore
        setTimeout(() => gone.clear() || set((i) => to(i)), 600)
      }
    }
  )
  return (
    <div className={null}>
      <div className={null}>
        {props.map(({ x, y, rotation, scale }, i) => (
          <animated.div
            className={null}
            key={i}
            style={{
              transform: interpolate(
                [x, y],
                (x, y) => `translate3d(${x}px,${y}px,0)`
              ),
            }}
          >
            <animated.div
              className={null}
              {...bind(i)}
              style={{
                transform: interpolate([rotation, scale], translate),
                backgroundImage: `url(${cards[i].imagUrl})`,
              }}
            />
          </animated.div>
        ))}
      </div>
    </div>
  )
}

export default AnimatedPackViewer
