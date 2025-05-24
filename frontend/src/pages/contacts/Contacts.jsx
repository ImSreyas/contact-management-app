import { apiRoutes } from "@/api/apiRoutes";
import { useApi } from "@/hooks/useApi";
import React, { useEffect, useState } from "react";
import ContactsToolbar from "./components/ContactsToolbar";
import ContactsGrid from "./components/ContactsGrid";
import ContactsPagination from "./components/ContactsPagination";

export default function Contacts() {
  const { request, loading } = useApi();
  const [contactsData, setContactsData] = useState({
    records: [],
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  // Search and filter state
  const [searchParams, setSearchParams] = useState({
    search: "",
    search_by: "name",
    sort: "createdAt",
  });

  // Fetch contacts
  const getContacts = async (
    page = 1,
    pageSize = 10,
    params = searchParams
  ) => {
    const urlParams = new URLSearchParams();
    urlParams.set("page", page);
    urlParams.set("page_size", pageSize);
    if (params.search) urlParams.set("search", params.search);
    if (params.search_by) urlParams.set("search_by", params.search_by);
    if (params.sort) urlParams.set("sort", params.sort);

    const response = await request({
      url: apiRoutes.user.contacts,
      searchParams: urlParams.toString(),
    });
    if (response?.success) {
      setContactsData({
        ...response.data,
        page,
        pageSize,
      });
    }
  };

  // Initial fetch and whenever search/filter/sort changes
  useEffect(() => {
    getContacts(1, contactsData.pageSize, searchParams);
    // eslint-disable-next-line
  }, [searchParams]);

  // Toolbar handlers
  const handleSearch = (search) => {
    setSearchParams((prev) => ({
      ...prev,
      search,
    }));
  };

  const handleSearchBy = (search_by) => {
    setSearchParams((prev) => ({
      ...prev,
      search_by,
    }));
  };

  const handleSort = (sort) => {
    setSearchParams((prev) => ({
      ...prev,
      sort,
    }));
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    getContacts(page, contactsData.pageSize, searchParams);
  };
  const handlePageSizeChange = (pageSize) => {
    getContacts(1, pageSize, searchParams);
  };

  return (
    <div className="pb-4 pt-2 space-y-6 relative">
      <ContactsToolbar
        onSearch={handleSearch}
        onSearchBy={handleSearchBy}
        onSort={handleSort}
        search={searchParams.search}
        searchBy={searchParams.search_by}
        sort={searchParams.sort}
      />
      <ContactsGrid contacts={contactsData.records} loading={loading} />
      <ContactsPagination
        page={contactsData.page}
        totalPages={contactsData.totalPages}
        totalRecords={contactsData.totalRecords}
        pageSize={contactsData.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
