import { Badge, Progress, Skeleton } from '@chakra-ui/react'
import { Fragment, useMemo, useState } from 'react'
import axios from 'axios'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { DEFAULT_RARITY, RARITY_CONFIG } from '@utils/marketplace-rarity-maps'
import SubRarityCollection from './SubRarityCollection'
import { SiteGroupedUniqueCards, UserCollection } from '@pages/api/v3'
import { rarityMap } from '@constants/rarity-map'

interface DisplayCollectionProps {
  uid: string
  onShowMissing: (rarity: string, subType?: string) => void
}

const DisplayCollection = ({ uid, onShowMissing }: DisplayCollectionProps) => {
  const [selected, setSelected] = useState<UserCollection | null>(null)

  const { payload: siteCards, isLoading: siteLoading } = query<
    SiteGroupedUniqueCards[]
  >({
    queryKey: ['unique-cards'],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/collection/unique-cards`,
      }),
  })

  const { payload: userCards, isLoading: userLoading } = query<
    UserCollection[]
  >({
    queryKey: ['user-unique-cards', uid],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/collection/collection-by-rarity?userID=${uid}`,
      }),
  })

  const combinedView = useMemo(() => {
    if (!siteCards || !userCards) return []

    const userMap = new Map<string, UserCollection>()
    for (const u of userCards) {
      userMap.set(u.card_rarity, u)
    }

    const result = siteCards.map((site) => {
      const user = userMap.get(site.card_rarity)

      const userSubMap = new Map<string, any>()
      for (const s of user?.subTypes ?? []) {
        userSubMap.set(s.sub_type, s)
      }

      const subTypes = site.subTypes.map((siteSub) => {
        const userSub = userSubMap.get(siteSub.sub_type)

        return {
          sub_type: siteSub.sub_type,
          owned_count: userSub?.owned_count,
          rarity_rank: userSub?.rarity_rank,
          total_count: siteSub.total_count ?? 0,
        }
      })

      return {
        card_rarity: site.card_rarity,
        owned_count: user?.owned_count ?? 0,
        userID: user?.userID ?? 0,
        username: user?.username ?? '',
        rarity_rank: user?.rarity_rank ?? 0,
        total_count: site.total_count,
        subTypes,
      }
    })

    const rarityByLabel = Object.values(rarityMap).reduce(
      (acc, r) => {
        acc[r.label.toLowerCase()] = r.rarity
        return acc
      },
      {} as Record<string, number>
    )

    return result.sort((a, b) => {
      const aRarity = rarityByLabel[a.card_rarity.toLowerCase()] ?? -1
      const bRarity = rarityByLabel[b.card_rarity.toLowerCase()] ?? -1
      return bRarity - aRarity
    })
  }, [siteCards, userCards])

  const userStats = useMemo(() => {
    if (!combinedView.length) return null

    return {
      totalOwned: combinedView.reduce((s, r) => s + r.owned_count, 0),
      completedSets: combinedView.filter((r) => r.owned_count === r.total_count)
        .length,
      completedSubSets: combinedView.reduce((acc, r) => {
        return (
          acc +
          r.subTypes.filter(
            (s) => s.owned_count > 0 && s.owned_count === s.total_count
          ).length
        )
      }, 0),
      top10Ranks: combinedView.filter(
        (r) => r.rarity_rank > 0 && r.rarity_rank <= 10
      ).length,
      bestRank:
        combinedView.length > 0
          ? Math.min(
              ...combinedView.map((r) => r.rarity_rank).filter((r) => r > 0)
            )
          : null,
    }
  }, [combinedView])

  if (siteLoading || userLoading) {
    return (
      <div className="p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height="80px" mb={3} />
        ))}
      </div>
    )
  }

  return (
    <div className="border border-grey800 rounded-lg overflow-hidden">
      <div className="p-4 bg-secondary">
        <div className="mb-5">
          <div className="font-bold text-3xl">Collection overview</div>
          <div className="text-sm">Updates every 12 hours</div>
        </div>

        {selected ? (
          <SubRarityCollection
            rarity={selected}
            onBack={() => setSelected(null)}
            onShowMissing={onShowMissing}
          />
        ) : (
          <Fragment>
            {userStats && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
                {[
                  { label: 'Total cards', value: userStats.totalOwned },
                  {
                    label: 'Sets completed',
                    value: userStats.completedSets,
                  },
                  {
                    label: 'Sub Sets completed',
                    value: userStats.completedSubSets,
                  },
                  { label: 'Top-10 ranks', value: userStats.top10Ranks },
                  {
                    label: 'Best rank',
                    value: userStats.bestRank ? `#${userStats.bestRank}` : '—',
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-primary rounded-lg px-3 py-2"
                  >
                    <div className="text-xs text-secondaryText mb-1">
                      {s.label}
                    </div>
                    <div className="text-2xl font-bold">{s.value}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {combinedView.map((rarity) => {
                const cfg = RARITY_CONFIG[rarity.card_rarity] ?? DEFAULT_RARITY

                const pct =
                  rarity.total_count > 0
                    ? (rarity.owned_count / rarity.total_count) * 100
                    : 0

                const isComplete = rarity.owned_count === rarity.total_count

                const hasSubTypes = rarity.subTypes.length > 0

                return (
                  <div
                    key={rarity.card_rarity}
                    role={hasSubTypes ? 'button' : undefined}
                    tabIndex={hasSubTypes ? 0 : undefined}
                    aria-label={
                      hasSubTypes
                        ? `View ${rarity.card_rarity} sub-types`
                        : undefined
                    }
                    className="rounded-lg p-4 transition-colors border-l-4 bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                    style={{
                      borderColor: isComplete ? '#22c55e' : `${cfg.accent}`,
                      cursor: hasSubTypes ? 'pointer' : 'default',
                    }}
                    onClick={() => hasSubTypes && setSelected(rarity)}
                    onKeyDown={(e) => {
                      if (hasSubTypes && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault()
                        setSelected(rarity)
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold uppercase tracking-wider">
                        {rarity.card_rarity}
                      </span>

                      <Badge>#{rarity.rarity_rank} Global</Badge>
                    </div>

                    <div className="text-3xl font-bold">
                      {rarity.owned_count}
                    </div>

                    <div className="flex items-center justify-between text-xs text-secondaryText mb-2">
                      <span>of {rarity.total_count}</span>
                      {!isComplete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onShowMissing(rarity.card_rarity)
                          }}
                          className="text-blue600 hover:underline"
                        >
                          Show missing →
                        </button>
                      )}
                    </div>

                    <Progress value={pct} size="xs" />

                    {isComplete && (
                      <div className="text-xs mt-2 text-green-400 font-bold">
                        ✓ Complete
                      </div>
                    )}

                    {hasSubTypes && (
                      <div className="text-xs mt-2 text-secondaryText">
                        {rarity.subTypes.length} sub-types ›
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default DisplayCollection
