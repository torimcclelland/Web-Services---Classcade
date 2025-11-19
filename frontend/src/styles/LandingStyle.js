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

export const LogoImage = styled.img`
  width: 240px;
  height: auto;
  margin-bottom: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

export const Tagline = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #444;
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
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 60px;
  gap: 30px;
  max-width: 1000px;
`;

export const FeatureCard = styled.div`
  background: #fff;
  border-radius: 15px;
  padding: 25px;
  width: 280px;
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


