import React, {useState} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import classnames from 'classnames'

import '../pagination.css'
import Loader from '../components/Loader'
import { usePaginate, DOTS } from '../hooks/usePaginate'

function Paginate({page, pages, keyword='', siblingCount=1, isAdmin=false}) {

    const paginateRange = usePaginate({page:page, pages:pages})
    if(keyword){
        keyword = keyword.split('?keyword=')[1].split('&')[0]
    }

    return ( !paginateRange ? <Loader /> :
        <ul className={classnames('pagination-container pagination-bar')}>
            {/* Left Arrow */}
            <LinkContainer key="prev" to={!isAdmin ? `/?keyword=${keyword}&page=${page - 1}` : `/admin/all-products/?keyword=${keyword}&page=${page - 1}`}>
                <li className={classnames('pagination-item', {disabled: page === 1})}>
                    <i className="fa-solid fa-chevron-left"></i>
                </li>
            </LinkContainer>

            {/* Page Numbers & Dots  */}
            { paginateRange.map(pageNumber => {
                if(pageNumber === DOTS){
                    return <li className="pagination-item dots">&#8230;</li>
                }

                return (
                    <LinkContainer key={pageNumber} to={!isAdmin ? `/?keyword=${keyword}&page=${pageNumber}` : `/admin/all-products/?keyword=${keyword}&page=${pageNumber}`}>
                        <li className={classnames('pagination-item', {selected: pageNumber === page})}>
                            { pageNumber }
                        </li>
                    </LinkContainer>
                )
            })}

            {/* Right Arrow  */}
            <LinkContainer key="next" to={!isAdmin ? `/?keyword=${keyword}&page=${page - 1}` : `/admin/all-products/?keyword=${keyword}&page=${page + 1}`}>
                <li className={classnames('pagination-item', {disabled: page === pages})}>
                    <i className="fa-solid fa-chevron-right"></i>
                </li>
            </LinkContainer>
        </ul>
    )
}

export default Paginate
