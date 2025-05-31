import { apiRoutes } from "@/api/apiRoutes";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import ContactsToolbar from "./components/ContactsToolbar";
import ContactsGrid from "./components/ContactsGrid";
import ContactsPagination from "./components/ContactsPagination";

export default function Contacts() {
  const { request, loading } = useApi();
  const [contactsData, setContactsData] = useState({
    records: [],
    page: 1,
    pageSize: 12,
    totalPages: 1,
    totalRecords: 0,
  });

  const [searchParams, setSearchParams] = useState({
    search: "",
    search_by: "name",
    sort: "createdAt",
    fav: "all",
  });

  const getContacts = async (
    page = 1,
    pageSize = 12,
    params = searchParams,
  ) => {
    const urlParams = new URLSearchParams();
    urlParams.set("page", page.toString());
    urlParams.set("page_size", pageSize.toString());
    if (params.search) urlParams.set("search", params.search);
    if (params.search_by) urlParams.set("search_by", params.search_by);
    if (params.sort) urlParams.set("sort", params.sort);
    if (params.fav) urlParams.set("fav", params.fav);

    const response = await request({
      url: apiRoutes.user.contacts.getAll,
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

  useEffect(() => {
    getContacts(1, contactsData.pageSize, searchParams);
  }, [searchParams]);

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

  const handleFavoriteFilter = (fav) => {
    setSearchParams((prev) => ({
      ...prev,
      fav,
    }));
  };

  const handlePageChange = (page) => {
    getContacts(page, contactsData.pageSize, searchParams);
  };
  const handlePageSizeChange = (pageSize) => {
    getContacts(1, pageSize, searchParams);
    setContactsData({ ...contactsData, pageSize });
  };

  const onAction = (action = "general") => {
    if (action === "fav") return;
    getContacts(1, contactsData.pageSize);
  };

  return (
    <div className="pb-4 pt-2 space-y-6 relative">
      <ContactsToolbar
        onSearch={handleSearch}
        onSearchBy={handleSearchBy}
        onSort={handleSort}
        onFavoriteFilter={handleFavoriteFilter}
        search={searchParams.search}
        searchBy={searchParams.search_by}
        sort={searchParams.sort}
        filter={searchParams.fav}
        onAction={onAction}
      />
      <ContactsGrid
        contacts={contactsData.records}
        loading={loading}
        onAction={onAction}
      />
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
