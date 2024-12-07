export default function DiscordWidget() {
  return (
    <div className="w-full h-full flex justify-center items-center relative m-4 ">
      <iframe
        src="https://discord.com/widget?id=806601618702336000&theme=dark"
        width="350"
        height="500" // @ts-ignore required otherwise you get console error
        allowtransparency="true"
        frameBorder={'0'}
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      ></iframe>
    </div>
  )
}
