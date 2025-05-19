import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ContactsToolbar({
  onSearch,
  onSort,
  search,
  searchBy,
  sort,
}) {
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [searchByValue, setSearchByValue] = useState(searchBy || "name");
  const [sortValue, setSortValue] = useState(sort || "createdAt");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm, searchByValue);
  };

  const handleSortChange = (value) => {
    setSortValue(value);
    onSort(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-center">
      <Input
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-48"
      />
      <Select value={searchByValue} onValueChange={setSearchByValue}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Search By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="phoneNumbers">Phone</SelectItem>
          <SelectItem value="company">Company</SelectItem>
          <SelectItem value="location">Location</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">Search</Button>
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
    </form>
  );
}
