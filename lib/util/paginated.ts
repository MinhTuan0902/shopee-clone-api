export function createPaginatedObject<T>(
  items: T[],
  totalItems: number,
  limit: number,
  offset = 0,
) {
  const hasPreviousPage = offset > 1;
  const hasNextPage = limit + offset < totalItems;

  return {
    items,
    totalItems,
    pageInfo: {
      hasPreviousPage,
      hasNextPage,
    },
  };
}
