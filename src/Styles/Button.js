import styled from 'styled-components'
import Colors from './Colors'

export const Button = styled.button`
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    background: transparent;

    &:hover * {
        color: ${Colors.highlight};
        /* transition: color 0.3s; */
    }
`

export const SquareButton = styled(Button)`
    height: 24px;
    width: 24px;
`