import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

type Props = {
    page: number;
    pages: number;
    onPageChange: (page: number) => void;
}

const PaginationSelector = ({ page, pages, onPageChange }: Props) => {
    const pageNumbers: number[] = [];
    for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
    }

    return (
        <Pagination>
            <PaginationContent>
                {page !== 1 && (
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={() => onPageChange(page - 1)} />
                    </PaginationItem>
                )}
                {pageNumbers.map((number) => (
                    <PaginationItem>
                        <PaginationLink href="#" onClick={() => onPageChange(number)} isActive={page === number}>{number}</PaginationLink>
                    </PaginationItem>
                ))}
                {/* or pages.length */}
                {pages > 1 && page !== pages && (
                    <>
                        {/* <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem> */}
                        <PaginationItem>
                            <PaginationNext href="#" onClick={() => onPageChange(page + 1)} />
                        </PaginationItem>
                    </>
                )}
            </PaginationContent>
        </Pagination>
    )
}

export default PaginationSelector