import styled from 'styled-components'
import Colors from './Colors'

export const HorizontalDivider = styled.div`
    border: ${props => props.width || '2px'} solid ${props => Colors[props.color] || Colors.accent};
    width: 90%;
    margin: 0 auto;
`

export const VerticalDivider = styled.div`
    border: ${props => props.width || '2px'} solid ${props => Colors[props.color] || Colors.accent};
    height: ${props => props.height || '90%'};
    margin: auto 0;
`