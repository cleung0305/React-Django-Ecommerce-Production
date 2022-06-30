import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { usePaginate, DOTS } from '../hooks/usePaginate'

function BSPaginate({page, pages, keyword='', siblingCount=1, isAdmin=false}) {

    const paginateRange = usePaginate({page:page, pages:pages})
    console.log(paginateRange)

    if(keyword){
        keyword = keyword.split('?keyword=')[1].split('&')[0]
    }
    
    return ( pages > 1 && (
        <Pagination>
            <LinkContainer key='first' to={`/?keyword=${keyword}&page=1`}>
                <Pagination.First disabled={page === 1} />
            </LinkContainer>

            <LinkContainer key='prev' to={`/?keyword=${keyword}&page=${page - 1}`}>
                <Pagination.Prev disabled={page === 1} />
            </LinkContainer>

            {[...Array(pages).keys()].map((x) => (
                <LinkContainer key={x + 1} to={`/?keyword=${keyword}&page=${x + 1}`}>
                    <Pagination.Item active={x + 1 === page}>
                        {x + 1}
                    </Pagination.Item>
                </LinkContainer>
            ))}

            <LinkContainer key='next' to={`/?keyword=${keyword}&page=${page + 1}`}>
                <Pagination.Next disabled={page === pages} />
            </LinkContainer>

            <LinkContainer key='last' to={`/?keyword=${keyword}&page=${pages}`}>
                <Pagination.Last disabled={page === pages}/>
            </LinkContainer>
        </Pagination>
    )
    )
}

export default BSPaginate
