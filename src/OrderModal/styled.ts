import styled from 'styled-components';

export const Footer = styled.div`
  // display: flex;
  // justify-content: space-between;
`;


export const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 0;
  background-color: white;
  &:not(:first-child) {
    border-top: 1px solid #ccc;
  }
`;

export const ItemTitle = styled.div`
  flex: 1;
  padding: 0 10px;
`;

export const DragBtn = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
`;
