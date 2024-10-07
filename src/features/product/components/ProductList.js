import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { StarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { useSelector, useDispatch } from "react-redux";
import {
  selectTotalItems,
  selectAllProduct,
  selectBrands,
  selectCategory,
  fetchProductsByFilterAsync,
  fetchBrandsAsync,
  fetchCategoryAsync,
} from "../ProductListSlice";
import { Link } from "react-router-dom";
import { ITEM_PER_PAGE } from "../../../../src/app/constants";

export function ProductList() {
  const dispatch = useDispatch();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filter, setfilter] = useState({});
  const [sort, setsort] = useState({});
  const products = useSelector(selectAllProduct);
  const brands = useSelector(selectBrands);
  const category = useSelector(selectCategory);
  const totalItems = useSelector(selectTotalItems);
  const [boolean, setboolean] = useState([]);
  const [page, setpage] = useState(1);

  useEffect(() => {
    const pagination = { _page: page, _per_page: ITEM_PER_PAGE };
    dispatch(fetchProductsByFilterAsync({ filter, sort, pagination }));
  }, [dispatch, filter, sort, page]);

  useEffect(() => {
    setpage(1);
  }, [totalItems, sort]);

  useEffect(() => {
    dispatch(fetchBrandsAsync());
    dispatch(fetchCategoryAsync());
  }, [dispatch]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleFilterChange = (e, section, option) => {
    const newFilter = { ...filter };
    if (e.target.checked) {
      if (newFilter[section.id]) {
        newFilter[section.id].push(option.value);
      } else {
        newFilter[section.id] = [option.value];
      }
    } else {
      const index = newFilter[section.id].indexOf(option.value);
      newFilter[section.id].splice(index, 1);
    }
    setfilter(newFilter);
  };

  const handleSortChange = (e, option) => {
    const boolArr = [];
    sortOptions.forEach((o, index) => {
      if (o.current) {
        o.current = false;
        boolArr.push(o.current);
      } else if (option.name === o.name) {
        o.current = true;
        boolArr[index] = o.current;
      }
    });
    setboolean(boolArr);
    setsort(option.sort);
  };

  const handlePage = (page) => {
    setpage(page);
  };

  const sortOptions = [
    { name: "Best Rating", sort: "-rating", current: false },
    { name: "Price: Low to High", sort: "price", current: false },
    { name: "Price: High to Low", sort: "-price", current: false },
  ];

  const filters = [
    {
      id: "category",
      title: "Category",
      options: category,
    },
    {
      id: "brand",
      title: "Brand",
      options: brands,
    },
  ];

  return (
    <>
      <div className="bg-white">
        <div>
          {/* Mobile filter dialog */}
          <MobileFilter
            setMobileFiltersOpen={setMobileFiltersOpen}
            mobileFiltersOpen={mobileFiltersOpen}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
          <Layout
            sortOptions={sortOptions}
            handleFilterChange={handleFilterChange}
            handleSortChange={handleSortChange}
            filters={filters}
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
            products={products}
            boolean={boolean}
            classNames={classNames}
            totalItems={totalItems}
            page={page}
            setpage={setpage}
            handlePage={handlePage}
          />
        </div>
      </div>
    </>
  );
}

const MobileFilter = ({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  filters,
  handleFilterChange,
}) => {
  return (
    <>
      <Dialog
        open={mobileFiltersOpen}
        onClose={setMobileFiltersOpen}
        className="relative z-40 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
          >
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            {/* Filters */}
            <form className="mt-4 border-t border-gray-200">
              <h3 className="sr-only">Categories</h3>

              {filters.map((section) => (
                <Disclosure
                  key={section.id}
                  as="div"
                  className="border-t border-gray-200 px-4 py-6"
                >
                  <h3 className="-mx-2 -my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">
                        {section.title}
                      </span>
                      <span className="ml-6 flex items-center">
                        <PlusIcon
                          aria-hidden="true"
                          className="h-5 w-5 group-data-[open]:hidden"
                        />
                        <MinusIcon
                          aria-hidden="true"
                          className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                        />
                      </span>
                    </DisclosureButton>
                  </h3>
                  <DisclosurePanel className="pt-6">
                    <div className="space-y-6">
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            defaultValue={option.value}
                            defaultChecked={option.checked}
                            id={`filter-mobile-${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            onChange={(e) =>
                              handleFilterChange(e, section, option)
                            }
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                            className="ml-3 min-w-0 flex-1 text-gray-500"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              ))}
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

const DesktopFilter = ({ filters, handleFilterChange }) => {
  return (
    <>
      <form className="hidden lg:block">
        <h3 className="sr-only">Categories</h3>

        {filters.map((section) => (
          <Disclosure
            key={section.id}
            as="div"
            className="border-b border-gray-200 py-6"
          >
            <h3 className="-my-3 flow-root">
              <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">
                  {section.title}
                </span>
                <span className="ml-6 flex items-center">
                  <PlusIcon
                    aria-hidden="true"
                    className="h-5 w-5 group-data-[open]:hidden"
                  />
                  <MinusIcon
                    aria-hidden="true"
                    className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                  />
                </span>
              </DisclosureButton>
            </h3>
            <DisclosurePanel className="pt-6">
              <div className="space-y-4">
                {section.options.map((option, optionIdx) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      defaultValue={option.value}
                      defaultChecked={option.checked}
                      id={`filter-${section.id}-${optionIdx}`}
                      name={`${section.id}[]`}
                      onChange={(e) => handleFilterChange(e, section, option)}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`filter-${section.id}-${optionIdx}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </DisclosurePanel>
          </Disclosure>
        ))}
      </form>
    </>
  );
};

const Pagination = ({ page, setpage, handlePage, totalItems }) => {
  return (
    <>
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <div
            onClick={() => {
              if (page > 1) {
                handlePage(page - 1);
              }
            }}
            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
              page === 1 ? "opacity-50" : "opacity-100"
            }`}
          >
            Previous
          </div>
          <div
            onClick={() => {
              if (page < Math.ceil(totalItems / ITEM_PER_PAGE)) {
                handlePage(page + 1);
              }
            }}
            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
              page < Math.ceil(totalItems / ITEM_PER_PAGE)
                ? "opacity-100"
                : "opacity-50"
            }`}
          >
            Next
          </div>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(page - 1) * ITEM_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {page * ITEM_PER_PAGE > totalItems
                  ? totalItems
                  : page * ITEM_PER_PAGE}
              </span>{" "}
              of <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div>
            <nav
              aria-label="Pagination"
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            >
              <div
                onClick={() => {
                  if (page > 1) {
                    handlePage(page - 1);
                  }
                }}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  page === 1 ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
              </div>

              {Array.from({
                length: Math.ceil(totalItems / ITEM_PER_PAGE),
              }).map((_, i) => (
                <div
                  onClick={() => handlePage(i + 1)}
                  key={i + 1}
                  aria-current="page"
                  className={`relative z-10 inline-flex items-center ${
                    i + 1 === page
                      ? "bg-indigo-600 text-white"
                      : "text-gray-900"
                  } px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer border border-gray-300`}
                >
                  {i + 1}
                </div>
              ))}

              <div
                onClick={() => {
                  if (page < Math.ceil(totalItems / ITEM_PER_PAGE)) {
                    handlePage(page + 1);
                  }
                }}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  page < Math.ceil(totalItems / ITEM_PER_PAGE)
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                }`}
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

const ProductGrid = ({ products }) => {
  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {products.data?.map((product) => (
              <div
                key={product.id}
                className="group relative border border-gray-800 p-2 rounded-md"
              >
                <Link to={`/product-detail/${product.id}`}>
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <img
                      alt={product.imageAlt}
                      src={product.images}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="">
                      <h3 className="text-sm text-gray-700">{product.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 flex items-center gap-2">
                        <StarIcon className="h-5 w-5 aspect-square fill-yellow-500 text-yellow-500" />
                        {product.rating}
                      </p>
                    </div>
                    <div className="price">
                      <p className="text-sm font-medium text-gray-900 text-end">
                        ₹
                        {Math.round(
                          product.price * (100 - product.discountPercentage)
                        ) / 100}
                      </p>
                      <p className="text-sm font-medium text-gray-900 text-end opacity-45 line-through">
                        ₹{product.price}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const Layout = ({
  sortOptions,
  handleFilterChange,
  handleSortChange,
  filters,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  products,
  boolean,
  classNames,
  totalItems,
  page,
  setpage,
  handlePage,
}) => {
  return (
    <>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            All Products
          </h1>

          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                  />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <div className="py-1">
                  {sortOptions.map((option, index) => (
                    <MenuItem key={option.name}>
                      <p
                        onClick={(e) => handleSortChange(e, option)}
                        className={classNames(
                          boolean[index]
                            ? "font-medium text-gray-900"
                            : "text-gray-500",
                          "block px-4 py-2 text-sm data-[focus]:bg-gray-100"
                        )}
                      >
                        {option.name}
                      </p>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>

            <button
              type="button"
              className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
            >
              <span className="sr-only">View grid</span>
              <Squares2X2Icon aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
            >
              <span className="sr-only">Filters</span>
              <FunnelIcon aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pb-24 pt-6">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <DesktopFilter
              filters={filters}
              handleFilterChange={handleFilterChange}
            />

            {/* Product grid */}
            <div className="lg:col-span-3">
              {/* Your content */}
              <ProductGrid products={products} />
            </div>
          </div>
        </section>
        {/* Pagination */}
        <Pagination
          page={page}
          setpage={setpage}
          handlePage={handlePage}
          totalItems={totalItems}
        />
      </main>
    </>
  );
};
