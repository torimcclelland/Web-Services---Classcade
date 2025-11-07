import styled from "styled-components";

export const StatsContainer = styled.div`
  background-color: #f3f4f6;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
`;

export const ChartsWrapper = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

export const ChartBox = styled.div`
  flex: 1;
  min-width: 300px;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SummaryBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const SummaryItem = styled.p`
  font-size: 1rem;
  margin: 0.5rem 0;
  color: #555;

  strong {
    color: #222;
  }
`;

export const ProfileCircle = styled.div`
  display: flex;
  justify-content: right;
  margin: 1rem 0;
`;

export const ContentRow = styled.div`
  display: flex;
  flex: 1;
`;

export const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  position: relative;
  background-color: #f3f4f6;
  overflow-y: auto;
`;

export const ProfileRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;
