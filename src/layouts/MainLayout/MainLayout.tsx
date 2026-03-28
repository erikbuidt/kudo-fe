import React from 'react'

interface Props {
    children?: React.ReactNode
}
function MainLayout(props: Props) {
    return (
        <div>
            <div className='max-w-[1140px] mx-auto mt-[80px]'>{props.children}</div>
        </div>
    )
}

export default MainLayout
