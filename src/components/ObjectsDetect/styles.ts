import styled from "styled-components";

export const ObjectsDetectContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const DetectorContainer = styled.div`
  min-width: 200px;
  height: 500px;
  border: 3px solid #fff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const TargetImg = styled.img`
  height: 100%;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const SelectButton = styled.button`
  padding: 7px 10px;
  border: 2px solid transparent;
  background-color: #fff;
  color: #0a0f22;
  font-size: 16px;
  font-weight: 500;
  outline: none;
  margin-top: 2em;
  cursor: pointer;
  transition: all 260ms ease-in-out;
`;

export const TargetBox = styled.div<{ 
    x: number,
    y: number,
    width: number,
    height: number,
    classType: string,
    score: number
}>`
  position: absolute;
  left: ${({ x }) => x + "px"};
  top: ${({ y }) => y + "px"};
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};
  border: 4px solid #1ac71a;
  background-color: transparent;
  z-index: 20;
  &::before {
    content: "${({ classType, score }) => `${classType} ${score.toFixed(1)}%`}";
    color: #1ac71a;
    font-weight: 500;
    font-size: 17px;
    position: absolute;
    top: -1.5em;
    left: -5px;
  }
`;

export const InformaitionContainer = styled.div`

`;