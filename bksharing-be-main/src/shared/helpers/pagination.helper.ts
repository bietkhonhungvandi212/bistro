export class QueryPagingHelper {
  static queryPaging({ pageSize, pageNumber }: { pageSize?: number; pageNumber?: number }): {
    take?: number;
    skip?: number;
  } {
    if (!pageNumber || !pageSize) return {};
    return {
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    };
  }
}
