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
import { Plus, Search } from "lucide-react";
import AddContact from "./AddContact";

export default function ContactsToolbar({
  onSearch,
  onSearchBy,
  onSort,
  search,
  searchBy,
  sort,
}) {
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [searchByValue, setSearchByValue] = useState(searchBy || "name");
  const [sortValue, setSortValue] = useState(sort || "createdAt");

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        onSearch(value);
      }, 400),
    [onSearch]
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

  return (
    <div className="flex justify-between items-center gap-2">
      {/* left section  */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            className="absolute pointer-events-none"
          >
            <Search />
          </Button>
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-lg pr-40 pl-10"
          />
          <Select
            value={searchByValue}
            onValueChange={(value) => handleSearchBy(value)}
          >
            <SelectTrigger className="w-36 absolute top-0 right-0 border-none justify-end">
              <SelectValue placeholder="Search By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="phoneNumbers">Phone</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={sortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Newest</SelectItem>
            <SelectItem value="alphabetical">A-Z</SelectItem>
            <SelectItem value="location">Location</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* right section */}
      <div>
        <AddContact onContactAdded={() => null} />
      </div>
    </div>
  );
}
