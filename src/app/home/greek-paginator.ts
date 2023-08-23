import {Injectable} from "@angular/core";
import {MatPaginatorIntl} from "@angular/material/paginator";

@Injectable()
export class GreekPaginator extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Εγγραφές ανα σελίδα';
  override nextPageLabel = 'Επόμενη σελίδα';
  override previousPageLabel = 'Προηγούμενη σελίδα';
  override firstPageLabel = 'Πρώτη σελίδα';
  override lastPageLabel = 'Τελευταία σελίδα';
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 από ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} από ${length}`;
  };
}
