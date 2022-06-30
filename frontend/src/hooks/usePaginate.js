import { useMemo } from 'react';

export const DOTS = '...'

const range = (start, end) => {
    let length = end - start + 1

    return Array.from({ length }, (_, idx) => idx + start)
}

export const usePaginate = ({page, pages, pageSize=4, siblingCount = 1 }) => {
    const paginateRange = useMemo(() => {
        const totalPageNumbers = siblingCount + 5 //max page numbers show on screen

        //case 1: number of pages needed < page numbers we want to display, then display all page numbers
        if (pages <= totalPageNumbers) {
            return range(1, pages)
        }

        const leftSiblingIndex = Math.max(page - siblingCount, 1)
        const rightSiblingIndex = Math.min(page + siblingCount, pages)

        const showLeftDots = leftSiblingIndex > 2
        const showRightDots = rightSiblingIndex < pages - 2

        const firstPageIndex = 1
        const lastPageIndex = pages

        //case 2: Only show right dots
        if (!showLeftDots && showRightDots){
            let leftItemCount = 3 + 2 * siblingCount
            let leftRange = range(firstPageIndex, leftItemCount)

            return [...leftRange, DOTS, pages]
        }

        //case 3: Only show left dots
        if (!showRightDots && showLeftDots){
            let rightItemCount = 3 + 2 * siblingCount
            let rightRange = range(pages - rightItemCount + 1, lastPageIndex)

            return [firstPageIndex, DOTS, ...rightRange]
        }

        //case 4: both left and right DOTS are shown
        if (showLeftDots && showRightDots){
            let middleRange = range(leftSiblingIndex, rightSiblingIndex)
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
        }

    }, [pageSize, siblingCount, page])

    return paginateRange
}