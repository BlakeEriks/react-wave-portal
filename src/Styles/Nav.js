import styled from 'styled-components'

export const NavBarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    height: 5em;
`

export const NavTitle = styled.div`
    font-size: ${props => props.size ? props.size : '32px'}
`

