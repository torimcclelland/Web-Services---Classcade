import styled from "styled-components";

export const Container = styled.div`
  font-family: "Poppins", sans-serif;
  background: linear-gradient(135deg, #ddf9ea, #ddf9ea);
  color: #333;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
  gap: 20px;
`;

export const Hero = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  padding: 10px;

  h1 {
    font-size: 3rem;
    margin-bottom: 5px;
    color: #274de4;
  }
`;

export const LogoImage = styled.img` width: 240px; height: auto; `;

export const HeroTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;


export const Tagline = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #444;
`;
export const HeroText = styled.div` text-align: left; h1 { font-size: 3.5rem; margin-bottom: 10px; color: #274de4; } ${Tagline} { font-size: 1.6rem; margin-bottom: 0; } `;


export const Description = styled.p`
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 20px;
  color: #555;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
`;
export const Features = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  max-width: 1000px;
  width: 100%;
  margin-bottom: 10vh;
  background: linear-gradient(135deg, #ddf9ea, #ddf9ea);

  @media (max-width: 900px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;


export const FeatureCard = styled.div`
  flex: 1;
  min-height: 150px;
  max-width: 500px;
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  h2 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    color: #274de4;
  }

  p {
    font-size: 0.9rem;
    line-height: 1.3;
    color: #555;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  }
`;
