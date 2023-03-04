type Props = {
  tip: string
  left?: boolean
  right?: boolean
  top?: boolean
}

const TipTag = ({ tip, left, right, top }: Props) => {
  const parentClasses = []
  const childClasses = []

  if (!left && !right) {
    parentClasses.push('insex-x-auto')
    childClasses.push('mx-auto')
  } else if (left) {
    parentClasses.push('left-0')
    childClasses.push('mr-auto ml-1.5')
  } else if (right) {
    parentClasses.push('right-0')
    childClasses.push('ml-auto mr-1.5')
  }

  return (
    <div
      className={`absolute z-20 flex flex-col pt-1 animate-fade-in ${
        top ? 'bottom-full flex-col-reverse' : 'top-full'
      } ${parentClasses.join(' ')}`}
    >
      <div
        className={`text-black text-opacity-80 h-3 dark:text-gray-800 ${childClasses.join(' ')}`}
      >
        <svg viewBox="0 0 100 50" width="100" height="50" className="w-auto h-3">
          <polygon fill="currentColor" points={top ? '0,0 100,0 50,50' : '50,0 100,50 0,50'} />
        </svg>
      </div>
      <div className="bg-black bg-opacity-80 text-white text-sm rounded px-3 py-1 shadow-lg dark:bg-slate-800">
        {tip}
      </div>
    </div>
  )
}

export default TipTag
