import React from 'react'

function Rating({ value, text, color }) {
    return (
        <div className="rating">

            {/* Looping over 5 times, Each iteration check if it has corresponding star */}
            {[...Array(5)].map((e, i) => (
                <span>
                    <i style={{ color }} className={
                        value >= (i+1) ? 'bi bi-star-fill'
                        : value >= (i+0.5) ? 'bi bi-star-half'
                        : 'bi bi-star'
                    }>
                    </i>
                </span>
            ))}
            <span>{ text && text }</span>
        </div>
    )
}

export default Rating
