// import React, { useState } from 'react'
// import { useSprings, animated, to } from 'react-spring'
// import { useGesture } from 'react-use-gesture'
// import { makeStyles } from '@material-ui/core'

// const useStyles = makeStyles((theme) => ({
//   content: {
//     padding: 0,
//   },
//   packViewerContainer: {
//     boxSizing: 'border-box',
//     overscrollBehaviorY: 'contain',
//     margin: '0',
//     padding: '0',
//     height: '100%',
//     width: '100%',
//     userSelect: 'none',
//     fontFamily:
//       '-apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif',
//     position: 'fixed',
//     overflow: 'hidden',
//   },
//   packContainer: {
//     position: 'fixed',
//     overflow: 'hidden',
//     width: '100%',
//     height: '100%',
//     cursor:
//       'url(`https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/Ad1_-cursor.png`) 39 39, auto',
//     paddingTop: '40px',
//   },
//   cardContainer: {
//     position: 'absolute',
//     width: '100vw',
//     height: '100vh',
//     willChange: 'transform',
//     display: 'flex',
//     alignItems: 'flex-start',
//     justifyContent: 'center',
//   },
//   card: {
//     backgroundColor: 'white',
//     backgroundSize: 'auto 100%',
//     backgroundRepeat: 'no-repeat',
//     backgroundPosition: 'center center',
//     width: '45vh',
//     maxWidth: '300px',
//     height: '100vh',
//     maxHeight: '420px',
//     willChange: 'transform',
//     borderRadius: '2px',
//   },
// }))

// // These two are just helpers, they curate spring data, values that are later being interpolated into css
// const localTo = (i) => ({
//   x: 0,
//   y: i * -4,
//   scale: 1,
//   rot: -10 + Math.random() * 20,
//   delay: i * 100,
// })
// const from = (i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
// // This is being used down there in the view, it interpolates rotation and scale into a css transform
// const trans = (r, s) =>
//   `perspective(1500px) rotateX(30deg) rotateY(${
//     r / 10
//   }deg) rotateZ(${r}deg) scale(${s})`

// const AnimatedPackViewer = ({ cards }) => {
//   const classes = useStyles()
//   const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
//   const [props, set] = useSprings(cards.length, (i) => ({
//     ...localTo(i),
//     from: from(i),
//   })) // Create a bunch of springs using the helpers above
//   // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
//   const bind = useGesture(
//     ({
//       args: [index],
//       down,
//       delta: [xDelta],
//       distance,
//       direction: [xDir],
//       velocity,
//     }) => {
//       const trigger = velocity > 0.00001 // If you flick hard enough it should trigger the card to fly out
//       const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
//       if (!down && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
//       // @ts-ignore
//       set((i) => {
//         if (index !== i) return // We're only interested in changing spring-data for the current spring
//         const isGone = gone.has(index)
//         const x = isGone ? (100 + window.innerWidth) * dir : down ? xDelta : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
//         const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
//         const scale = down ? 1.1 : 1 // Active cards lift up a bit
//         return {
//           x,
//           rot,
//           scale,
//           delay: undefined,
//           config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
//         }
//       })
//       if (!down && gone.size === cards.length)
//         // @ts-ignore
//         setTimeout(() => gone.clear() || set((i) => localTo(i)), 600)
//     }
//   )
//   // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
//   return (
//     <div className={classes.packViewerContainer}>
//       <div className={classes.packContainer}>
//         {props.map(({ x, y, rot, scale }, i) => (
//           <animated.div
//             className={classes.cardContainer}
//             key={i}
//             style={{
//               transform: to([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
//             }}
//           >
//             {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
//             <animated.div
//               className={classes.card}
//               {...bind(i)}
//               style={{
//                 transform: to([rot, scale], trans),
//                 backgroundImage: `url(${cards[i].imageUrl})`,
//               }}
//             />
//           </animated.div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default AnimatedPackViewer

import React from 'react'

const AnimatedPackViewer = () => <h1>Placeholder</h1>

export default AnimatedPackViewer
