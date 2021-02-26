import React from 'react'
import ContentLoader from "react-content-loader"
import './loading.scss'

export const CardLoader = (props) => (
  <ContentLoader
    height={105}
    speed={1}
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="250" height="28" />
    <rect x="25" y="40" rx="0" ry="0" width="200" height="18" />
    <rect x="25" y="65" rx="0" ry="0" width="200" height="18" />
    <rect x="25" y="90" rx="0" ry="0" width="80" height="15" />
    <rect x="145" y="90" rx="0" ry="0" width="80" height="15" />
  </ContentLoader>
)
export const ScalingCardLoader = () => (
  <ContentLoader
    speed={1}
  >
    <rect x="0" y="10" rx="0" ry="0" width="250" height="28" />
    <rect x="0" y="50" rx="0" ry="0" width="250" height="28" />
    <rect x="0" y="90" rx="0" ry="0" width="250" height="28" />
    <rect x="60" y="130" rx="0" ry="0" width="130" height="25" />
  </ContentLoader>
)
export const StatisticsCardLoader = () => (
  <ContentLoader
    speed={1}
    height={40}
  >

    <rect x="15" y="0" rx="3" ry="3" width="40" height="10" />
    <rect x="70" y="0" rx="3" ry="3" width="50" height="10" />
    <rect x="130" y="0" rx="3" ry="3" width="50" height="10" />
    <rect x="190" y="0" rx="3" ry="3" width="50" height="10" />

    <rect x="15" y="20" rx="3" ry="3" width="40" height="10" />
    <rect x="70" y="20" rx="3" ry="3" width="50" height="10" />
    <rect x="130" y="20" rx="3" ry="3" width="50" height="10" />
    <rect x="190" y="20" rx="3" ry="3" width="50" height="10" />


  </ContentLoader>
)
export const PreviewLoader = ({ loading }) => {

  if (!loading)
    return null

  return (
    <div className=" loading-info ">
      <div className="mv" >
        <img className="loading-img"
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMzAiIGhlaWdodD0iMTMwIiB2aWV3Qm94PSIwIDAgMTMwIDEzMCI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTY1IDEyN0MzMC43NTggMTI3IDMgOTkuMjQxIDMgNjVTMzAuNzU4IDMgNjUgM1YwQzI5LjEwMiAwIDAgMjkuMTAyIDAgNjVzMjkuMTAyIDY1IDY1IDY1di0zeiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI5Ny41IiB5MT0iMTMwIiB4Mj0iOTcuNSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIuODQxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik02NSAxMjdjMzQuMjQyIDAgNjItMjcuNzU5IDYyLTYyUzk5LjI0MiAzIDY1IDNWMGMzNS44OTggMCA2NSAyOS4xMDIgNjUgNjVzLTI5LjEwMiA2NS02NSA2NXYtM3oiLz48Y2lyY2xlIGZpbGw9IiNGRkYiIGN4PSI2NSIgY3k9IjEuNSIgcj0iMS41Ii8+PC9zdmc+"
          alt=""
        />
        <div id="progress-fase" ></div>
        <div id="progress-value" />
      </div>
    </div>
  )
}

