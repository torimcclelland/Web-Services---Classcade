import styled from "styled-components";

export const Container = styled.div`
  font-family: "Poppins", sans-serif;
  background: linear-gradient(135deg, #ddf9ea, #ddf9ea);
  color: #333;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const Hero = styled.div`
  margin-top: 80px;
  max-width: 800px;
  padding: 20px;

  h1 {
    font-size: 4rem;
    margin-bottom: 10px;
    color: #274de4;
  }
`;

export const HeroTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;
export const Tagline = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #444;
`;

export const HeroText = styled.div`
  text-align: left;

  h1 {
    font-size: 3.5rem;
    margin-bottom: 10px;
    color: #274de4;
  }

  ${Tagline} {
    font-size: 1.6rem;
    margin-bottom: 0;
  }
`;

export const LogoImage = styled.img`
  width: 240px;
  height: auto;
`;

export const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 40px;
  color: #555;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
`;

export const Features = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 40px;
  max-width: 1000px;
  width: 100%;

  @media (max-width: 900px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

export const FeatureCard = styled.div`
  flex: 1;
  min-width: 280px;
  max-width: 320px;
  background: #fff;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #274de4;
  }

  p {
    font-size: 1rem;
    line-height: 1.4;
    color: #555;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 25px rgba(0,0,0,0.15);
  }
`;

