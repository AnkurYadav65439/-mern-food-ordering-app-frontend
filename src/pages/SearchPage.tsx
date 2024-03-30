import { useSearchRestaurants } from "@/api/RestaurantApi";
import CuisineFilter from "@/components/CuisineFilter";
import PaginationSelector from "@/components/PaginationSelector";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import SearchResultCard from "@/components/SearchResultCard";
import SearchResultInfo from "@/components/SearchResultInfo";
import SortOptionDropdown from "@/components/SortOptionDropdown";
import { Restaurant } from "@/types/types";
import { useState } from "react";
import { useParams } from "react-router-dom"

export type searchState = {
    searchQuery: string;
    page: number;
    selectedCuisines: string[];
    sortOption: string;
}

const SearchPage = () => {
    const { city } = useParams();
    const [searchState, setSearchState] = useState<searchState>({
        searchQuery: "",
        page: 1,
        selectedCuisines: [],
        sortOption: "bestMatch"
    });

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const { results, isLoading } = useSearchRestaurants(searchState, city);

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (!city || !results?.data) {
        return <span>No results found</span>
    }

    //or searchForm 
    const setSearchQuery = (searchFormData: SearchForm) => {
        setSearchState((prevState) => ({
            ...prevState,
            searchQuery: searchFormData.searchQuery,
            page: 1,
        }));
    }

    const resetSearch = () => {
        setSearchState((prevState) => ({
            ...prevState,
            searchQuery: "",
            page: 1
        }))
    }

    const setPage = (page: number) => {
        setSearchState((prevState) => ({
            ...prevState,
            page
        }));
    }

    const setSortOption = (sortOption: string) => {
        setSearchState((prevState) => ({
            ...prevState,
            sortOption,
            page: 1
        }));
    }

    const setSelectedCuisines = (selectedCuisines: string[]) => {
        setSearchState((prevState) => ({
            ...prevState,
            selectedCuisines,
            page: 1
        }))
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
            <div id="cuisines-list">
                <CuisineFilter onChange={setSelectedCuisines} selectedCuisines={searchState.selectedCuisines} isExpanded={isExpanded} onExpandedClick={() => setIsExpanded((prevState) => !prevState)} />
            </div>
            <div id="main-content" className="flex flex-col gap-5">
                <SearchBar searchQuery={searchState.searchQuery} placeHolder="Search by cuisine or restaurant name" onSubmit={setSearchQuery} onReset={resetSearch} />
                <div className="flex flex-col lg:flex-row lg:justify-between">
                    <SearchResultInfo total={results.pagination.total} city={city} />
                    <SortOptionDropdown onChange={(value) => setSortOption(value)} sortOption={searchState.sortOption} />
                </div>
                {results.data.map((restaurant: Restaurant) => (
                    <SearchResultCard restaurant={restaurant} />
                ))}
                <PaginationSelector page={results.pagination.page} pages={results.pagination.pages} onPageChange={setPage} />
                {/* or page=searchState.page */}
            </div>
        </div>
    )
}

export default SearchPage