import { Badge, Progress } from '@chakra-ui/react'
import { UserCollection } from '@pages/api/v3'
import { DEFAULT_RARITY, RARITY_CONFIG } from '@utils/marketplace-rarity-maps'

type Props = {
  rarity: UserCollection
  onBack: () => void
  onShowMissing: (rarity: string, subType?: string) => void
}

const SubRarityCollection = ({ rarity, onBack, onShowMissing }: Props) => {
  const cfg = RARITY_CONFIG[rarity.card_rarity] ?? DEFAULT_RARITY

  const pct =
    rarity.total_count > 0 ? (rarity.owned_count / rarity.total_count) * 100 : 0

  const isComplete =
    rarity.owned_count === rarity.total_count && rarity.total_count > 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back to collection overview"
          className="text-sm font-semibold px-3 py-1.5 border rounded-md hover:bg-primary transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          <span className="font-bold uppercase text-lg">
            {rarity.card_rarity}
          </span>

          {isComplete && (
            <span className="text-xs text-green-400 font-bold">✓ Complete</span>
          )}
        </div>

        <Badge className="ml-auto">#{rarity.rarity_rank} Global</Badge>
      </div>

      <div
        className="rounded-lg p-4 transition-colors border-l-4 bg-primary"
        style={{
          borderColor: isComplete ? '#22c55e' : `${cfg.accent}`,
        }}
      >
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-secondaryText">
            {rarity.owned_count} / {rarity.total_count}
          </span>

          <span className="font-semibold">{Math.round(pct)}%</span>
        </div>

        <Progress
          value={pct}
          size="sm"
          borderRadius="md"
          sx={{
            '& > div': {
              background: isComplete ? '#22c55e' : cfg.accent,
            },
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rarity.subTypes.map((sub) => {
          const subPct =
            sub.owned_count > 0 ? (sub.owned_count / sub.total_count) * 100 : 0

          const subComplete =
            sub.owned_count === sub.total_count && sub.total_count > 0

          return (
            <div
              key={sub.sub_type}
              className="rounded-lg p-4 transition-colors border-l-4 bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              style={{ borderColor: subComplete ? '#22c55e' : cfg.accent }}
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold truncate">
                  {sub.sub_type}
                  {subComplete && (
                    <span className="ml-1 text-green-400">✓</span>
                  )}
                </span>

                <span className="text-xs text-secondaryText">
                  {sub.rarity_rank > 0 ? `#${sub.rarity_rank}` : 'N/A'}
                </span>
              </div>

              <div className="flex justify-between text-xs mb-1.5 text-secondaryText">
                <span>
                  {sub.owned_count > 0 ? sub.owned_count : 0} /{' '}
                  {sub.total_count}
                </span>

                <span>{Math.round(subPct)}%</span>
              </div>

              <Progress
                value={subPct}
                size="xs"
                borderRadius="md"
                sx={{
                  '& > div': {
                    background: subComplete ? '#22c55e' : cfg.accent,
                  },
                }}
              />
              {!subComplete && (
                <button
                  onClick={() =>
                    onShowMissing(rarity.card_rarity, sub.sub_type)
                  }
                  className="text-xs mt-2 text-blue600 hover:underline block"
                >
                  Show missing →
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SubRarityCollection
