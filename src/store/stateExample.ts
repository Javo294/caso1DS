import { useCoachActions, useCoachState } from '@/store/hooks';

export const CoachSearchComponent: React.FC = () => {
  const { searchCoaches, setFilters } = useCoachActions();
  const { searchResults, loading, error, filters } = useCoachState();

  const handleSearch = (query: string) => {
    searchCoaches(query, filters);
  };

  return (
    <div>
      <SearchInput onSearch={handleSearch} />
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      <CoachList coaches={searchResults} />
    </div>
  );
};
