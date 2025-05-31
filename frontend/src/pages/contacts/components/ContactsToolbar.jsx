import React, { useState, useMemo } from "react";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowDownWideNarrow, Heart, Search, X } from "lucide-react";
import AddContact from "./AddContact";
import { Tooltip } from "@radix-ui/react-tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ContactsToolbar({
  onSearch,
  onSearchBy,
  onSort,
  onFavoriteFilter,
  search,
  searchBy,
  sort,
  filter,
  onAction = null,
}) {
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [searchByValue, setSearchByValue] = useState(searchBy || "name");
  const [sortValue, setSortValue] = useState(sort || "createdAt");
  const [favoriteFilterValue, setFavoriteFilterValue] = useState(
    filter || "all",
  );

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        onSearch(value);
      }, 400),
    [onSearch],
  );

  const handleSearch = (search) => {
    setSearchTerm(search);
    debouncedSearch(search);
  };

  const handleSearchBy = (value) => {
    setSearchByValue(value);
    onSearchBy(value);
  };

  const handleSortChange = (value) => {
    setSortValue(value);
    onSort(value);
  };

  const handleFavoriteFilterChange = (value) => {
    setFavoriteFilterValue(value);
    onFavoriteFilter(value);
  };

  return (
    <div className="flex items-start justify-between xl:items-center gap-2">
      {/* left section  */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            className="absolute pointer-events-none"
            size={undefined}
          >
            <Search />
          </Button>
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-lg pr-30 sm:pr-40 pl-10"
            type={undefined}
          />
          <Select
            value={searchByValue}
            onValueChange={(value) => handleSearchBy(value)}
          >
            <SelectTrigger className="w-28 sm:w-36 absolute top-0 right-0 border-none justify-end">
              <SelectValue placeholder="Search By" />
            </SelectTrigger>
            <SelectContent className={undefined}>
              <SelectItem value="name" className={undefined}>
                Name
              </SelectItem>
              <SelectItem value="phoneNumbers" className={undefined}>
                Phone
              </SelectItem>
              <SelectItem value="company" className={undefined}>
                Company
              </SelectItem>
              <SelectItem value="location" className={undefined}>
                Location
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {searchTerm && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className=""
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    handleSearch("");
                  }}
                >
                  <X />
                </Button>
              </TooltipTrigger>
              <TooltipContent className={undefined}>
                <p>Clear Search</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Sort dropdown */}
        <Select value={sortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-36">
            <div className="flex gap-2 items-center">
              <ArrowDownWideNarrow />
              <SelectValue placeholder="Sort By" />
            </div>
          </SelectTrigger>
          <SelectContent className={undefined}>
            <SelectItem value="createdAt" className={undefined}>
              Newest
            </SelectItem>
            <SelectItem value="alphabetical" className={undefined}>
              A-Z
            </SelectItem>
            <SelectItem value="location" className={undefined}>
              Location
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Favorite filter */}
        <Select
          value={favoriteFilterValue}
          onValueChange={handleFavoriteFilterChange}
        >
          <SelectTrigger className="min-w-36 w-fit">
            <div className="flex gap-2 items-center">
              <Heart />
              <SelectValue placeholder="Filter" />
            </div>
          </SelectTrigger>
          <SelectContent className={undefined}>
            <SelectItem value="all" className={undefined}>
              All
            </SelectItem>
            <SelectItem value="favorite" className={undefined}>
              Favorite
            </SelectItem>
            <SelectItem value="not-favorite" className={undefined}>
              Not Favorite
            </SelectItem>
          </SelectContent>{" "}
        </Select>
      </div>

      {/* right section */}
      <div>
        <AddContact onContactAdded={onAction} />
      </div>
    </div>
  );
}
