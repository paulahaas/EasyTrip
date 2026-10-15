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
  const { data, loading: destLoading, search } = useDestination()
  const {
    data: semanticData,
    loading: semanticLoading,
    error: semanticError,
    search: semanticSearch,
    clear: clearSemantic,
  } = useSemanticSearch()
  const { history, add, clear } = useSearchHistory()
  const { items: recs } = useRecommendations()

  function handleSearch(query: string) {
    add(query)
    clearSemantic()
    semanticSearch(query)
  }

  function handleSelectFromSemantic(countryName: string) {
    search(countryName)
    clearSemantic()
  }

  const isLoading = semanticLoading || destLoading

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

          <SearchHistory history={history} onSelect={handleSearch} onClear={clear} />
          <RecommendationsStrip items={recs} onSelect={handleSearch} />

          {isLoading && <DestinationSkeleton />}

          {semanticError && (
            <Alert
              className="border-0 mb-4"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171',
              }}
            >
              <AlertDescription className="text-sm">{semanticError}</AlertDescription>
            </Alert>
          )}

          {semanticData && !isLoading && (
            <SemanticSearchResults
              items={semanticData}
              onSelect={handleSelectFromSemantic}
            />
          )}

          {data && !isLoading && <DestinationCard data={data} />}
        </div>
      </div>
    </>
  )
}
