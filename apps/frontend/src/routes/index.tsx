import { Alert, AlertDescription } from '@/components/ui/alert'
import { AppHeader } from '@/components/AppHeader'
import { DestinationCard } from '@/components/DestinationCard'
import { DestinationSkeleton } from '@/components/DestinationSkeleton'
import { RecommendationsStrip } from '@/components/RecommendationsStrip'
import { SearchBar } from '@/components/SearchBar'
import { SearchHistory } from '@/components/SearchHistory'
import { SemanticSearchResults } from '@/components/SemanticSearchResults'
import { useDestination } from '@/hooks/useDestination'
import { useRecommendations } from '@/hooks/useRecommendations'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { useSemanticSearch } from '@/hooks/useSemanticSearch'

export function HomePage() {
  const {
    data,
    loading: destLoading,
    error: destError,
    search: openDestination,
    clear: clearDestination,
  } = useDestination()
  const {
    data: semanticData,
    loading: semanticLoading,
    error: semanticError,
    search: semanticSearch,
    clear: clearSemantic,
  } = useSemanticSearch()
  const { history, add, clear } = useSearchHistory()
  const { items: recs } = useRecommendations()

  // Texto livre ("país frio") vai para a busca semântica e não entra no
  // histórico: o histórico guarda só países que a pessoa abriu.
  function handleSearch(query: string) {
    clearDestination()
    semanticSearch(query)
  }

  /** Abre um país (nome canônico em inglês) e registra no histórico. */
  function openCountry(countryName: string) {
    clearSemantic()
    openDestination(countryName)
    add(countryName)
  }

  const isLoading = semanticLoading || destLoading
  const error = semanticError ?? destError

  return (
    <>
      {/* Ambient glow behind hero */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(79,142,247,0.07) 0%, transparent 65%)' }}
      />

      <div className="relative min-h-[calc(100vh-56px)] flex flex-col items-center px-4 sm:px-6 pt-14 pb-20">
        <div className="w-full max-w-2xl">
          <AppHeader />
          <SearchBar onSearch={handleSearch} disabled={isLoading} />

          <SearchHistory history={history} onSelect={openCountry} onClear={clear} />
          <RecommendationsStrip items={recs} onSelect={openCountry} />

          {isLoading && <DestinationSkeleton />}

          {error && !isLoading && (
            <Alert
              className="border-0 mb-4"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: 'var(--color-danger)',
              }}
            >
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {semanticData && !isLoading && (
            <SemanticSearchResults
              items={semanticData}
              onSelect={openCountry}
            />
          )}

          {data && !isLoading && <DestinationCard data={data} />}
        </div>
      </div>
    </>
  )
}
