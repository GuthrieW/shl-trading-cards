import React from 'react'
import ContentLoader from 'react-content-loader'

const Loading = (props) => {
  return (
    <ContentLoader
      speed={2}
      width={400}
      height={460}
      viewBox="0 0 400 460"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <circle cx="31" cy="31" r="15" />
      <rect x="58" y="18" rx="2" ry="2" width="140" height="10" />
      <rect x="58" y="34" rx="2" ry="2" width="140" height="10" />
      <rect x="226" y="56" rx="2" ry="2" width="162" height="239" />
      <rect x="26" y="57" rx="2" ry="2" width="162" height="239" />
      <rect x="25" y="317" rx="2" ry="2" width="162" height="239" />
      <rect x="226" y="317" rx="2" ry="2" width="162" height="239" />
    </ContentLoader>
  )
}

export default Loading
